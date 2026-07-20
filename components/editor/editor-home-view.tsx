"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EditorNavbar,
  ProjectSidebar,
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Project } from "@/types/project";

interface EditorHomeViewProps {
  ownedProjects: Project[];
  sharedProjects: Project[];
  activeProjectId?: string;
}

export function EditorHomeView({
  ownedProjects,
  sharedProjects,
  activeProjectId,
}: EditorHomeViewProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
  } = useProjectActions(activeProjectId);

  const handleSelectProject = (project: Project) => {
    router.push(`/editor/${project.id}`);
    setIsSidebarOpen(false);
  };

  const activeProject = activeProjectId
    ? ownedProjects.find((p) => p.id === activeProjectId) ||
      sharedProjects.find((p) => p.id === activeProjectId)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-base text-text-primary">
      {/* Top Navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Project Sidebar */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenCreate={openCreateDialog}
        onOpenRename={openRenameDialog}
        onOpenDelete={openDeleteDialog}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
      />

      {/* Main Center Area */}
      <main className="flex flex-1 items-center justify-center pt-12 px-4">
        <div className="flex max-w-lg flex-col items-center text-center">
          <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">
            {activeProject
              ? `Workspace: ${activeProject.name}`
              : "Create a project or open an existing one"}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {activeProject
              ? "Your interactive canvas and tools are ready in this project."
              : "Start a new architecture workspace, or choose a project from the sidebar."}
          </p>
          <Button
            onClick={openCreateDialog}
            className="mt-6 gap-2 bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4 stroke-[1.5]" />
            New Project
          </Button>
        </div>
      </main>

      {/* Dialog Controls */}
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
