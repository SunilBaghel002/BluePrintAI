"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bot, Compass, Sparkles } from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = React.useState(true);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

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
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0A0A0C] text-[#F0F0F0]">
      {/* Top Navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShare={() => setIsShareOpen(true)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        isAiSidebarOpen={isAiSidebarOpen}
      />

      {/* Main Workspace Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left In-Flow Project Sidebar */}
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
        <main className="relative flex-1 bg-[#0A0A0C] rounded-2xl border border-[#1E1E24] m-2 flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Subtle Canvas Dot Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#27272A 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
            {/* Teal Compass Icon Container */}
            <div className="h-12 w-12 rounded-2xl border border-[#14B8A6]/40 bg-[#0E2426] flex items-center justify-center text-[#14B8A6] shadow-lg">
              <Compass className="h-6 w-6 stroke-[1.5]" />
            </div>

            {/* Category Label */}
            <span className="text-[10px] font-bold text-[#666670] tracking-[0.2em] uppercase mt-6">
              WORKSPACE SHELL
            </span>

            {/* Main Heading */}
            <h1 className="text-2xl font-semibold text-[#F0F0F0] mt-3 leading-snug">
              Canvas and collaboration tooling land here next.
            </h1>

            {/* Subtext */}
            <p className="text-xs text-[#888892] mt-3 max-w-md leading-relaxed">
              This room is ready for the shared architecture canvas, durable AI workflows, and real-time presence. For now, the shell is wired with project context and navigation only.
            </p>
          </div>

          {/* Bottom Grip Handle */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-[#27272A]" />
        </main>

        {/* Right In-Flow AI Copilot Sidebar */}
        {isAiSidebarOpen && (
          <aside className="w-[320px] shrink-0 border-l border-[#1E1E24] bg-[#0E0E10] p-4 flex flex-col justify-between h-full select-none">
            <div>
              {/* Header Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[#F0F0F0]">
                    AI Copilot
                  </h3>
                  <span className="text-[10px] text-[#666670] block mt-0.5">
                    Placeholder panel
                  </span>
                </div>
                <Sparkles className="h-4 w-4 text-[#A855F7] stroke-[1.5]" />
              </div>

              {/* Chat Surface Pending Card */}
              <div className="rounded-2xl border border-[#1E1E24] bg-[#121215] p-4 flex gap-3.5 mt-4">
                <div className="h-8 w-8 rounded-xl bg-[#2E1065] text-[#A855F7] flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#F0F0F0]">
                    Chat surface pending
                  </span>
                  <span className="text-[11px] text-[#888892] mt-1 leading-relaxed">
                    The toggle is wired. Messaging and generation are intentionally out of scope here.
                  </span>
                </div>
              </div>
            </div>

            {/* Future Hooks Card */}
            <div className="rounded-2xl border border-[#1E1E24] bg-[#121215] p-4 mt-auto">
              <span className="text-[10px] font-bold text-[#666670] tracking-[0.2em] uppercase block">
                FUTURE HOOKS
              </span>
              <p className="text-xs text-[#888892] mt-2 leading-relaxed">
                Prompt composer, run status, and architecture guidance will attach to this sidebar.
              </p>
            </div>
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
