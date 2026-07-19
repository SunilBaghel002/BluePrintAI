"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function EditorNavbar({
  isSidebarOpen = false,
  onToggleSidebar,
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
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <span className="font-mono text-xs font-semibold text-text-primary">
          Blueprint
        </span>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        {/* Workspace / Project Title placeholder */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-text-primary">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="text-xs bg-accent-primary text-white hover:bg-accent-hover">
              Sign Up
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
