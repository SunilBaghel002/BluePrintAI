import { AuthLayoutShell } from "@/components/auth/auth-layout-shell";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  return (
    <AuthLayoutShell>
      <ClerkLoading>
        <div className="flex flex-col items-center justify-center p-8 text-[#A0A0A0] space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          <span className="text-xs font-mono">Connecting to Clerk Authentication...</span>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn
          fallbackRedirectUrl="/editor"
          signUpFallbackRedirectUrl="/editor"
        />
      </ClerkLoaded>
    </AuthLayoutShell>
  );
}
