import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CopyButton({ text, testId, className, label = "Copy" }: { text: string; testId: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast.success("Copied to clipboard", { id: "copied", duration: 1500 });
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Couldn't copy — select the text manually");
    }
  };
  return (
    <button type="button" onClick={onCopy} data-testid={testId} aria-label={label}
      className={cn("inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-[background-color,color,transform] duration-200 hover:bg-white/10 hover:text-white active:scale-95", className)}>
      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Dark terminal window with an optional command to copy. */
export function TerminalWindow({ title = "ezorb — bash", children, copy, copyTestId = "copy-install-btn", className }: {
  title?: string;
  children: React.ReactNode;
  copy?: string;
  copyTestId?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0B101E] shadow-[0_30px_60px_-25px_rgba(15,20,36,0.7)]", className)}>
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 font-mono text-xs text-slate-500">{title}</span>
        {copy && <CopyButton text={copy} testId={copyTestId} className="ml-auto" />}
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed sm:p-5 sm:text-sm">{children}</div>
    </div>
  );
}

/** Single-line install command bar. */
export function InstallCommand({ command, testId = "copy-install-btn" }: { command: string; testId?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B101E] py-2.5 pl-4 pr-2.5 font-mono text-sm shadow-lg" data-testid="install-command">
      <span className="select-none text-[#8A5CCB]">$</span>
      <code className="min-w-0 flex-1 truncate text-slate-200">
        {command.split(" ").map((w, i) => (
          <span key={i} className={i === 0 ? "text-[#4DB8D8]" : i === 1 ? "text-slate-300" : "text-[#A99BD4]"}>{w}{" "}</span>
        ))}
      </code>
      <CopyButton text={command} testId={testId} />
    </div>
  );
}