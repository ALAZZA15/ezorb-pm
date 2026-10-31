import { Fragment, type ReactNode } from "react";
import { CopyButton } from "@/components/Terminal";

/** Minimal, safe markdown renderer (headings, lists, code fences, inline code/bold/links). */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) {
      out.push(<code key={k} className="rounded-md bg-[#3B4FC4]/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#1E4A9E] dark:bg-white/10 dark:text-[#9FD9EA]">{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={k} className="font-semibold">{tok.slice(2, -2)}</strong>);
    } else {
      const lm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      const href = /^https?:\/\//.test(lm[2]) ? lm[2] : "#";
      out.push(<a key={k} href={href} target="_blank" rel="noreferrer" className="font-medium text-link underline-offset-4 hover:underline">{lm[1]}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function CodeBlock({ code, lang, testId = "code-block-copy-btn" }: { code: string; lang?: string; testId?: string }) {
  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#0B101E]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{lang || "shell"}</span>
        <CopyButton text={code} testId={testId} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200"><code>{code}</code></pre>
    </div>
  );
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={key++} code={buf.join("\n")} lang={lang} testId={`readme-code-copy-${key}`} />);
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const cls = level === 1 ? "mt-2 mb-3 text-2xl font-bold text-heading" : level === 2 ? "mt-7 mb-2 text-lg font-semibold text-heading" : "mt-5 mb-2 font-semibold text-heading";
      const Tag = (`h${level + 1}`) as "h2" | "h3" | "h4";
      blocks.push(<Tag key={key++} className={cls}>{inline(h[2], `h${key}`)}</Tag>);
      i++;
      continue;
    }
    if (/^(\s*[-*]|\s*\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(\s*[-*]|\s*\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^(\s*[-*]|\s*\d+\.)\s+/, ""));
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag key={key++} className={`my-3 space-y-1.5 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-[#4DB8D8]`}>
          {items.map((it, j) => <li key={j} className="leading-relaxed">{inline(it, `li${key}-${j}`)}</li>)}
        </ListTag>,
      );
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(<p key={key++} className="my-3 leading-relaxed">{inline(para.join(" "), `p${key}`)}</p>);
  }
  return <div className="text-[15px] text-foreground" data-testid="markdown-content">{blocks.map((b, j) => <Fragment key={j}>{b}</Fragment>)}</div>;
}