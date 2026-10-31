import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError, GithubButton, OrDivider } from "@/components/AuthShell";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import { errorMessage } from "@/lib/format";
import { ME_KEY } from "@/hooks/useMe";
import type { RegisterIn, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { safeNext } from "./Login";

type Fields = "username" | "email" | "password" | "confirm";

function validate(v: Record<Fields, string>) {
  const e: Partial<Record<Fields, string>> = {};
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(v.username)) e.username = "3–32 characters: letters, numbers, - or _";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address";
  if (v.password.length < 8) e.password = "Use at least 8 characters";
  else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) e.password = "Include at least one letter and one number";
  if (!v.confirm) e.confirm = "Confirm your password";
  else if (v.confirm !== v.password) e.confirm = "Passwords don't match";
  return e;
}

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [v, setV] = useState<Record<Fields, string>>({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [touched, setTouched] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (k: Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const nv = { ...v, [k]: e.target.value };
    setV(nv);
    if (touched) setErrors(validate(nv));
  };

  const register = useMutation({
    mutationFn: (body: RegisterIn) => apiPost<User>("/auth/register", body),
    onSuccess: (user) => {
      beginSession();
      queryClient.setQueryData(ME_KEY, user);
      toast.success(`Welcome to EzOrb, ${user.username}!`);
      navigate(next, { replace: true });
    },
    onError: (e) => setFormError(errorMessage(e, "Sign-up failed. Please try again.")),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(v);
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length === 0) register.mutate({ username: v.username.trim(), email: v.email.trim(), password: v.password });
  };

  const checks = [
    { ok: v.password.length >= 8, label: "8+ characters" },
    { ok: /[A-Za-z]/.test(v.password) && /\d/.test(v.password), label: "Letter & number" },
    { ok: !!v.confirm && v.confirm === v.password, label: "Passwords match" },
  ];

  const field = (k: Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <Label htmlFor={`reg-${k}`} className="mb-1.5">{label}</Label>
      <Input id={`reg-${k}`} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} className="h-11 rounded-xl bg-white/80 dark:bg-[#0F1424]/60" data-testid={`register-${k}-input`} {...props} />
      <FieldError msg={errors[k]} testId={`register-${k}-error`} />
    </div>
  );

  return (
    <AuthShell title="Create your account" subtitle="Join the EzOrb publisher community — it's free."
      footer={<>Already have an account? <Link to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-[#3B4FC4] hover:underline dark:text-[#4DB8D8]" data-testid="register-to-login-link">Sign in</Link></>}>
      <GithubButton />
      <OrDivider />
      <form onSubmit={onSubmit} noValidate className="space-y-4" data-testid="register-form">
        {field("username", "Username", { autoComplete: "username", placeholder: "orb-hacker" })}
        {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
        {field("password", "Password", { type: "password", autoComplete: "new-password", placeholder: "••••••••" })}
        {field("confirm", "Confirm password", { type: "password", autoComplete: "new-password", placeholder: "••••••••" })}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs" data-testid="register-password-checklist">
          {checks.map((c) => (
            <li key={c.label} className={cn("inline-flex items-center gap-1 transition-colors", c.ok ? "text-emerald-600 dark:text-emerald-400" : "text-[#5B6478] dark:text-[#9AA3BA]")}>
              <Check className={cn("size-3.5 transition-opacity", c.ok ? "opacity-100" : "opacity-30")} /> {c.label}
            </li>
          ))}
        </ul>
        {formError && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-[#DC2626] dark:text-[#F87171]" data-testid="register-form-error">{formError}</p>}
        <button type="submit" disabled={register.isPending} className="btn-signature inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold disabled:opacity-70" data-testid="register-submit-button">
          {register.isPending && <Loader2 className="size-4 animate-spin" />} Create account
        </button>
      </form>
    </AuthShell>
  );
}