// Hand-written mirrors of the backend Pydantic models (backend/models/*.py) — keep in sync.

export type Category = "System" | "Networking" | "AI Agent" | "Development" | "Multimedia" | "Utilities";
export type SortKey = "popular" | "newest" | "name";

// models/user.py
export interface User {
  id: string;
  username: string;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  auth_providers: string[];
  created_at: string;
}
export interface RegisterIn {
  username: string;
  email: string;
  password: string;
}
export interface LoginIn {
  identifier: string;
  password: string;
}
export interface UserUpdate {
  display_name?: string | null;
  bio?: string | null;
}
export interface GithubStatus {
  configured: boolean;
}
export interface OkOut {
  ok: boolean;
}

// models/package.py
export interface Dependency {
  name: string;
  version: string;
}
export interface VersionEntry {
  version: string;
  released_at: string;
  notes: string;
}
export interface PackageSummary {
  id: string;
  name: string;
  version: string;
  description: string;
  category: Category;
  publisher: string;
  license: string;
  downloads: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}
export interface Package extends PackageSummary {
  size: string;
  repository: string | null;
  homepage: string | null;
  readme: string;
  dependencies: Dependency[];
  versions: VersionEntry[];
}
export interface PackageList {
  items: PackageSummary[];
  total: number;
  page: number;
  pages: number;
  page_size: number;
}
export interface PublishIn {
  name: string;
  version: string;
  description: string;
  category: Category;
  license: string;
  size_mb: number;
  repository: string | null;
  readme: string;
  tags: string[];
  dependencies: Dependency[];
  notes: string;
}
export interface Stats {
  total_packages: number;
  total_downloads: number;
  publishers: number;
}
export interface CategoryCount {
  name: Category;
  count: number;
  top: string[];
}