"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EditorNavbar,
  ProjectSidebar,
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
  ShareDialog,
} from "@/components/editor";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Project } from "@/types/project";

interface EditorWorkspaceViewProps {
  project: Project;
  ownedProjects: Project[];
  sharedProjects: Project[];
  roomId: string;
}

export function EditorWorkspaceView({
  project,
  ownedProjects,
  sharedProjects,
  roomId,
}: EditorWorkspaceViewProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState("");

  const {
    dialogType,
    selectedProject,
    nameInput,
    setNameInput,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreateSubmit,
    handleRenameSubmit,
    handleDeleteConfirm,
  } = useProjectActions(roomId);

  const handleSelectProject = (p: Project) => {
    router.push(`/editor/${p.id}`);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-base text-text-primary">
      {/* Top Navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShare={() => setIsShareOpen(true)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        isAiSidebarOpen={isAiSidebarOpen}
      />

      {/* Main Workspace Row */}
      <div className="relative flex flex-1 pt-12 overflow-hidden">
        {/* Left Project Sidebar Drawer */}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenCreate={openCreateDialog}
          onOpenRename={openRenameDialog}
          onOpenDelete={openDeleteDialog}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={roomId}
          onSelectProject={handleSelectProject}
        />

        {/* Central Canvas Area */}
        <main className="relative flex flex-1 flex-col items-center justify-center bg-canvas p-6 overflow-hidden">
          {/* Subtle Canvas Dot Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(var(--canvas-dot) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex max-w-md flex-col items-center text-center rounded-xl border border-border bg-surface/80 p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-dim text-accent-primary">
              <span className="font-mono text-sm font-bold">FLOW</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text-primary">
              {project.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-text-muted">
              Room ID: {roomId}
            </p>
            <p className="mt-3 text-xs text-text-secondary">
              Interactive React Flow & Liveblocks canvas will render here in Phase 2.
            </p>
          </div>
        </main>

        {/* Right AI Sidebar Placeholder */}
        {isAiSidebarOpen && (
          <aside className="z-30 flex w-72 flex-col border-l border-border bg-sidebar p-4 text-text-primary shadow-xl">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="h-4 w-4 text-ai-primary stroke-[1.5]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                AI Assistant
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto py-4 text-xs text-text-secondary">
              <p className="leading-relaxed">
                Describe your SaaS system architecture in plain English. AI will generate nodes and edges directly on your canvas.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 pt-3 border-t border-border"
            >
              <Input
                placeholder="Ask AI to design..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="h-8 border-border bg-base text-xs text-text-primary focus:border-ai-primary"
              />
              <Button
                type="submit"
                size="icon-sm"
                className="h-8 w-8 shrink-0 bg-ai-primary text-white hover:bg-ai-primary/90"
              >
                <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              </Button>
            </form>
          </aside>
        )}
      </div>

      {/* Dialog Controls */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={roomId}
        projectName={project.name}
      />

      <CreateProjectDialog
        isOpen={dialogType === "create"}
        onClose={closeDialog}
        name={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleCreateSubmit}
        isLoading={isLoading}
      />

      <RenameProjectDialog
        isOpen={dialogType === "rename"}
        onClose={closeDialog}
        project={selectedProject}
        name={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleRenameSubmit}
        isLoading={isLoading}
      />

      <DeleteProjectDialog
        isOpen={dialogType === "delete"}
        onClose={closeDialog}
        project={selectedProject}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}

