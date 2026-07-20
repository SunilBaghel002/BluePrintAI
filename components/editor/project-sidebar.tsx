"use client";

import * as React from "react";
import { Folder, Plus, Pencil, Trash2, Users, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate: () => void;
  onOpenRename: (project: Project) => void;
  onOpenDelete: (project: Project) => void;
  ownedProjects?: Project[];
  sharedProjects?: Project[];
  activeProjectId?: string;
  onSelectProject?: (project: Project) => void;
}

const DEFAULT_OWNED_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "E-Commerce Microservices",
    slug: "e-commerce-microservices",
    isOwner: true,
    updatedAt: "2 hours ago",
  },
  {
    id: "proj-2",
    name: "Realtime Analytics Engine",
    slug: "realtime-analytics-engine",
    isOwner: true,
    updatedAt: "Yesterday",
  },
];

const DEFAULT_SHARED_PROJECTS: Project[] = [
  {
    id: "proj-3",
    name: "Fintech Billing Pipeline",
    slug: "fintech-billing-pipeline",
    isOwner: false,
    updatedAt: "3 days ago",
  },
];

export function ProjectSidebar({
  isOpen,
  onClose,
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
  ownedProjects = DEFAULT_OWNED_PROJECTS,
  sharedProjects = DEFAULT_SHARED_PROJECTS,
  activeProjectId,
  onSelectProject,
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"owned" | "shared">("owned");

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile & Desktop backdrop scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-12 left-0 bottom-0 z-50 flex w-60 flex-col border-r border-border bg-sidebar text-text-primary shadow-2xl transition-transform duration-200 ease-in-out"
        )}
      >
        {/* Header / Action */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Workspaces
          </span>
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="h-7 text-xs gap-1 bg-accent-primary text-white hover:bg-accent-hover"
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            New
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-base/50 p-1 gap-1">
          <button
            onClick={() => setActiveTab("owned")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-colors",
              activeTab === "owned"
                ? "bg-surface text-text-primary border border-border"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <HardDrive className="h-3.5 w-3.5 stroke-[1.5]" />
            My Projects ({ownedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-colors",
              activeTab === "shared"
                ? "bg-surface text-text-primary border border-border"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Users className="h-3.5 w-3.5 stroke-[1.5]" />
            Shared ({sharedProjects.length})
          </button>
        </div>

        {/* Project Lists */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === "owned" ? (
            ownedProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted">
                No owned projects yet.
              </div>
            ) : (
              ownedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject?.(project)}
                  className={cn(
                    "group relative flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border border-transparent",
                    activeProjectId === project.id
                      ? "bg-accent-dim text-text-primary border-accent-primary/40"
                      : "hover:bg-hover hover:border-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-12">
                    <Folder className="h-4 w-4 shrink-0 text-accent-primary stroke-[1.5]" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">
                        {project.name}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted truncate">
                        {project.updatedAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Owned Projects */}
                  <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-sidebar/90 p-0.5 rounded">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRename(project);
                      }}
                      className="text-text-secondary hover:text-text-primary"
                      title="Rename project"
                    >
                      <Pencil className="h-3 w-3 stroke-[1.5]" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDelete(project);
                      }}
                      className="text-state-error hover:text-state-error/80"
                      title="Delete project"
                    >
                      <Trash2 className="h-3 w-3 stroke-[1.5]" />
                    </Button>
                  </div>
                </div>
              ))
            )
          ) : sharedProjects.length === 0 ? (
            <div className="p-4 text-center text-xs text-text-muted">
              No shared projects.
            </div>
          ) : (
            sharedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject?.(project)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border border-transparent",
                  activeProjectId === project.id
                    ? "bg-accent-dim text-text-primary border-accent-primary/40"
                    : "hover:bg-hover hover:border-border text-text-secondary hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="h-4 w-4 shrink-0 text-text-muted stroke-[1.5]" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate">
                      {project.name}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted truncate">
                      Shared • {project.updatedAt}
                    </span>
                  </div>
                </div>
                {/* No action icons for shared projects as required */}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
