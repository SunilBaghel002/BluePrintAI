import { AuthLayoutShell } from "@/components/auth/auth-layout-shell";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <AuthLayoutShell>
      <SignUp
        fallbackRedirectUrl="/editor"
        signInFallbackRedirectUrl="/editor"
      />
    </AuthLayoutShell>
  );
}
