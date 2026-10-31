import { Link } from "react-router-dom";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Logo } from "@/components/Logo";

const linkCls = "text-sm text-[#5B6478] transition-colors duration-200 hover:text-[#3B4FC4] dark:text-[#9AA3BA] dark:hover:text-[#4DB8D8]";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#D7DEEC] bg-white/70 backdrop-blur dark:border-white/10 dark:bg-[#0A0D18]" data-testid="footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Logo testId="footer-logo-link" imgClassName="h-16" />
          <p className="max-w-xs text-sm leading-relaxed text-[#5B6478] dark:text-[#9AA3BA]">
            The official package registry for EzOrb Linux — the operating system where knowledge meets AI agents.
          </p>
          <div className="flex gap-3">
            <a href="https://github.com/alazza15/ezorb-linux" target="_blank" rel="noreferrer" aria-label="GitHub" data-testid="footer-github-icon"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#D7DEEC] text-[#1E4A9E] transition-colors hover:border-[#3B4FC4] dark:border-white/10 dark:text-white">
              <SiGithub size={16} />
            </a>
            <a href="https://discord.gg/ezorb" target="_blank" rel="noreferrer" aria-label="Discord" data-testid="footer-discord-icon"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#D7DEEC] text-[#1E4A9E] transition-colors hover:border-[#3B4FC4] dark:border-white/10 dark:text-white">
              <SiDiscord size={16} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E4A9E] dark:text-[#E2E8F0]">Registry</h4>
          <ul className="space-y-2.5">
            <li><Link to="/packages" className={linkCls} data-testid="footer-packages-link">Browse packages</Link></li>
            <li><Link to="/categories" className={linkCls} data-testid="footer-categories-link">Categories</Link></li>
            <li><Link to="/my-packages" className={linkCls} data-testid="footer-publish-link">Publish a package</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E4A9E] dark:text-[#E2E8F0]">Resources</h4>
          <ul className="space-y-2.5">
            <li><Link to="/docs" className={linkCls} data-testid="footer-docs-link">Docs</Link></li>
            <li><a href="https://github.com/alazza15/ezorb-linux" target="_blank" rel="noreferrer" className={linkCls} data-testid="footer-github-link">GitHub</a></li>
            <li><Link to="/community" className={linkCls} data-testid="footer-community-link">Community</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E4A9E] dark:text-[#E2E8F0]">Legal</h4>
          <ul className="space-y-2.5">
            <li><a href="https://github.com/alazza15/ezorb-linux/blob/main/LICENSE" target="_blank" rel="noreferrer" className={linkCls} data-testid="footer-license-link">License (MIT)</a></li>
            <li><Link to="/docs#faq" className={linkCls} data-testid="footer-faq-link">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#D7DEEC] dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-[#5B6478] sm:flex-row sm:items-center lg:px-8 dark:text-[#9AA3BA]">
          <p data-testid="footer-copyright">© {new Date().getFullYear()} EzOrb Linux Project. All rights reserved.</p>
          <p className="font-mono">ezorb-pm · registry v3</p>
        </div>
      </div>
    </footer>
  );
}