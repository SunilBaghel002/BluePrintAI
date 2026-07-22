"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bot, Sparkles } from "lucide-react";
import { CanvasRoom } from "@/components/canvas";
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
  const [isTemplatesOpen, setIsTemplatesOpen] = React.useState(false);

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
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onShare={() => setIsShareOpen(true)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        isAiSidebarOpen={isAiSidebarOpen}
      />

      {/* Main Workspace Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Full Viewport Canvas Area */}
        <main className="absolute inset-0 z-0 bg-black overflow-hidden">
          <CanvasRoom
            roomId={roomId}
            isTemplatesOpen={isTemplatesOpen}
            onCloseTemplates={() => setIsTemplatesOpen(false)}
          />
        </main>

        {/* Left Floating Project Sidebar */}
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

        {/* Right Floating AI Copilot Sidebar */}
        {isAiSidebarOpen && (
          <aside className="absolute right-3 top-3 bottom-3 z-30 w-[320px] rounded-2xl border border-[#1E1E24] bg-[#0E0E10]/95 backdrop-blur-md p-4 flex flex-col justify-between select-none shadow-2xl transition-all">
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
