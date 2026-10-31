import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError, GithubButton, OrDivider } from "@/components/AuthShell";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import { errorMessage } from "@/lib/format";
import { ME_KEY } from "@/hooks/useMe";
import type { LoginIn, User } from "@/lib/types";

const OAUTH_ERRORS: Record<string, string> = {
  github_not_configured: "GitHub sign-in isn't configured yet. Please use your email or username.",
  github_cancelled: "GitHub sign-in was cancelled.",
  invalid_oauth_state: "Your GitHub sign-in session expired. Please try again.",
  expired_oauth_state: "Your GitHub sign-in session expired. Please try again.",
  github_token_exchange_failed: "GitHub rejected the sign-in request. Please try again.",
  github_user_failed: "We couldn't read your GitHub profile. Please try again.",
  github_unreachable: "GitHub is unreachable right now. Please try again shortly.",
};

export const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const code = params.get("error");
    if (code) toast.error(OAUTH_ERRORS[code] ?? "Sign-in failed. Please try again.", { id: "oauth-error" });
  }, [params]);

  const login = useMutation({
    mutationFn: (body: LoginIn) => apiPost<User>("/auth/login", body),
    onSuccess: (user) => {
      beginSession();
      queryClient.setQueryData(ME_KEY, user);
      toast.success(`Welcome back, ${user.display_name || user.username}!`);
      navigate(next, { replace: true });
    },
    onError: (e) => setFormError(errorMessage(e, "Sign-in failed. Please try again.")),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!identifier.trim()) errs.identifier = "Enter your email or username";
    if (!password) errs.password = "Enter your password";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length === 0) login.mutate({ identifier: identifier.trim(), password });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to publish and manage your EzOrb packages."
      footer={<>New to EzOrb? <Link to={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-[#3B4FC4] hover:underline dark:text-[#4DB8D8]" data-testid="login-to-register-link">Create an account</Link></>}>
      <GithubButton />
      <OrDivider />
      <form onSubmit={onSubmit} noValidate className="space-y-4" data-testid="login-form">
        <div>
          <Label htmlFor="identifier" className="mb-1.5">Email or username</Label>
          <Input id="identifier" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            aria-invalid={!!errors.identifier} placeholder="you@example.com" className="h-11 rounded-xl bg-white/80 dark:bg-[#0F1424]/60" data-testid="login-identifier-input" />
          <FieldError msg={errors.identifier} testId="login-identifier-error" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-[#3B4FC4] hover:underline dark:text-[#4DB8D8]" data-testid="forgot-password-link">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password} placeholder="••••••••" className="h-11 rounded-xl bg-white/80 pr-10 dark:bg-[#0F1424]/60" data-testid="login-password-input" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} data-testid="login-password-toggle"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#5B6478] hover:text-[#1F2937] dark:hover:text-white">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError msg={errors.password} testId="login-password-error" />
        </div>
        {formError && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-[#DC2626] dark:text-[#F87171]" data-testid="login-form-error">{formError}</p>}
        <button type="submit" disabled={login.isPending} className="btn-signature inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold disabled:opacity-70" data-testid="login-submit-button">
          {login.isPending && <Loader2 className="size-4 animate-spin" />} Sign in
        </button>
      </form>
    </AuthShell>
  );
}