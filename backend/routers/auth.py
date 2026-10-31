import base64
import hashlib
import os
import secrets
import uuid
from datetime import timedelta
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from pymongo.errors import DuplicateKeyError

from lib.db import db
from lib.security import (
    aware,
    create_session,
    destroy_session,
    hash_password,
    require_user,
    utcnow,
    verify_password,
)
from models.user import GithubStatus, LoginIn, OkOut, RegisterIn, UserOut, UserUpdate

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_out(doc: dict) -> UserOut:
    return UserOut(**{**doc, "created_at": aware(doc["created_at"])})


@router.post("/register", response_model=UserOut, status_code=201)
async def register(body: RegisterIn, response: Response):
    username = body.username.lower()
    email = body.email.lower()
    if await db.users.find_one({"username": username}):
        raise HTTPException(status_code=409, detail="That username is already taken")
    if await db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=409, detail="An account with this email already exists"
        )
    doc = {
        "id": str(uuid.uuid4()),
        "username": username,
        "email": email,
        "password_hash": hash_password(body.password),
        "display_name": body.username,
        "bio": None,
        "avatar_url": None,
        "auth_providers": ["password"],
        "created_at": utcnow(),
    }
    try:
        await db.users.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Username or email already in use")
    await create_session(response, doc["id"])
    return _user_out(doc)


@router.post("/login", response_model=UserOut)
async def login(body: LoginIn, response: Response):
    ident = body.identifier.strip().lower()
    query = {"email": ident} if "@" in ident else {"username": ident}
    user = await db.users.find_one(query, {"_id": 0})
    if not user or not verify_password(body.password, user.get("password_hash")):
        raise HTTPException(
            status_code=401, detail="Invalid username/email or password"
        )
    await create_session(response, user["id"])
    return _user_out(user)


@router.post("/logout", response_model=OkOut)
async def logout(request: Request, response: Response):
    await destroy_session(request, response)
    return OkOut()


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(require_user)):
    return _user_out(user)


@router.patch("/me", response_model=UserOut)
async def update_me(body: UserUpdate, user: dict = Depends(require_user)):
    changes = body.model_dump(exclude_unset=True)
    if changes:
        await db.users.update_one({"id": user["id"]}, {"$set": changes})
    doc = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return _user_out(doc)


# ---------------- GitHub OAuth (authorization code + state + PKCE) ----------------


def _gh_creds() -> tuple[str, str]:
    return os.environ.get("GITHUB_CLIENT_ID", ""), os.environ.get(
        "GITHUB_CLIENT_SECRET", ""
    )


def _public_base(request: Request) -> str:
    host = (
        request.headers.get("x-forwarded-host")
        or os.environ.get("APP_URL", "").split("://")[-1]
        or request.headers.get("host", "")
    )
    proto = request.headers.get("x-forwarded-proto", "https").split(",")[0].strip()
    return f"{proto}://{host.split(',')[0].strip().rstrip('/')}"


def _b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def _fail(code: str) -> RedirectResponse:
    return RedirectResponse(f"/login?error={code}", status_code=303)


@router.get("/github/status", response_model=GithubStatus)
async def github_status():
    cid, secret = _gh_creds()
    return GithubStatus(configured=bool(cid and secret))


@router.get("/github/start")
async def github_start(request: Request):
    cid, secret = _gh_creds()
    if not cid or not secret:
        return _fail("github_not_configured")
    state = secrets.token_urlsafe(32)
    verifier = _b64url(secrets.token_bytes(32))
    challenge = _b64url(hashlib.sha256(verifier.encode()).digest())
    redirect_uri = f"{_public_base(request)}/api/auth/github/callback"
    await db.oauth_states.insert_one(
        {
            "state": state,
            "code_verifier": verifier,
            "redirect_uri": redirect_uri,
            "expires_at": utcnow() + timedelta(minutes=10),
        }
    )
    params = {
        "client_id": cid,
        "redirect_uri": redirect_uri,
        "scope": "read:user user:email",
        "state": state,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
        "allow_signup": "true",
    }
    resp = RedirectResponse(
        "https://github.com/login/oauth/authorize?" + urlencode(params), status_code=303
    )
    resp.set_cookie(
        "gh_oauth_state",
        state,
        max_age=600,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/api/auth/github",
    )
    return resp


@router.get("/github/callback")
async def github_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    if error:
        return _fail("github_cancelled")
    cid, secret = _gh_creds()
    if not cid or not secret:
        return _fail("github_not_configured")
    if not code or not state or state != request.cookies.get("gh_oauth_state"):
        return _fail("invalid_oauth_state")
    state_doc = await db.oauth_states.find_one_and_delete({"state": state})
    if not state_doc or aware(state_doc["expires_at"]) <= utcnow():
        return _fail("expired_oauth_state")

    try:
        async with httpx.AsyncClient(
            timeout=10.0, headers={"Accept": "application/json"}
        ) as client:
            tok = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": cid,
                    "client_secret": secret,
                    "code": code,
                    "redirect_uri": state_doc["redirect_uri"],
                    "code_verifier": state_doc["code_verifier"],
                },
            )
            access = tok.json().get("access_token") if tok.status_code == 200 else None
            if not access:
                return _fail("github_token_exchange_failed")
            headers = {
                "Authorization": f"Bearer {access}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            }
            u = await client.get("https://api.github.com/user", headers=headers)
            if u.status_code != 200:
                return _fail("github_user_failed")
            gh = u.json()
            email = None
            e = await client.get("https://api.github.com/user/emails", headers=headers)
            if e.status_code == 200:
                verified = [
                    x for x in e.json() if x.get("verified") and x.get("primary")
                ]
                email = verified[0]["email"].lower() if verified else None
    except (httpx.HTTPError, ValueError):
        return _fail("github_unreachable")

    github_id = str(gh["id"])
    user = await db.users.find_one({"github_id": github_id})
    if not user and email:
        user = await db.users.find_one({"email": email})
    if user:
        await db.users.update_one(
            {"id": user["id"]},
            {
                "$set": {"github_id": github_id, "avatar_url": gh.get("avatar_url")},
                "$addToSet": {"auth_providers": "github"},
            },
        )
        user_id = user["id"]
    else:
        base = (gh.get("login") or "github-user").lower()
        username = base
        while await db.users.find_one({"username": username}):
            username = f"{base}-{secrets.token_hex(2)}"
        doc = {
            "id": str(uuid.uuid4()),
            "username": username,
            "display_name": gh.get("name") or gh.get("login"),
            "bio": gh.get("bio"),
            "avatar_url": gh.get("avatar_url"),
            "github_id": github_id,
            "auth_providers": ["github"],
            "created_at": utcnow(),
        }
        if email:
            doc["email"] = email
        await db.users.insert_one(doc)
        user_id = doc["id"]

    resp = RedirectResponse("/?signed_in=github", status_code=303)
    resp.delete_cookie("gh_oauth_state", path="/api/auth/github")
    await create_session(resp, user_id)
    return resp
