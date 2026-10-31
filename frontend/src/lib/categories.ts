import { Bot, Code2, Film, Network, Server, Wrench, type LucideIcon } from "lucide-react";
import type { Category } from "./types";

export interface CategoryMeta {
  name: Category;
  icon: LucideIcon;
  blurb: string;
  tint: string; // tailwind classes for the icon tile
}

export const CATEGORIES: CategoryMeta[] = [
  { name: "System", icon: Server, blurb: "Kernels, init, security monitors and low-level OS plumbing.", tint: "from-[#3B4FC4]/15 to-[#3B4FC4]/5 text-[#3B4FC4] dark:text-[#8EA0FF]" },
  { name: "Networking", icon: Network, blurb: "Mesh daemons, VPNs, firewalls and peer discovery.", tint: "from-[#4DB8D8]/20 to-[#4DB8D8]/5 text-[#2A8FB0] dark:text-[#4DB8D8]" },
  { name: "AI Agent", icon: Bot, blurb: "Autonomous agents, runtimes, memory stores and prompt tooling.", tint: "from-[#8A5CCB]/20 to-[#8A5CCB]/5 text-[#8A5CCB] dark:text-[#B994F0]" },
  { name: "Development", icon: Code2, blurb: "SDKs, compilers, terminals and build pipelines.", tint: "from-[#1E4A9E]/15 to-[#1E4A9E]/5 text-[#1E4A9E] dark:text-[#7EA6F0]" },
  { name: "Multimedia", icon: Film, blurb: "Capture, streaming, audio DSP and codecs.", tint: "from-[#A99BD4]/30 to-[#A99BD4]/5 text-[#6E5BB0] dark:text-[#C7BBF0]" },
  { name: "Utilities", icon: Wrench, blurb: "Backups, monitors and everyday command-line helpers.", tint: "from-[#4DB8D8]/15 to-[#8A5CCB]/10 text-[#3B4FC4] dark:text-[#9FD9EA]" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function categoryMeta(name: string): CategoryMeta {
  return CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[0];
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}