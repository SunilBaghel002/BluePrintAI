"use client";

import * as React from "react";
import { BlueprintLogo } from "@/components/ui/blueprint-logo";
import { AuthCanvasPreview } from "./auth-canvas-preview";
import { Sparkles, Users, Cpu, CheckCircle, ShieldCheck } from "lucide-react";

interface AuthLayoutShellProps {
  children: React.ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:max-h-screen w-full bg-base text-text-primary overflow-y-auto lg:overflow-hidden">
      {/* ── Left Showcase Panel (Desktop Showcase - Hidden on Mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-between bg-sidebar border-r border-default p-6 xl:p-10 shrink-0 overflow-hidden">
        {/* Top Header: Logo Mark */}
        <div className="flex items-center justify-between shrink-0">
          <BlueprintLogo size="md" />
          <div className="flex items-center gap-2 bg-[#141418] border border-[#222226] rounded-full px-3 py-1 text-xs text-[#A0A0A0] shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>AI System Architecture Platform</span>
          </div>
        </div>

        {/* Center Showcase Section */}
        <div className="flex flex-col gap-3 my-auto max-w-[580px] w-full">
          {/* Main Headline */}
          <div>
            <h1 className="font-sans text-2xl xl:text-3xl font-bold tracking-tight text-[#F0F0F0] leading-snug">
              Collaborative System Architecture <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#C084FC]">
                Powered by AI & Live Canvas
              </span>
            </h1>
            <p className="font-sans text-xs xl:text-sm text-[#A0A0A0] mt-2 leading-relaxed max-w-[520px]">
              Describe your architecture in plain English. Blueprint AI maps it to a shared interactive canvas your team can refine in real time.
            </p>
          </div>

          {/* Real-time System Design Visual Canvas Showcase */}
          <div className="w-full my-1">
            <AuthCanvasPreview />
          </div>

          {/* Quick Value Highlights */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-2.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA]">
                <Cpu className="h-3.5 w-3.5" />
                <span>AI Architect</span>
              </div>
              <span className="text-[10px] text-[#888892]">GPT-4o diagrams</span>
            </div>

            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-2.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34D399]">
                <Users className="h-3.5 w-3.5" />
                <span>Multiplayer</span>
              </div>
              <span className="text-[10px] text-[#888892]">Live cursors & sync</span>
            </div>

            <div className="bg-[#111115] border border-[#1E1E24] rounded-xl p-2.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C084FC]">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Exportable</span>
              </div>
              <span className="text-[10px] text-[#888892]">PNG & Specs</span>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A] shrink-0">
          <p className="font-sans text-[11px] text-[#555555]">
            © {new Date().getFullYear()} Blueprint AI. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#555555]">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Clerk Authentication Container) ── */}
      <div className="relative w-full lg:w-1/2 min-h-screen lg:min-h-0 lg:h-full flex flex-col items-center justify-center bg-[#070709] p-4 sm:p-8 shrink-0 overflow-y-auto">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent_65%)] pointer-events-none" />

        {/* Mobile Header Logo (Visible only on < lg screens) */}
        <div className="flex lg:hidden items-center justify-center mb-6 z-10">
          <BlueprintLogo size="md" />
        </div>

        {/* Clerk Sign In / Sign Up Form Slot */}
        <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center justify-center">
          {children}
        </div>

        {/* Mobile Footer */}
        <div className="flex lg:hidden items-center gap-2 mt-6 text-xs text-[#555555] z-10">
          <ShieldCheck className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span>Secured by Clerk Authentication</span>
        </div>
      </div>
    </div>
  );
}
