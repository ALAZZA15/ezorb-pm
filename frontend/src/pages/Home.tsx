import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Boxes, Cpu, Download, Feather, Search, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";
import type { CategoryCount, PackageList, Stats } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { compact, fullNumber } from "@/lib/format";
import { PackageCard, PackageCardSkeleton } from "@/components/PackageCard";
import { TerminalWindow } from "@/components/Terminal";
import { Reveal } from "@/components/Reveal";

const QUICK = ["ezorb-agent-runtime", "neural-shell", "kernel-sentinel", "hyper-term"];

const FEATURES = [
  { icon: Zap, title: "Blazing fast", text: "Parallel, delta-compressed downloads and a content-addressed store resolve and install most packages in under two seconds." },
  { icon: ShieldCheck, title: "Secure by default", text: "Every package is signed, reproducibly built and scanned by kernel-sentinel before it reaches the registry." },
  { icon: Cpu, title: "AI-agent integrated", text: "Agents can discover, sandbox and update tools on your behalf — always with explicit, auditable permissions." },
  { icon: Feather, title: "Lightweight", text: "A single 4 MB static binary with no daemon. Packages share libraries, so your system stays lean." },
];

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B4FC4] dark:text-[#4DB8D8]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-heading sm:text-3xl">{title}</h2>
        <div className="accent-line mt-3" />
      </div>
      {action}
    </div>
  );
}

