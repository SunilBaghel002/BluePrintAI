"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
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
  isSidebarOpen = false,
  onToggleSidebar,
  projectName,
  onShare,
  onToggleAiSidebar,
  isAiSidebarOpen = false,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-sidebar px-4">
      {/* Left Section: Sidebar Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-text-secondary hover:text-text-primary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4 stroke-[1.5]" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 stroke-[1.5]" />
          )}
        </Button>
        <span className="font-mono text-xs font-semibold text-text-primary">
          Blueprint
        </span>
      </div>

      {/* Center Section: Project Name */}
      <div className="flex items-center gap-2 truncate px-4">
        {projectName && (
          <span className="font-mono text-xs font-medium text-text-primary truncate">
            {projectName}
          </span>
        )}
      </div>

      {/* Right Section: Workspace Actions & User Auth */}
      <div className="flex items-center gap-2">
        {onShare && (
          <Button
            size="sm"
            onClick={onShare}
            className="h-7 gap-1.5 text-xs bg-accent-primary text-white hover:bg-accent-hover px-3"
          >
            <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
            Share
          </Button>
        )}

        {onToggleAiSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleAiSidebar}
            aria-label={isAiSidebarOpen ? "Close AI Sidebar" : "Open AI Sidebar"}
            className={
              isAiSidebarOpen
                ? "bg-ai-dim text-ai-primary border border-ai-primary/30"
                : "text-ai-primary hover:bg-ai-dim/50"
            }
          >
            <Sparkles className="h-4 w-4 stroke-[1.5]" />
          </Button>
        )}

        <div className="ml-2 flex items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="text-xs bg-accent-primary text-white hover:bg-accent-hover ml-2"
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
