import math
import re
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from lib.db import db
from lib.security import aware, require_user, utcnow
from models.package import (
    CATEGORIES,
    Category,
    CategoryCount,
    Package,
    PackageList,
    PackageSummary,
    PublishIn,
    SortKey,
    Stats,
    VersionEntry,
)
from models.user import OkOut

router = APIRouter(tags=["packages"])

_SUMMARY_PROJECTION = {"_id": 0, "readme": 0, "versions": 0, "dependencies": 0}
_SORTS = {
    "popular": [("downloads", -1), ("name", 1)],
    "newest": [("created_at", -1), ("name", 1)],
    "name": [("name", 1)],
}


def _fix_dates(doc: dict) -> dict:
    for key in ("created_at", "updated_at"):
        if key in doc:
            doc[key] = aware(doc[key])
    for v in doc.get("versions", []):
        v["released_at"] = aware(v["released_at"])
    return doc


@router.get("/packages", response_model=PackageList)
async def list_packages(
    q: Optional[str] = None,
    category: Optional[Category] = None,
    sort: SortKey = "popular",
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=48),
):
    filt: dict = {}
    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        filt["$or"] = [
            {"name": rx},
            {"description": rx},
            {"tags": rx},
            {"publisher": rx},
        ]
    if category:
        filt["category"] = category
    total = await db.packages.count_documents(filt)
    docs = await (
        db.packages.find(filt, _SUMMARY_PROJECTION)
        .sort(_SORTS[sort])
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list(page_size)
    )
    return PackageList(
        items=[PackageSummary(**_fix_dates(d)) for d in docs],
        total=total,
        page=page,
        pages=max(1, math.ceil(total / page_size)),
        page_size=page_size,
    )


@router.get("/stats", response_model=Stats)
async def stats():
    total = await db.packages.count_documents({})
    agg = await db.packages.aggregate(
        [{"$group": {"_id": None, "d": {"$sum": "$downloads"}}}]
    ).to_list(1)
    publishers = await db.packages.distinct("publisher")
    return Stats(
        total_packages=total,
        total_downloads=agg[0]["d"] if agg else 0,
        publishers=len(publishers),
    )


@router.get("/categories", response_model=List[CategoryCount])
async def categories():
    out = []
    for name in CATEGORIES:
        count = await db.packages.count_documents({"category": name})
        top = (
            await db.packages.find({"category": name}, {"_id": 0, "name": 1})
            .sort("downloads", -1)
            .limit(3)
            .to_list(3)
        )
        out.append(CategoryCount(name=name, count=count, top=[t["name"] for t in top]))
    return out


@router.get("/packages/mine", response_model=List[PackageSummary])
async def my_packages(user: dict = Depends(require_user)):
    docs = (
        await db.packages.find({"owner_id": user["id"]}, _SUMMARY_PROJECTION)
        .sort("updated_at", -1)
        .to_list(200)
    )
    return [PackageSummary(**_fix_dates(d)) for d in docs]


@router.get("/packages/{name}", response_model=Package)
async def get_package(name: str):
    doc = await db.packages.find_one({"name": name}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Package not found")
    return Package(**_fix_dates(doc))


@router.post("/packages", response_model=Package, status_code=201)
async def publish_package(body: PublishIn, user: dict = Depends(require_user)):
    now = utcnow()
    entry = VersionEntry(
        version=body.version,
        released_at=now,
        notes=body.notes or "Published via EzOrb web",
    ).model_dump()
    tags = [t.strip().lower() for t in body.tags if t.strip()][:8]
    fields = {
        "version": body.version,
        "description": body.description,
        "category": body.category,
        "license": body.license,
        "size": f"{body.size_mb:.1f} MB",
        "repository": body.repository or None,
        "readme": body.readme
        or f"# {body.name}\n\n{body.description}\n\n```bash\nezorb install {body.name}\n```",
        "tags": tags,
        "dependencies": [d.model_dump() for d in body.dependencies],
        "updated_at": now,
    }
    existing = await db.packages.find_one({"name": body.name}, {"_id": 0})
    if existing:
        if existing.get("owner_id") != user["id"]:
            raise HTTPException(
                status_code=409,
                detail="This package name is already taken by another publisher",
            )
        if any(v["version"] == body.version for v in existing.get("versions", [])):
            raise HTTPException(
                status_code=409, detail=f"Version {body.version} is already published"
            )
        await db.packages.update_one(
            {"name": body.name},
            {"$set": fields, "$push": {"versions": {"$each": [entry], "$position": 0}}},
        )
    else:
        pkg = Package(
            name=body.name,
            publisher=user["username"],
            downloads=0,
            versions=[VersionEntry(**entry)],
            created_at=now,
            **fields,
        )
        await db.packages.insert_one({**pkg.model_dump(), "owner_id": user["id"]})
    doc = await db.packages.find_one({"name": body.name}, {"_id": 0})
    return Package(**_fix_dates(doc))


@router.delete("/packages/{name}", response_model=OkOut)
async def unpublish_package(name: str, user: dict = Depends(require_user)):
    res = await db.packages.delete_one({"name": name, "owner_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return OkOut()
