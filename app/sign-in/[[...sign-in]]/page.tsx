import { AuthLayoutShell } from "@/components/auth/auth-layout-shell";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <AuthLayoutShell>
      <SignIn
        fallbackRedirectUrl="/editor"
        signUpFallbackRedirectUrl="/editor"
      />
    </AuthLayoutShell>
  );
}
