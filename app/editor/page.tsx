"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EditorNavbar,
  ProjectSidebar,
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
  useProjectDialogs,
} from "@/components/editor";
import { Project } from "@/types/project";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [ownedProjects, setOwnedProjects] = React.useState<Project[]>([
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
  ]);

  const {
    dialogType,
    selectedProject,
    nameInput,
    setNameInput,
    isLoading,
    setIsLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
  } = useProjectDialogs();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsLoading(true);

    // Mock project creation logic
    setTimeout(() => {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: nameInput.trim(),
        slug: nameInput.toLowerCase().replace(/\s+/g, "-"),
        isOwner: true,
        updatedAt: "Just now",
      };
      setOwnedProjects((prev) => [newProj, ...prev]);
      setIsLoading(false);
      closeDialog();
    }, 300);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !nameInput.trim()) return;
    setIsLoading(true);

    // Mock project rename logic
    setTimeout(() => {
      setOwnedProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? { ...p, name: nameInput.trim(), updatedAt: "Just now" }
            : p
        )
      );
      setIsLoading(false);
      closeDialog();
    }, 300);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProject) return;
    setIsLoading(true);

    // Mock project deletion logic
    setTimeout(() => {
      setOwnedProjects((prev) =>
        prev.filter((p) => p.id !== selectedProject.id)
      );
      setIsLoading(false);
      closeDialog();
    }, 300);
  };

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
      />

      {/* Main Center Area */}
      <main className="flex flex-1 items-center justify-center pt-12 px-4">
        <div className="flex max-w-lg flex-col items-center text-center">
          <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">
            Create a project or open an existing one
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Start a new architecture workspace, or choose a project from the sidebar.
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
