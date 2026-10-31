import { Link } from "react-router-dom";
import { Download, ArrowUpRight } from "lucide-react";
import type { PackageSummary } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import { ago, compact } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CategoryBadge({ name, className }: { name: string; className?: string }) {
  const meta = categoryMeta(name);
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-br px-2.5 py-1 text-[11px] font-semibold", meta.tint, className)} data-testid="package-category-badge">
      <Icon className="size-3" /> {name}
    </span>
  );
}

export function PackageCard({ pkg, showUpdated = false }: { pkg: PackageSummary; showUpdated?: boolean }) {
  return (
    <Link to={`/packages/${pkg.name}`} data-testid={`package-card-${pkg.name}`}
      className="lift group relative flex h-full flex-col rounded-2xl border border-[#D7DEEC] bg-white/85 p-5 backdrop-blur hover:border-[#3B4FC4]/40 dark:border-white/10 dark:bg-[#1A2038]/85 dark:hover:border-[#4DB8D8]/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-[15px] font-semibold text-[#1E4A9E] dark:text-white" data-testid="package-card-name">{pkg.name}</h3>
          <p className="mt-0.5 text-xs text-[#5B6478] dark:text-[#9AA3BA]">by <span className="font-medium">{pkg.publisher}</span></p>
        </div>
        <span className="shrink-0 rounded-md bg-[#3B4FC4]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#3B4FC4] dark:bg-[#4DB8D8]/10 dark:text-[#4DB8D8]" data-testid="package-card-version">
          v{pkg.version}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-[#1F2937]/85 dark:text-[#CBD2E1]" data-testid="package-card-description">{pkg.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <CategoryBadge name={pkg.category} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5B6478] dark:text-[#9AA3BA]" data-testid="package-card-downloads">
          {showUpdated ? ago(pkg.created_at) : <><Download className="size-3.5" /> {compact(pkg.downloads)}</>}
        </span>
      </div>
      <ArrowUpRight className="absolute right-4 bottom-14 size-4 text-[#3B4FC4] opacity-0 transition-[opacity,transform] duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 dark:text-[#4DB8D8]" />
    </Link>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="h-[168px] animate-pulse rounded-2xl border border-[#D7DEEC] bg-white/60 p-5 dark:border-white/10 dark:bg-[#1A2038]/60">
      <div className="h-4 w-1/2 rounded bg-[#C9D6EE]/70 dark:bg-white/10" />
      <div className="mt-2 h-3 w-1/4 rounded bg-[#C9D6EE]/50 dark:bg-white/5" />
      <div className="mt-5 h-3 w-full rounded bg-[#C9D6EE]/50 dark:bg-white/5" />
      <div className="mt-2 h-3 w-4/5 rounded bg-[#C9D6EE]/50 dark:bg-white/5" />
    </div>
  );
}