function HeroTerminal() {
  const reduce = useReducedMotion();
  const lines = [
    { t: "Resolving ezorb-agent-runtime@2.4.0 …", c: "text-slate-400" },
    { t: "↳ 3 dependencies · 48.2 MB · signature verified ✔", c: "text-slate-400" },
    { t: "Installing ████████████████████ 100%", c: "text-[#A99BD4]" },
    { t: "✔ ezorb-agent-runtime ready — run `agentctl status`", c: "text-emerald-400" },
  ];
  return (
    <TerminalWindow copy="ezorb install ezorb-agent-runtime" copyTestId="hero-copy-install-btn" className="relative">
      <p data-testid="hero-install-command">
        <span className="text-[#8A5CCB]">ezorb $ </span>
        <span className="text-[#4DB8D8]">ezorb</span> <span className="text-slate-200">install</span>{" "}
        <span className="text-[#A99BD4]">&lt;package&gt;</span>
      </p>
      <p className="mt-1 text-slate-500"># e.g.</p>
      <p>
        <span className="text-[#8A5CCB]">ezorb $ </span>
        <span className="text-[#4DB8D8]">ezorb</span> <span className="text-slate-200">install</span>{" "}
        <span className="text-white">ezorb-agent-runtime</span>
      </p>
      {lines.map((l, i) => (
        <motion.p key={i} className={l.c} initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.45, duration: 0.35 }}>
          {l.t}
        </motion.p>
      ))}
      <p className="mt-1"><span className="text-[#8A5CCB]">ezorb $ </span><span className="animate-caret inline-block h-4 w-2 translate-y-0.5 bg-[#4DB8D8]" /></p>
    </TerminalWindow>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (params.get("signed_in") === "github") {
      toast.success("Signed in with GitHub", { id: "gh-welcome" });
      params.delete("signed_in");
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  const stats = useQuery({ queryKey: ["stats"], queryFn: () => apiGet<Stats>("/stats") });
  const trending = useQuery({ queryKey: ["packages", "trending"], queryFn: () => apiGet<PackageList>("/packages?sort=popular&page_size=6") });
  const newest = useQuery({ queryKey: ["packages", "newest"], queryFn: () => apiGet<PackageList>("/packages?sort=newest&page_size=4") });
  const cats = useQuery({ queryKey: ["categories"], queryFn: () => apiGet<CategoryCount[]>("/categories") });
  const countFor = (name: string) => (cats.isError ? undefined : cats.data?.find((c) => c.name === name)?.count);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/packages?q=${encodeURIComponent(q.trim())}` : "/packages");
  };

  const statItems = [
    { icon: Boxes, label: "Total packages", value: stats.data ? fullNumber(stats.data.total_packages) : "—", id: "stat-total-packages" },
    { icon: Download, label: "Total downloads", value: stats.data ? compact(stats.data.total_downloads) : "—", id: "stat-total-downloads" },
    { icon: Users, label: "Publishers", value: stats.data ? fullNumber(stats.data.publishers) : "—", id: "stat-publishers" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="hero-surface brushed relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border border-white/60 dark:border-white/10" data-testid="hero-section">
          <img src="/brand/ezorb-mark.png" alt="" aria-hidden className="animate-orb-float pointer-events-none absolute -right-16 -bottom-24 w-[520px] opacity-[0.12] blur-[1px] dark:opacity-[0.08]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
            <div>
              <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[#1E4A9E] dark:text-[#CBD5E1]" data-testid="hero-badge">
                <Sparkles className="size-3.5 text-[#8A5CCB]" /> Official registry of EzOrb Linux
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-6 text-[40px] leading-[1.06] font-extrabold tracking-[-0.035em] text-[#1E4A9E] sm:text-6xl lg:text-[64px] dark:text-white" data-testid="hero-title">
                Every tool your <span className="text-signature">AI-native OS</span> needs.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-[#374151] sm:text-lg dark:text-[#CBD5E1]" data-testid="hero-subtitle">
                Search, install and publish signed packages for EzOrb Linux — from kernel monitors to autonomous agents — with one command.
              </motion.p>

              <motion.form onSubmit={onSearch} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
                className="glass mt-8 flex items-center gap-2 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[#3B4FC4]/50" data-testid="hero-search-form">
                <Search className="ml-3 size-5 shrink-0 text-[#3B4FC4] dark:text-[#4DB8D8]" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 14+ packages — e.g. agent, vpn, terminal"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base text-[#1F2937] outline-none placeholder:text-[#5B6478]/80 dark:text-white dark:placeholder:text-[#9AA3BA]"
                  data-testid="hero-search-input" aria-label="Search packages" />
                <button type="submit" className="btn-signature inline-flex h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-semibold" data-testid="hero-search-submit">
                  <span className="hidden sm:inline">Search</span> <ArrowRight className="size-4" />
                </button>
              </motion.form>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#374151] dark:text-[#CBD5E1]">
                <span className="font-medium">Popular:</span>
                {QUICK.map((n) => (
                  <Link key={n} to={`/packages/${n}`} data-testid={`hero-quick-${n}`}
                    className="rounded-full border border-white/70 bg-white/50 px-2.5 py-1 font-mono transition-colors duration-200 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    {n}
                  </Link>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.25 }} className="relative lg:pl-6">
              <div className="animate-glow absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-[#4DB8D8]/30 via-[#3B4FC4]/20 to-[#8A5CCB]/30 blur-2xl" />
              <HeroTerminal />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* STATS */}
        <section className="relative z-10 -mt-8 grid gap-4 sm:grid-cols-3" data-testid="stats-section">
          {statItems.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <div className="glass flex items-center gap-4 rounded-2xl px-5 py-5">
                <span className="bg-signature inline-flex size-11 items-center justify-center rounded-xl text-white shadow-md"><s.icon className="size-5" /></span>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-[#1E4A9E] tabular-nums dark:text-white" data-testid={s.id}>{s.value}</p>
                  <p className="text-sm text-[#5B6478] dark:text-[#9AA3BA]">{s.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* TRENDING + NEW */}
        <section className="mt-20 grid gap-10 lg:grid-cols-[1.75fr_1fr]">
          <div data-testid="trending-section">
            <SectionHeading eyebrow="Most installed" title="Trending packages"
              action={<Link to="/packages?sort=popular" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline" data-testid="trending-view-all">View all <ArrowRight className="size-4" /></Link>} />
            <div className="grid gap-4 sm:grid-cols-2">
              {trending.isLoading && Array.from({ length: 4 }).map((_, i) => <PackageCardSkeleton key={i} />)}
              {trending.isError && <p className="text-sm text-muted-foreground">Trending packages are unavailable right now.</p>}
              {!trending.isError && trending.data?.items.map((p, i) => <Reveal key={p.id} delay={i * 0.05}><PackageCard pkg={p} /></Reveal>)}
            </div>
          </div>
          <div data-testid="newest-section">
            <SectionHeading eyebrow="Fresh off the build farm" title="Newly added"
              action={<Link to="/packages?sort=newest" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline" data-testid="newest-view-all">All new <ArrowRight className="size-4" /></Link>} />
            <div className="grid gap-4">
              {newest.isLoading && Array.from({ length: 3 }).map((_, i) => <PackageCardSkeleton key={i} />)}
              {newest.isError && <p className="text-sm text-muted-foreground">New packages are unavailable right now.</p>}
              {!newest.isError && newest.data?.items.map((p, i) => <Reveal key={p.id} delay={i * 0.05}><PackageCard pkg={p} showUpdated /></Reveal>)}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-24" data-testid="categories-section">
          <SectionHeading eyebrow="Explore" title="Browse by category"
            action={<Link to="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline" data-testid="categories-view-all">All categories <ArrowRight className="size-4" /></Link>} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c, i) => {
              const count = countFor(c.name);
              return (
                <Reveal key={c.name} delay={i * 0.05}>
                  <Link to={`/packages?category=${encodeURIComponent(c.name)}`} data-testid={`home-category-${c.name.toLowerCase().replace(" ", "-")}`}
                    className="lift group flex h-full flex-col items-start gap-4 rounded-2xl border border-[#D7DEEC] bg-white/80 p-5 dark:border-white/10 dark:bg-[#1A2038]/80">
                    <span className={`inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.tint} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]`}>
                      <c.icon className="size-6" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">{c.name}</p>
                      <p className="text-xs text-[#5B6478] dark:text-[#9AA3BA]">{count === undefined ? "Packages" : `${count} package${count === 1 ? "" : "s"}`}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* WHY */}
        <section className="mt-24" data-testid="why-section">
          <SectionHeading eyebrow="Why EzOrb?" title="Built for a knowledge-first, agent-native OS" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07} className={i === 0 ? "lg:row-span-2" : i === 3 ? "lg:col-span-2" : ""}>
                <div className={`lift relative h-full overflow-hidden rounded-2xl border p-6 ${i === 0 ? "border-transparent bg-[#0F1424] text-white dark:bg-[#141A30]" : "border-[#D7DEEC] bg-white/85 dark:border-white/10 dark:bg-[#1A2038]/85"}`} data-testid={`feature-${i}`}>
                  {i === 0 && <div className="bg-signature pointer-events-none absolute -top-20 -right-20 size-64 rounded-full opacity-40 blur-3xl" />}
                  <span className={`relative inline-flex size-11 items-center justify-center rounded-xl ${i === 0 ? "bg-white/10 text-[#4DB8D8]" : "bg-[#3B4FC4]/10 text-[#3B4FC4] dark:bg-[#4DB8D8]/10 dark:text-[#4DB8D8]"}`}>
                    <f.icon className="size-5" />
                  </span>
                  <h3 className={`relative mt-5 text-lg font-semibold ${i === 0 ? "text-white" : "text-[#1F2937] dark:text-white"}`}>{f.title}</h3>
                  <p className={`relative mt-2 text-sm leading-relaxed ${i === 0 ? "text-slate-300" : "text-[#5B6478] dark:text-[#9AA3BA]"}`}>{f.text}</p>
                  {i === 0 && (
                    <div className="relative mt-8 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed text-slate-300">
                      <p><span className="text-[#8A5CCB]">$</span> time ezorb install hyper-term</p>
                      <p className="text-emerald-400">✔ installed in 1.42s</p>
                      <p className="text-slate-500">real 0m1.420s · 28.7 MB · 2 deps</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Reveal>
          <section className="hero-surface brushed relative mt-24 overflow-hidden rounded-3xl border border-white/60 px-6 py-12 sm:px-12 dark:border-white/10" data-testid="publish-cta">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1E4A9E] sm:text-3xl dark:text-white">Ship your tool to every EzOrb machine.</h2>
                <p className="mt-2 max-w-xl text-[#374151] dark:text-[#CBD5E1]">Create a free publisher account and push your first package in minutes.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/my-packages" className="btn-signature inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold" data-testid="cta-publish-button">Publish a package</Link>
                <Link to="/docs#publishing" className="glass inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-[#1E4A9E] dark:text-white" data-testid="cta-docs-button">Read the guide</Link>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}