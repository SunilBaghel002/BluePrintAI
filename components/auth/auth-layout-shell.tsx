"use client";

import * as React from "react";
import { BlueprintLogo } from "@/components/ui/blueprint-logo";
import { AuthCanvasPreview } from "./auth-canvas-preview";
import { ArrowRight, Sparkles, Users, Cpu, CheckCircle } from "lucide-react";

interface AuthLayoutShellProps {
  children: React.ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0A0A0A] text-[#F0F0F0]">
      {/* ── Left Showcase Panel (System Design Workspace Showcase) ── */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between bg-[#0D0D0D] border-b lg:border-b-0 lg:border-r border-[#1A1A1A] p-8 lg:p-12 shrink-0">
        {/* Top Header: Logo Mark */}
        <div className="flex items-center justify-between">
          <BlueprintLogo size="lg" />
          <div className="hidden sm:flex items-center gap-2 bg-[#141418] border border-[#222226] rounded-full px-3 py-1 text-xs text-[#A0A0A0]">
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>AI System Architecture Engine</span>
          </div>
        </div>

        {/* Center Showcase Section */}
        <div className="flex flex-col gap-6 my-8 max-w-[620px]">
          {/* Main Headline */}
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F0F0F0] leading-tight">
              Collaborative System Architecture <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#C084FC]">
                Powered by AI & Live Canvas
              </span>
            </h1>
            <p className="font-sans text-sm text-[#A0A0A0] mt-3 leading-relaxed max-w-[540px]">
              Turn plain language into interactive visual system diagrams. Invite your team, edit live with cursor presence, and generate technical specs in seconds.
            </p>
          </div>

          {/* Real-time System Design Visual Preview */}
          <div className="w-full">
            <AuthCanvasPreview />
          </div>

          {/* Quick Value Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA]">
                <Cpu className="h-3.5 w-3.5" />
                <span>AI Core</span>
              </div>
              <span className="text-[11px] text-[#888892]">GPT-4o diagrams</span>
            </div>

            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34D399]">
                <Users className="h-3.5 w-3.5" />
                <span>Multiplayer</span>
              </div>
              <span className="text-[11px] text-[#888892]">Live cursors & sync</span>
            </div>

            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C084FC]">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Exportable</span>
              </div>
              <span className="text-[11px] text-[#888892]">PNG & Markdown spec</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]">
          <p className="font-sans text-xs text-[#555555]">
            © {new Date().getFullYear()} Blueprint AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#555555]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Clerk Authentication Form Container) ── */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6 lg:p-12">
        <div className="w-full max-w-[420px] flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
