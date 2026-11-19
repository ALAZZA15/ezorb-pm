import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Cpu, Download as DownloadIcon, ExternalLink, HardDrive, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TerminalWindow } from "@/components/Terminal";

const KERNEL_REPO = "https://github.com/ALAZZA15/New_Kernel_LFS";
const KERNEL_ZIP = "https://codeload.github.com/ALAZZA15/New_Kernel_LFS/zip/refs/heads/main";
const EZORB_ISO = "https://github.com/ALAZZA15/EzOrb-Linux/releases/download/v0.1.0/ezorb.iso";

export default function Download() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="hero-surface brushed relative overflow-hidden rounded-3xl border border-white/60 px-6 py-12 sm:px-10 dark:border-white/10" data-testid="download-hero">
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B4FC4] dark:text-[#4DB8D8]">EzOrb Linux 0.1 Genesis</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-heading sm:text-5xl" data-testid="download-title">Download EzOrb Linux</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] sm:text-lg dark:text-[#CBD5E1]">
            Try EzOrb Linux 0.1 Genesis in a virtual machine. The ISO is published as a GitHub Release asset.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={EZORB_ISO}
              className="btn-signature inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold" data-testid="download-iso-button">
              <DownloadIcon className="size-4" /> Download ISO · 517.6 MB
            </a>
            <a href="https://github.com/ALAZZA15/EzOrb-Linux/releases/tag/v0.1.0" target="_blank" rel="noreferrer"
              className="glass inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-[#1E4A9E] dark:text-white" data-testid="download-release-notes-button">
              Release notes <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-3" data-testid="download-highlights">
        {[
          { icon: Cpu, title: "Linux 6.x kernel", text: "A custom Linux kernel built as part of the EzOrb Linux system." },
          { icon: ShieldCheck, title: "EzOrb Genesis", text: "The first experimental EzOrb Linux release, built with Buildroot." },
          { icon: HardDrive, title: "For virtual machines", text: "The ISO is optimized for testing with QEMU or VirtualBox." },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="glass h-full rounded-2xl p-5">
              <item.icon className="size-5 text-[#3B4FC4] dark:text-[#4DB8D8]" />
              <h2 className="mt-4 font-semibold text-[#1F2937] dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6478] dark:text-[#9AA3BA]">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B4FC4] dark:text-[#4DB8D8]">Separate kernel project</p>
          <h2 className="mt-2 text-2xl font-bold text-heading">New Kernel LFS source</h2>
          <TerminalWindow copy="git clone https://github.com/ALAZZA15/New_Kernel_LFS.git" copyTestId="download-copy-command" className="mt-5">
            <p><span className="text-[#8A5CCB]">$</span> git clone https://github.com/ALAZZA15/New_Kernel_LFS.git</p>
            <p><span className="text-[#8A5CCB]">$</span> cd New_Kernel_LFS</p>
            <p><span className="text-[#8A5CCB]">$</span> make iso</p>
            <p><span className="text-[#8A5CCB]">$</span> make run</p>
          </TerminalWindow>
          <p className="mt-4 text-sm leading-relaxed text-[#5B6478] dark:text-[#9AA3BA]">
            This is a separate from-scratch x86_64 kernel project, not the Linux 6.x kernel included in EzOrb Linux. Requires x86_64-elf-gcc, NASM, QEMU, grub-mkrescue, and xorriso.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={KERNEL_ZIP} className="btn-signature inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold" data-testid="download-kernel-source-zip">
              <DownloadIcon className="size-4" /> Download kernel source ZIP
            </a>
            <a href={KERNEL_REPO} target="_blank" rel="noreferrer" className="glass inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#1E4A9E] dark:text-white">
              View kernel repository <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        <aside className="glass h-fit rounded-2xl p-5" data-testid="download-status">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <div>
              <h2 className="font-semibold text-[#1F2937] dark:text-white">Release status</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6478] dark:text-[#9AA3BA]">
                EzOrb Linux 0.1 ISO is available above. The separate New Kernel LFS project currently provides source code.
              </p>
              <Link to="/releases" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                View releases <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
