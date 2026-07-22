"use client";

import * as React from "react";
import {
  LayoutTemplate,
  PanelLeft,
  Share2,
  Sparkles,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { SaveStatus } from "@/hooks/use-canvas-autosave";

interface EditorNavbarProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  projectName?: string;
  onShare?: () => void;
  onOpenTemplates?: () => void;
  onToggleAiSidebar?: () => void;
  isAiSidebarOpen?: boolean;
  showUserButton?: boolean;
  onSave?: () => void;
  saveStatus?: SaveStatus;
}

export function EditorNavbar({
  isSidebarOpen = true,
  onToggleSidebar,
  projectName = "Untitled Project",
  onShare,
  onOpenTemplates,
  onToggleAiSidebar,
  isAiSidebarOpen = true,
  showUserButton = true,
  onSave,
  saveStatus = "idle",
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
        {onSave && (
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className="h-8 px-3.5 rounded-full border border-[#27272A] bg-[#141418] text-xs font-medium text-[#F0F0F0] hover:bg-[#1E1E22] transition-colors flex items-center gap-1.5"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 text-[#14B8A6] animate-spin stroke-[1.5]" />
                <span>Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[1.5]" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-red-400 stroke-[1.5]" />
                <span className="text-red-400">Save Error</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 text-[#888892] stroke-[1.5]" />
                <span>Save</span>
              </>
            )}
          </Button>
        )}

        {onOpenTemplates && (
          <Button
            type="button"
            size="sm"
            onClick={onOpenTemplates}
            className="h-8 px-3.5 rounded-full border border-[#27272A] bg-[#141418] text-xs font-medium text-[#F0F0F0] hover:bg-[#1E1E22] transition-colors flex items-center gap-1.5"
          >
            <LayoutTemplate className="h-3.5 w-3.5 text-[#888892] stroke-[1.5]" />
            Templates
          </Button>
        )}

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

        {showUserButton && (
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
        )}
      </div>
    </header>
  );
}
