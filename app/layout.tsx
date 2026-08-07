import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blueprint",
  description: "AI-powered collaborative system design platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-text-primary">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/editor"
          signUpFallbackRedirectUrl="/editor"
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "#111116",
              colorPrimary: "#2563EB",
              colorForeground: "#F0F0F0",
              colorMutedForeground: "#A0A0A0",
              colorInput: "#16161D",
              colorInputForeground: "#F0F0F0",
              colorBorder: "#22222B",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "border border-[#22222B] bg-[#111116] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl p-6 sm:p-8",
              headerTitle: "text-[#F0F0F0] font-sans font-bold text-lg tracking-tight",
              headerSubtitle: "text-[#A0A0A0] text-xs font-sans mt-1",
              socialButtonsBlockButton:
                "border border-[#272732] bg-[#16161D] hover:bg-[#1E1E28] text-[#F0F0F0] text-xs font-medium rounded-xl transition-all h-10",
              socialButtonsBlockButtonText: "text-[#F0F0F0] font-medium text-xs",
              dividerLine: "bg-[#22222B]",
              dividerText: "text-[#666670] text-xs font-mono uppercase",
              formButtonPrimary:
                "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs font-semibold rounded-xl h-10 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all",
              footerActionLink:
                "text-[#38BDF8] hover:text-[#60A5FA] text-xs font-medium transition-colors",
              formFieldLabel: "text-[#A0A0A0] text-xs font-medium mb-1.5",
              formFieldInput:
                "bg-[#16161D] border border-[#272732] text-[#F0F0F0] text-xs rounded-xl h-10 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all px-3",
              identityPreviewText: "text-[#F0F0F0] text-xs font-medium",
              footer: "border-t border-[#1E1E24] mt-4 pt-4 text-xs text-[#666670]",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}