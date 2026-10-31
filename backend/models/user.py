from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    username: str = Field(min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    identifier: str = Field(min_length=1, max_length=254)  # username or email
    password: str = Field(min_length=1, max_length=128)


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=60)
    bio: Optional[str] = Field(default=None, max_length=280)


class UserOut(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    auth_providers: List[str] = []
    created_at: datetime


class GithubStatus(BaseModel):
    configured: bool


class OkOut(BaseModel):
    ok: bool = True
