import uuid
from datetime import datetime, timezone
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

Category = Literal[
    "System", "Networking", "AI Agent", "Development", "Multimedia", "Utilities"
]
CATEGORIES: List[str] = [
    "System",
    "Networking",
    "AI Agent",
    "Development",
    "Multimedia",
    "Utilities",
]
SortKey = Literal["popular", "newest", "name"]


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Dependency(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    version: str = Field(min_length=1, max_length=30)


class VersionEntry(BaseModel):
    version: str
    released_at: datetime
    notes: str = ""


class PackageSummary(BaseModel):
    id: str
    name: str
    version: str
    description: str
    category: Category
    publisher: str
    license: str
    downloads: int
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime


class Package(PackageSummary):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    size: str
    repository: Optional[str] = None
    homepage: Optional[str] = None
    readme: str = ""
    dependencies: List[Dependency] = []
    versions: List[VersionEntry] = []
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class PackageList(BaseModel):
    items: List[PackageSummary]
    total: int
    page: int
    pages: int
    page_size: int


class PublishIn(BaseModel):
    name: str = Field(
        min_length=2, max_length=50, pattern=r"^[a-z0-9][a-z0-9-]*[a-z0-9]$"
    )
    version: str = Field(pattern=r"^\d+\.\d+\.\d+$")
    description: str = Field(min_length=10, max_length=200)
    category: Category
    license: str = Field(default="MIT", min_length=2, max_length=40)
    size_mb: float = Field(default=1.0, gt=0, le=10000)
    repository: Optional[str] = Field(default=None, max_length=200)
    readme: str = Field(default="", max_length=20000)
    tags: List[str] = Field(default=[], max_length=8)
    dependencies: List[Dependency] = Field(default=[], max_length=20)
    notes: str = Field(default="", max_length=500)


class Stats(BaseModel):
    total_packages: int
    total_downloads: int
    publishers: int


class CategoryCount(BaseModel):
    name: Category
    count: int
    top: List[str] = []
