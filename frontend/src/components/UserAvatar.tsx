import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UserAvatar({ user, className }: { user: User; className?: string }) {
  const label = user.display_name || user.username;
  if (user.avatar_url) {
    return <img src={user.avatar_url} alt={label} className={cn("size-9 rounded-full object-cover ring-2 ring-white/70 dark:ring-white/10", className)} />;
  }
  const initials = label.split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  return (
    <span className={cn("bg-signature inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-white/70 dark:ring-white/10", className)}>
      {initials || "?"}
    </span>
  );
}