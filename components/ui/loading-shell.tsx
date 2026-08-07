"use client";

import * as React from "react";
import { PanelLeft, Loader2 } from "lucide-react";
import { BlueprintLogo } from "./blueprint-logo";

interface LoadingShellProps {
  title?: string;
  subtitle?: string;
}

export function LoadingShell({
  title = "Authenticating & Preparing Workspace",
  subtitle = "Verifying session token and synchronizing design canvas...",
}: LoadingShellProps) {
  return (
    <div className="min-h-screen w-full bg-base text-text-primary flex flex-col font-sans">
      {/* Sleek Dark Topbar Header matching EditorNavbar */}
      <header className="h-12 bg-sidebar border-b border-default flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Icon Placeholder */}
          <div className="h-8 w-8 rounded-lg bg-[#141418] border border-default flex items-center justify-center text-text-muted">
            <PanelLeft className="h-4 w-4 stroke-[1.5]" />
          </div>

          {/* Blueprint AI Brand Logo */}
          <BlueprintLogo size="sm" />

          <span className="text-[#333338] text-xs font-mono select-none">/</span>

          {/* Workspace Title Placeholder */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-text-primary leading-none truncate max-w-[180px] sm:max-w-[280px]">
              Loading Workspace...
            </span>
            <span className="text-[10px] text-text-muted leading-none mt-1">
              Workspace
            </span>
          </div>
        </div>

        {/* Right Section Loading Spinner */}
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 className="h-4 w-4 text-accent-primary animate-spin stroke-[1.5]" />
        </div>
      </header>

      {/* Main Centered Loading Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-5 max-w-sm">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-surface border border-default shadow-[0_0_20px_rgba(37,99,235,0.15)]">
            <Loader2 className="h-5.5 w-5.5 text-accent-primary animate-spin stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
