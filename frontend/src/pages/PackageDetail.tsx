import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Download, ExternalLink, FileText, GitBranch, HardDrive, Layers, Scale, Tag, User as UserIcon } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiError, apiGet } from "@/lib/api";
import type { Package } from "@/lib/types";
import { ago, fullNumber, shortDate } from "@/lib/format";
import { CategoryBadge } from "@/components/PackageCard";
import { InstallCommand } from "@/components/Terminal";
import { Markdown } from "@/components/Markdown";

function SideRow({ icon: Icon, label, children, testId }: { icon: typeof Download; label: string; children: React.ReactNode; testId: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#3B4FC4] dark:text-[#4DB8D8]" />
      <div className="min-w-0">
        <p className="text-xs text-[#5B6478] dark:text-[#9AA3BA]">{label}</p>
        <div className="truncate text-sm font-semibold text-[#1F2937] dark:text-white" data-testid={testId}>{children}</div>
      </div>
    </div>
  );
}

export default function PackageDetail() {
  const { name = "" } = useParams();
  const { data: pkg, isLoading, isError, error } = useQuery({
    queryKey: ["package", name],
    queryFn: () => apiGet<Package>(`/packages/${encodeURIComponent(name)}`),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
  });
  const notFound = error instanceof ApiError && error.status === 404;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Link to="/packages" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B6478] transition-colors hover:text-[#3B4FC4] dark:text-[#9AA3BA] dark:hover:text-[#4DB8D8]" data-testid="detail-back-link">
        <ArrowLeft className="size-4" /> All packages
      </Link>

      {isLoading && <div className="mt-6 h-48 animate-pulse rounded-2xl bg-white/60 dark:bg-[#1A2038]/60" />}

      {isError && (
        <div className="mt-10 rounded-2xl border border-dashed border-[#CBD4E6] p-12 text-center dark:border-white/10" data-testid="detail-not-found">
          <p className="font-mono text-lg font-semibold text-heading">{name}</p>
          <p className="mt-2 text-[#5B6478] dark:text-[#9AA3BA]">{notFound ? "This package doesn't exist in the registry." : "We couldn't load this package right now."}</p>
          <Link to="/packages" className="btn-signature mt-5 inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold">Browse packages</Link>
        </div>
      )}

      {pkg && !isError && (
        <>
          <section className="hero-surface brushed relative mt-5 overflow-hidden rounded-3xl border border-white/60 p-6 sm:p-8 dark:border-white/10" data-testid="detail-header">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-3xl font-bold tracking-tight text-[#1E4A9E] sm:text-4xl dark:text-white" data-testid="detail-name">{pkg.name}</h1>
              <span className="bg-signature rounded-lg px-2.5 py-1 font-mono text-sm font-semibold text-white shadow" data-testid="detail-version">v{pkg.version}</span>
              <CategoryBadge name={pkg.category} />
            </div>
            <p className="mt-3 max-w-3xl text-[#374151] sm:text-lg dark:text-[#CBD5E1]" data-testid="detail-description">{pkg.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#374151] dark:text-[#CBD5E1]">
              <span className="inline-flex items-center gap-1.5"><UserIcon className="size-4" /> <span data-testid="detail-publisher">{pkg.publisher}</span></span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" /> Updated <span data-testid="detail-updated">{ago(pkg.updated_at)}</span></span>
              <span className="inline-flex items-center gap-1.5"><Scale className="size-4" /> <span data-testid="detail-license">{pkg.license}</span></span>
            </div>
            <div className="mt-6 max-w-xl">
              <InstallCommand command={`ezorb install ${pkg.name}`} testId="detail-copy-install-btn" />
            </div>
          </section>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <Tabs defaultValue="readme" className="min-w-0">
              <TabsList variant="line" className="w-full justify-start gap-2 border-b border-[#D7DEEC] dark:border-white/10" data-testid="detail-tabs">
                <TabsTrigger value="readme" data-testid="tab-readme"><FileText className="size-4" /> README</TabsTrigger>
                <TabsTrigger value="versions" data-testid="tab-versions"><GitBranch className="size-4" /> Versions <span className="text-xs text-muted-foreground">{pkg.versions.length}</span></TabsTrigger>
                <TabsTrigger value="dependencies" data-testid="tab-dependencies"><Layers className="size-4" /> Dependencies <span className="text-xs text-muted-foreground">{pkg.dependencies.length}</span></TabsTrigger>
              </TabsList>
              <TabsContent value="readme" className="mt-5">
                <article className="rounded-2xl border border-[#D7DEEC] bg-white/85 p-6 sm:p-8 dark:border-white/10 dark:bg-[#1A2038]/85" data-testid="readme-panel">
                  <Markdown source={pkg.readme} />
                </article>
              </TabsContent>
              <TabsContent value="versions" className="mt-5">
                <ol className="relative space-y-3 border-l-2 border-[#C9D6EE] pl-6 dark:border-white/10" data-testid="versions-panel">
                  {pkg.versions.map((v, i) => (
                    <li key={v.version} className="relative rounded-xl border border-[#D7DEEC] bg-white/85 p-4 dark:border-white/10 dark:bg-[#1A2038]/85" data-testid={`version-row-${v.version}`}>
                      <span className={`absolute top-5 -left-[33px] size-3.5 rounded-full ring-4 ring-[#EEF1F8] dark:ring-[#0F1424] ${i === 0 ? "bg-signature" : "bg-[#A99BD4]"}`} />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-semibold text-[#1E4A9E] dark:text-white">v{v.version} {i === 0 && <span className="ml-2 rounded bg-emerald-500/15 px-1.5 py-0.5 font-sans text-[11px] text-emerald-700 dark:text-emerald-400">latest</span>}</span>
                        <span className="text-xs text-[#5B6478] dark:text-[#9AA3BA]">{shortDate(v.released_at)}</span>
                      </div>
                      {v.notes && <p className="mt-1.5 text-sm text-[#5B6478] dark:text-[#9AA3BA]">{v.notes}</p>}
                    </li>
                  ))}
                </ol>
              </TabsContent>
              <TabsContent value="dependencies" className="mt-5">
                <div className="rounded-2xl border border-[#D7DEEC] bg-white/85 p-2 dark:border-white/10 dark:bg-[#1A2038]/85" data-testid="dependencies-panel">
                  {pkg.dependencies.length === 0 ? (
                    <p className="p-6 text-center text-sm text-[#5B6478] dark:text-[#9AA3BA]">This package has no runtime dependencies.</p>
                  ) : (
                    <ul className="divide-y divide-[#E2E8F0] dark:divide-white/5">
                      {pkg.dependencies.map((d) => (
                        <li key={d.name} className="flex items-center justify-between px-4 py-3" data-testid={`dependency-row-${d.name}`}>
                          <Link to={`/packages/${d.name}`} className="font-mono text-sm font-medium text-link hover:underline">{d.name}</Link>
                          <span className="rounded-md bg-[#3B4FC4]/10 px-2 py-0.5 font-mono text-xs text-[#1E4A9E] dark:bg-white/10 dark:text-[#CBD5E1]">{d.version}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <aside className="lg:sticky lg:top-24 lg:self-start" data-testid="detail-sidebar">
              <div className="glass divide-y divide-[#D7DEEC]/70 rounded-2xl px-5 py-2 dark:divide-white/5">
                <SideRow icon={Download} label="Total downloads" testId="sidebar-downloads">{fullNumber(pkg.downloads)}</SideRow>
                <SideRow icon={HardDrive} label="Unpacked size" testId="sidebar-size">{pkg.size}</SideRow>
                <SideRow icon={Scale} label="License" testId="sidebar-license">{pkg.license}</SideRow>
                <SideRow icon={Calendar} label="Last published" testId="sidebar-updated">{shortDate(pkg.updated_at)}</SideRow>
                {pkg.repository && (
                  <SideRow icon={SiGithub as unknown as typeof Download} label="Repository" testId="sidebar-repository">
                    <a href={pkg.repository} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-link hover:underline" data-testid="sidebar-repository-link">
                      {pkg.repository.replace(/^https?:\/\//, "")} <ExternalLink className="size-3" />
                    </a>
                  </SideRow>
                )}
              </div>
              {pkg.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2" data-testid="sidebar-tags">
                  {pkg.tags.map((t) => (
                    <Link key={t} to={`/packages?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1 rounded-full border border-[#CBD4E6] bg-white/60 px-2.5 py-1 text-xs font-medium text-[#1E4A9E] transition-colors hover:border-[#3B4FC4] dark:border-white/10 dark:bg-white/5 dark:text-[#CBD5E1]">
                      <Tag className="size-3" /> {t}
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}