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
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "var(--bg-surface)",
              colorPrimary: "var(--accent-primary)",
              colorForeground: "var(--text-primary)",
              colorMutedForeground: "var(--text-secondary)",
              colorInput: "var(--bg-elevated)",
              colorInputForeground: "var(--text-primary)",
              colorBorder: "var(--border-default)",
            },
            elements: {
              card: "border border-border bg-surface shadow-none",
              headerTitle: "text-text-primary font-mono font-semibold",
              headerSubtitle: "text-text-secondary text-xs",
              socialButtonsBlockButton: "border border-border bg-elevated hover:bg-hover text-text-primary text-xs font-medium",
              formButtonPrimary: "bg-accent-primary hover:bg-accent-hover text-white text-xs font-medium",
              footerActionLink: "text-accent-primary hover:text-accent-hover text-xs font-medium",
              formFieldLabel: "text-text-secondary text-xs font-medium",
              formFieldInput: "bg-elevated border border-border text-text-primary text-xs rounded focus:border-accent-primary",
              identityPreviewText: "text-text-primary text-xs",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}