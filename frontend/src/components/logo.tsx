import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** The user's EzOrb logo, used as-is. In dark mode it sits on a light chip so the navy wordmark stays legible. */
export function Logo({ className, imgClassName, to = "/", testId = "brand-logo-link" }: {
  className?: string;
  imgClassName?: string;
  to?: string;
  testId?: string;
}) {
  return (
    <Link to={to} data-testid={testId} className={cn("logo-chip inline-flex shrink-0 items-center p-0.5", className)}>
      <img src="/brand/ezorb-logo-sm.png" alt="EzOrb" className={cn("h-11 w-auto select-none", imgClassName)} draggable={false} />
    </Link>
  );
}