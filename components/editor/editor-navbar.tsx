"use client";

import * as React from "react";
import { PanelLeft, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  projectName?: string;
  onShare?: () => void;
  onToggleAiSidebar?: () => void;
  isAiSidebarOpen?: boolean;
}

export function EditorNavbar({
  isSidebarOpen = true,
  onToggleSidebar,
  projectName = "Untitled Project",
  onShare,
  onToggleAiSidebar,
  isAiSidebarOpen = true,
}: EditorNavbarProps) {
  return (
    <header className="h-12 border-b border-[#1E1E24] bg-[#0E0E10] px-4 flex items-center justify-between shrink-0 z-40">
      {/* Left Section: Sidebar Toggle & Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="h-8 w-8 rounded-lg border border-[#222226] bg-[#141418] text-[#888892] hover:text-white hover:bg-[#1E1E22] transition-colors"
        >
          <PanelLeft className="h-4 w-4 stroke-[1.5]" />
        </Button>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#F0F0F0] leading-none">
            {projectName}
          </span>
          <span className="text-[10px] text-[#666670] leading-none mt-1">
            Workspace
          </span>
        </div>
      </div>

      {/* Right Section: Workspace Actions & User Auth */}
      <div className="flex items-center gap-2">
        {onShare && (
          <Button
            type="button"
            size="sm"
            onClick={onShare}
            className="h-8 px-3.5 rounded-full border border-[#27272A] bg-[#141418] text-xs font-medium text-[#F0F0F0] hover:bg-[#1E1E22] transition-colors flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5 text-[#888892] stroke-[1.5]" />
            Share
          </Button>
        )}

        {onToggleAiSidebar && (
          <Button
            type="button"
            size="sm"
            onClick={onToggleAiSidebar}
            aria-label={isAiSidebarOpen ? "Close AI Sidebar" : "Open AI Sidebar"}
            className="h-8 px-3.5 rounded-full bg-[#14B8A6] text-black text-xs font-semibold hover:bg-[#14B8A6]/90 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-black stroke-[1.5]" />
            AI
          </Button>
        )}

        <div className="ml-1 flex items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#888892] hover:text-white"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="text-xs bg-[#14B8A6] text-black font-semibold hover:bg-[#14B8A6]/90 ml-2"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
