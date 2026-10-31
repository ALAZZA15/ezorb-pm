import type { ReactNode } from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function GithubButton() {
  return (
    <a
      href="https://github.com/alazza15/ezorb-linux"
      target="_blank"
      rel="noreferrer"
      data-testid="github-login-button"
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#1F2937] text-sm font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:bg-[#111827] active:scale-[0.99] dark:bg-white dark:text-[#0F1424] dark:hover:bg-[#E2E8F0]"
    >
      <SiGithub size={18} /> View on GitHub
    </a>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-[#5B6478] dark:text-[#9AA3BA]">
      <span className="h-px flex-1 bg-[#C9D6EE] dark:bg-white/10" /> or <span className="h-px flex-1 bg-[#C9D6EE] dark:bg-white/10" />
    </div>
  );
}

/** Gradient + brushed backdrop with a centered glass card and the logo above it. */
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <section className="hero-surface brushed relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="animate-glow pointer-events-none absolute -top-24 -left-24 size-[380px] rounded-full bg-[#4DB8D8]/30 blur-3xl" />
      <div className="animate-glow pointer-events-none absolute -right-24 -bottom-24 size-[420px] rounded-full bg-[#8A5CCB]/30 blur-3xl [animation-delay:2s]" />
      <div className="relative w-full max-w-[440px]">
        <div className="mb-6 flex justify-center">
          <img src="/brand/ezorb-logo-sm.png" alt="EzOrb" className="animate-orb-float h-28 w-auto drop-shadow-[0_12px_24px_rgba(59,79,196,0.25)]" data-testid="auth-logo" />
        </div>
        <div className="glass rounded-2xl p-7 sm:p-8" data-testid="auth-card">
          <h1 className="text-2xl font-bold tracking-tight text-[#1E4A9E] dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-[#5B6478] dark:text-[#9AA3BA]">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-5 text-center text-sm text-[#374151] dark:text-[#CBD5E1]">{footer}</div>
      </div>
    </section>
  );
}

export function FieldError({ msg, testId }: { msg?: string; testId: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]" data-testid={testId}>{msg}</p>;
}