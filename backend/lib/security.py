"""Password hashing + opaque httpOnly cookie sessions stored (hashed) in Mongo."""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, Request, Response

from lib.db import db

COOKIE_NAME = "ezorb_session"
SESSION_DAYS = 30
_ITERATIONS = 240_000


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def aware(dt: datetime) -> datetime:
    """Motor returns naive UTC datetimes; normalise before comparing/serialising."""
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"pbkdf2_sha256${_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: Optional[str]) -> bool:
    if not stored:
        return False
    try:
        _, iterations, salt_hex, hash_hex = stored.split("$")
        dk = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(dk.hex(), hash_hex)
    except (ValueError, TypeError):
        return False


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def create_session(response: Response, user_id: str) -> None:
    token = secrets.token_urlsafe(32)
    now = utcnow()
    await db.sessions.insert_one(
        {
            "token_hash": _hash_token(token),
            "user_id": user_id,
            "created_at": now,
            "expires_at": now + timedelta(days=SESSION_DAYS),
        }
    )
    response.set_cookie(
        COOKIE_NAME,
        token,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
        max_age=SESSION_DAYS * 86400,
    )


async def destroy_session(request: Request, response: Response) -> None:
    token = request.cookies.get(COOKIE_NAME)
    if token:
        await db.sessions.delete_one({"token_hash": _hash_token(token)})
    response.delete_cookie(
        COOKIE_NAME, path="/", secure=True, httponly=True, samesite="lax"
    )


async def get_optional_user(request: Request) -> Optional[dict]:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return None
    session = await db.sessions.find_one({"token_hash": _hash_token(token)})
    if not session:
        return None
    if aware(session["expires_at"]) < utcnow():
        await db.sessions.delete_one({"_id": session["_id"]})
        return None
    return await db.users.find_one(
        {"id": session["user_id"]}, {"_id": 0, "password_hash": 0}
    )


async def require_user(user: Optional[dict] = Depends(get_optional_user)) -> dict:
    if not user:
        raise HTTPException(status_code=401, detail="Not signed in")
    return user
