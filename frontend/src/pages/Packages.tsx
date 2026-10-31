import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, PackageSearch, Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiGet } from "@/lib/api";
import type { PackageList, SortKey } from "@/lib/types";
import { CATEGORIES, CATEGORY_NAMES } from "@/lib/categories";
import { PackageCard, PackageCardSkeleton } from "@/components/PackageCard";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<SortKey, string> = { popular: "Most popular", newest: "Newest", name: "Name (A–Z)" };
const PAGE_SIZE = 9;

export default function Packages() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const rawCat = params.get("category") ?? "";
  const category = (CATEGORY_NAMES as string[]).includes(rawCat) ? rawCat : "";
  const rawSort = params.get("sort") as SortKey | null;
  const sort: SortKey = rawSort && rawSort in SORT_LABELS ? rawSort : "popular";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft((d) => (d.trim() === q ? d : q)), [q]);

  const update = (patch: Record<string, string | number | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || (k === "page" && v === 1) || (k === "sort" && v === "popular")) next.delete(k);
      else next.set(k, String(v));
    }
    setParams(next, { replace: "q" in patch }); // typing shouldn't flood history
  };

  // debounce typing into the URL
  useEffect(() => {
    if (draft.trim() === q) return;
    const t = setTimeout(() => update({ q: draft.trim() || null, page: 1 }), 300);
    return () => clearTimeout(t);
  }, [draft]);

  const qs = new URLSearchParams({ sort, page: String(page), page_size: String(PAGE_SIZE) });
  if (q) qs.set("q", q);
  if (category) qs.set("category", category);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["packages", "browse", { q, category, sort, page }],
    queryFn: () => apiGet<PackageList>(`/packages?${qs.toString()}`),
    placeholderData: keepPreviousData,
  });

  const pages = data?.pages ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B4FC4] dark:text-[#4DB8D8]">Registry</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl" data-testid="packages-title">Packages</h1>
        <p className="mt-2 text-[#5B6478] dark:text-[#9AA3BA]">Signed, reproducible packages for EzOrb Linux.</p>
      </header>

      <div className="glass sticky top-[72px] z-30 rounded-2xl p-3 sm:p-4" data-testid="packages-filter-bar">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#3B4FC4] dark:text-[#4DB8D8]" />
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search by name, description, tag or publisher"
              className="h-11 w-full rounded-xl border border-[#CBD4E6] bg-white/80 pr-10 pl-10 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#3B4FC4] focus:ring-2 focus:ring-[#3B4FC4]/20 dark:border-white/10 dark:bg-[#0F1424]/70 dark:text-white"
              data-testid="packages-search-input" aria-label="Search packages" />
            {draft && (
              <button type="button" onClick={() => setDraft("")} className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-[#5B6478] hover:text-[#1F2937] dark:hover:text-white" data-testid="packages-search-clear" aria-label="Clear search">
                <X className="size-4" />
              </button>
            )}
          </div>
          <Select value={sort} onValueChange={(v: string) => update({ sort: v, page: 1 })}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-white/80 md:w-48 dark:bg-[#0F1424]/70" data-testid="packages-sort-select">
              <SelectValue>{(v) => `Sort: ${SORT_LABELS[(v as SortKey) ?? "popular"]}`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <SelectItem key={k} value={k} data-testid={`sort-option-${k}`}>{SORT_LABELS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Category filter">
          {[{ name: "", label: "All" }, ...CATEGORIES.map((c) => ({ name: c.name, label: c.name }))].map((c) => {
            const active = category === c.name;
            const Icon = CATEGORIES.find((x) => x.name === c.name)?.icon;
            return (
              <button key={c.label} type="button" onClick={() => update({ category: c.name || null, page: 1 })} aria-pressed={active}
                data-testid={`category-filter-btn-${c.name ? c.name.toLowerCase().replace(" ", "-") : "all"}`}
                className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-[background-color,color,border-color] duration-200",
                  active ? "border-transparent bg-[#3B4FC4] text-white shadow-sm dark:bg-[#4DB8D8] dark:text-[#0F1424]"
                    : "border-[#CBD4E6] bg-white/60 text-[#1E4A9E] hover:border-[#3B4FC4]/50 dark:border-white/10 dark:bg-white/5 dark:text-[#CBD5E1]")}>
                {Icon && <Icon className="size-3.5" />} {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-[#5B6478] dark:text-[#9AA3BA]">
        <p data-testid="packages-result-count">
          {isError ? "Results unavailable" : data ? `${data.total} package${data.total === 1 ? "" : "s"}${q ? ` matching “${q}”` : ""}${category ? ` in ${category}` : ""}` : "Loading…"}
        </p>
        {isFetching && !isLoading && <span className="text-xs">Updating…</span>}
      </div>

      <div className={cn("mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200", isFetching && !isLoading && "opacity-70")} data-testid="packages-grid">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <PackageCardSkeleton key={i} />)}
        {!isError && data?.items.map((p) => <PackageCard key={p.id} pkg={p} />)}
      </div>

      {(isError || (data && data.total === 0)) && (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-[#CBD4E6] py-16 text-center dark:border-white/10" data-testid="packages-empty-state">
          <PackageSearch className="size-10 text-[#A99BD4]" />
          <p className="mt-3 font-semibold text-[#1F2937] dark:text-white">{isError ? "The registry is unreachable right now" : "No packages found"}</p>
          <p className="mt-1 text-sm text-[#5B6478] dark:text-[#9AA3BA]">{isError ? "Please try again in a moment." : "Try a different search term or category."}</p>
          {!isError && (q || category) && (
            <button type="button" onClick={() => { setDraft(""); setParams(new URLSearchParams()); }} className="mt-4 text-sm font-semibold text-link hover:underline" data-testid="packages-reset-filters">Reset filters</button>
          )}
        </div>
      )}

      {data && pages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination" data-testid="packages-pagination">
          <button type="button" disabled={page <= 1} onClick={() => update({ page: page - 1 })} data-testid="pagination-prev"
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#CBD4E6] bg-white/70 px-3 text-sm font-medium transition-colors hover:border-[#3B4FC4] disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-white/5">
            <ChevronLeft className="size-4" /> Prev
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => update({ page: n })} aria-current={n === page ? "page" : undefined} data-testid={`pagination-page-${n}`}
              className={cn("inline-flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                n === page ? "btn-signature" : "border border-[#CBD4E6] bg-white/70 hover:border-[#3B4FC4] dark:border-white/10 dark:bg-white/5")}>
              {n}
            </button>
          ))}
          <button type="button" disabled={page >= pages} onClick={() => update({ page: page + 1 })} data-testid="pagination-next"
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#CBD4E6] bg-white/70 px-3 text-sm font-medium transition-colors hover:border-[#3B4FC4] disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-white/5">
            Next <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}