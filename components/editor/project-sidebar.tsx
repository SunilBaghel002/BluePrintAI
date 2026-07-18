"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onNewProject?: () => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
}: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-12 left-0 bottom-0 z-40 flex w-60 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold text-text-primary">Projects</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close sidebar"
            className="text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sidebar Content (Tabs) */}
      <div className="flex flex-1 flex-col overflow-hidden p-3">
        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects" className="text-xs">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-xs">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="my-projects"
            className="flex flex-1 flex-col items-center justify-center p-4 text-center text-xs text-text-muted"
          >
            No projects found.
          </TabsContent>

          <TabsContent
            value="shared"
            className="flex flex-1 flex-col items-center justify-center p-4 text-center text-xs text-text-muted"
          >
            No shared projects.
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-3">
        <Button
          onClick={onNewProject}
          className="w-full justify-center gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
