"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
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

export function ProjectSidebar({
  isOpen,
  onClose,
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
  ownedProjects = [],
  sharedProjects = [],
  activeProjectId,
  onSelectProject,
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"owned" | "shared">("owned");

  if (!isOpen) return null;

  return (
    <aside className="absolute left-3 top-3 bottom-3 z-30 w-[280px] rounded-2xl border border-[#1E1E24] bg-[#0E0E10]/95 backdrop-blur-md p-3 flex flex-col justify-between select-none shadow-2xl transition-all">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        {/* Header Title & Close Button */}
        <div className="flex items-center justify-between px-1 pt-1 shrink-0">
          <span className="text-xs font-semibold text-[#F0F0F0]">Projects</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-6 w-6 text-[#888892] hover:text-white hover:bg-[#1A1A1E]"
          >
            <X className="h-3.5 w-3.5 stroke-[1.5]" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#141418] p-1 rounded-full border border-[#222226] flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("owned")}
            className={cn(
              "flex-1 py-1.5 text-center text-xs font-medium rounded-full transition-all",
              activeTab === "owned"
                ? "bg-black text-white shadow-sm"
                : "text-[#888892] hover:text-white"
            )}
          >
            My Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shared")}
            className={cn(
              "flex-1 py-1.5 text-center text-xs font-medium rounded-full transition-all",
              activeTab === "shared"
                ? "bg-black text-white shadow-sm"
                : "text-[#888892] hover:text-white"
            )}
          >
            Shared
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-1.5 mt-1 flex-1 overflow-y-auto pr-1">
          {activeTab === "owned" ? (
            ownedProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#666670]">
                No projects found.
              </div>
            ) : (
              ownedProjects.map((project) => {
                const isActive = activeProjectId === project.id;
                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectProject?.(project)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectProject?.(project);
                      }
                    }}
                    className={cn(
                      "group relative flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14B8A6]",
                      isActive
                        ? "bg-[#0E2426] border-[#14B8A6]/30 text-[#14B8A6] font-semibold"
                        : "border-transparent text-[#888892] hover:bg-[#141418] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-10">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          isActive ? "bg-[#14B8A6]" : "bg-[#555560]"
                        )}
                      />
                      <span className="text-xs truncate">{project.name}</span>
                    </div>

                    {/* Actions for Owned Projects */}
                    <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#141418] p-1 rounded-lg">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRename(project);
                        }}
                        className="h-6 w-6 text-[#888892] hover:text-white"
                        title="Rename"
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
                        className="h-6 w-6 text-[#888892] hover:text-[#EF4444]"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 stroke-[1.5]" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )
          ) : sharedProjects.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#666670]">
              No shared projects.
            </div>
          ) : (
            sharedProjects.map((project) => {
              const isActive = activeProjectId === project.id;
              return (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectProject?.(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectProject?.(project);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14B8A6]",
                    isActive
                      ? "bg-[#0E2426] border-[#14B8A6]/30 text-[#14B8A6] font-semibold"
                      : "border-transparent text-[#888892] hover:bg-[#141418] hover:text-white"
                  )}
                >

                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        isActive ? "bg-[#14B8A6]" : "bg-[#555560]"
                      )}
                    />
                    <span className="text-xs truncate">{project.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-[#1E1E24] mt-auto">
        <div className="h-9 w-9 rounded-full bg-[#141418] border border-[#27272A] flex items-center justify-center font-mono text-xs font-semibold text-white shrink-0">
          N
        </div>
        <Button
          type="button"
          onClick={onOpenCreate}
          className="flex-1 h-9 rounded-full bg-[#14B8A6] text-black font-semibold text-xs hover:bg-[#14B8A6]/90 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="h-4 w-4 stroke-[2]" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
