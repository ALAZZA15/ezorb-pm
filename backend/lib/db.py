"""Shared Mongo handle — import `client`/`db` from here (server.py, routers, seed.py)."""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel

load_dotenv(Path(__file__).parent.parent / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

logger = logging.getLogger(__name__)

# One entry per collection: every field a route filters, sorts, or dedupes on.
# Applied by ensure_indexes() at startup.
INDEXES: dict[str, list[IndexModel]] = {
    "users": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("username", ASCENDING)], name="username", unique=True),
        IndexModel(
            [("email", ASCENDING)],
            name="email",
            unique=True,
            partialFilterExpression={"email": {"$type": "string"}},
        ),
        IndexModel(
            [("github_id", ASCENDING)],
            name="github_id",
            unique=True,
            partialFilterExpression={"github_id": {"$type": "string"}},
        ),
    ],
    "sessions": [
        IndexModel([("token_hash", ASCENDING)], name="token_hash", unique=True),
        IndexModel(
            [("expires_at", ASCENDING)], name="expires_ttl", expireAfterSeconds=0
        ),
    ],
    "oauth_states": [
        IndexModel([("state", ASCENDING)], name="state", unique=True),
        IndexModel(
            [("expires_at", ASCENDING)], name="expires_ttl", expireAfterSeconds=0
        ),
    ],
    "packages": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("name", ASCENDING)], name="name", unique=True),
        IndexModel([("downloads", DESCENDING)], name="downloads_desc"),
        IndexModel([("created_at", DESCENDING)], name="created_desc"),
        IndexModel(
            [("category", ASCENDING), ("downloads", DESCENDING)],
            name="category_downloads",
        ),
        IndexModel(
            [("owner_id", ASCENDING), ("updated_at", DESCENDING)], name="owner_updated"
        ),
        IndexModel([("publisher", ASCENDING)], name="publisher"),
    ],
}


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:  # one at a time so a bad spec skips only itself
            try:
                await db[collection].create_indexes([model])
            except (
                Exception
            ) as exc:  # never block boot on an index; the log line names what to fix
                logger.error(
                    "ensure_indexes(%s.%s): %s", collection, model.document["name"], exc
                )
