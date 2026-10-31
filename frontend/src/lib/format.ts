import { format, formatDistanceToNow } from "date-fns";
import { ApiError } from "./api";

const compactFmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullFmt = new Intl.NumberFormat("en");

export const compact = (n: number) => compactFmt.format(n);
export const fullNumber = (n: number) => fullFmt.format(n);
export const shortDate = (iso: string) => format(new Date(iso), "MMM d, yyyy");
export const ago = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });

/** Human-readable message from an ApiError (FastAPI `detail` string or 422 list). */
export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (err instanceof ApiError) {
    const body = err.body as { detail?: unknown } | null;
    const detail = body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length) {
      const first = detail[0] as { msg?: string; loc?: (string | number)[] };
      const field = first.loc?.[first.loc.length - 1];
      return field ? `${String(field)}: ${first.msg ?? "invalid"}` : (first.msg ?? fallback);
    }
  }
  return fallback;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}