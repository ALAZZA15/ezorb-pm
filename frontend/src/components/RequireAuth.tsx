import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useMe } from "@/hooks/useMe";
import type { User } from "@/lib/types";

/** Renders children with the signed-in user; redirects signed-out visitors to /login?next=… */
export function RequireAuth({ children }: { children: (user: User) => ReactNode }) {
  const { data: user, isLoading, isError } = useMe();
  const loc = useLocation();
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground" data-testid="auth-loading">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }
  if (isError) {
    return <p className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">We couldn't reach the registry. Please refresh in a moment.</p>;
  }
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  return <>{children(user)}</>;
}