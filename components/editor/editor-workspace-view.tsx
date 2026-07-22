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

import { AiSidebar } from "@/components/panels";

import { SaveStatus } from "@/hooks/use-canvas-autosave";

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

  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
  const saveHandlerRef = React.useRef<(() => Promise<boolean>) | null>(null);

  const handleManualSave = React.useCallback(() => {
    if (saveHandlerRef.current) {
      saveHandlerRef.current();
    }
  }, []);

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
        showUserButton={false}
        onSave={handleManualSave}
        saveStatus={saveStatus}
      />

      {/* Main Workspace Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Full Viewport Canvas Area */}
        <main className="absolute inset-0 z-0 bg-black overflow-hidden">
          <CanvasRoom
            roomId={roomId}
            isTemplatesOpen={isTemplatesOpen}
            onCloseTemplates={() => setIsTemplatesOpen(false)}
            onSaveStatusChange={setSaveStatus}
            onRegisterSaveHandler={(fn) => {
              saveHandlerRef.current = fn;
            }}
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

        {/* Right Floating AI Sidebar */}
        <AiSidebar
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
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
