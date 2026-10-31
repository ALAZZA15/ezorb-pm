import { Link } from "react-router-dom";
import { MailQuestion } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";

export default function ForgotPassword() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Self-service password reset by email is coming soon."
      footer={<Link to="/login" className="font-semibold text-[#3B4FC4] hover:underline dark:text-[#4DB8D8]" data-testid="forgot-back-to-login">Back to sign in</Link>}>
      <div className="flex gap-3 rounded-xl border border-[#C9D6EE] bg-white/60 p-4 text-sm leading-relaxed text-[#374151] dark:border-white/10 dark:bg-white/5 dark:text-[#CBD5E1]" data-testid="forgot-password-info">
        <MailQuestion className="mt-0.5 size-5 shrink-0 text-[#8A5CCB]" />
        <p>
          Until email reset launches, signed-up publishers can recover access through the{" "}
          <Link to="/community" className="font-semibold text-link hover:underline">community support channels</Link>, or
          sign in with GitHub if your account email matches.
        </p>
      </div>
    </AuthShell>
  );
}