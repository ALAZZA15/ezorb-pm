import { Calendar, ExternalLink, GitBranch, PackageOpen, Tag } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const EZORB_REPO = "https://github.com/ALAZZA15/EzOrb-Linux";
const EZORB_RELEASE = `${EZORB_REPO}/releases/tag/v0.1.0`;
const EZORB_ISO = `${EZORB_REPO}/releases/download/v0.1.0/ezorb.iso`;
const EZORB_RELEASES = `${EZORB_REPO}/releases`;
const KERNEL_REPO = "https://github.com/ALAZZA15/New_Kernel_LFS";

const releases = [
  {
    version: "v0.1.0",
    name: "EzOrb Linux Genesis",
    status: "Initial release",
    date: "November 19, 2026",
    description: "The first EzOrb Linux ISO release. Built with Buildroot and intended for testing in QEMU or VirtualBox.",
    highlights: ["EzOrb Linux", "Linux 6.x", "Buildroot", "ISO · 517.6 MB"],
    releaseUrl: EZORB_RELEASE,
    downloadUrl: EZORB_ISO,
  },
  {
    version: "New Kernel",
    name: "MyOS x86_64",
    status: "Source milestone",
    date: "Kernel source",
    description: "A hand-written minimal x86_64 kernel with Multiboot 1 boot, protected-to-long mode transition, GDT, IDT, VGA text mode, serial output, and CPU exception handling.",
    highlights: ["x86_64", "C + assembly", "GRUB", "32 exception stubs"],
    releaseUrl: KERNEL_REPO,
  },
];

export default function Releases() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B4FC4] dark:text-[#4DB8D8]">Changelog</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl" data-testid="releases-title">Releases EzOrb</h1>
            <p className="mt-2 text-[#5B6478] dark:text-[#9AA3BA]">Build releases, kernel updates, and platform milestones.</p>
          </div>
          <a href={EZORB_RELEASES} target="_blank" rel="noreferrer"
            className="btn-signature inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold" data-testid="releases-github-button">
            GitHub Releases <ExternalLink className="size-4" />
          </a>
        </div>
      </header>

      <div className="relative border-l-2 border-[#C9D6EE] pl-6 dark:border-white/10" data-testid="releases-timeline">
        {releases.map((release, i) => (
          <Reveal key={release.version} delay={i * 0.08}>
            <article className="relative mb-6 rounded-2xl border border-[#D7DEEC] bg-white/85 p-6 dark:border-white/10 dark:bg-[#1A2038]/85" data-testid={`release-${release.version}`}>
              <span className="bg-signature absolute top-7 -left-[33px] size-3.5 rounded-full ring-4 ring-[#EEF1F8] dark:ring-[#0F1424]" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="size-4 text-[#3B4FC4] dark:text-[#4DB8D8]" />
                    <h2 className="font-mono text-xl font-bold text-[#1E4A9E] dark:text-white">{release.version} — {release.name}</h2>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#5B6478] dark:text-[#9AA3BA]">
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {release.date}</span>
                    <span className="inline-flex items-center gap-1"><GitBranch className="size-3.5" /> {release.status}</span>
                  </div>
                </div>
                <a href={release.releaseUrl} target="_blank" rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#CBD4E6] px-3 text-xs font-semibold text-[#1E4A9E] hover:border-[#3B4FC4] dark:border-white/10 dark:text-[#CBD5E1]" data-testid={`release-${release.version}-link`}>
                  View release <ExternalLink className="size-3.5" />
                </a>
              </div>
              {release.downloadUrl && (
                <a href={release.downloadUrl}
                  className="btn-signature mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold" data-testid={`release-${release.version}-download`}>
                  <PackageOpen className="size-4" /> Download EzOrb ISO
                </a>
              )}
              <p className="mt-5 text-sm leading-relaxed text-[#374151] dark:text-[#CBD5E1]">{release.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {release.highlights.map((highlight) => (
                  <span key={highlight} className="rounded-full border border-[#CBD4E6] bg-white/60 px-2.5 py-1 text-xs font-medium text-[#1E4A9E] dark:border-white/10 dark:bg-white/5 dark:text-[#CBD5E1]">
                    {highlight}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-[#CBD4E6] px-6 py-10 text-center dark:border-white/10" data-testid="releases-empty-status">
        <PackageOpen className="size-9 text-[#A99BD4]" />
        <p className="mt-3 font-semibold text-[#1F2937] dark:text-white">More releases are coming</p>
        <p className="mt-1 max-w-md text-sm text-[#5B6478] dark:text-[#9AA3BA]">Prebuilt kernel images and installers will appear here after they are published on GitHub.</p>
        <a href={EZORB_REPO} target="_blank" rel="noreferrer" className="mt-4 text-sm font-semibold text-link hover:underline">
          Open EzOrb Linux repository
        </a>
      </div>
    </div>
  );
}
