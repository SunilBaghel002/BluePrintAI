"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Project, ProjectDialogType } from "@/types/project";

export function useProjectActions(activeProjectId?: string) {
  const router = useRouter();
  const [dialogType, setDialogType] = React.useState<ProjectDialogType>(null);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [nameInput, setNameInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const openCreateDialog = React.useCallback(() => {
    setSelectedProject(null);
    setNameInput("");
    setError(null);
    setDialogType("create");
  }, []);

  const openRenameDialog = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setNameInput(project.name);
    setError(null);
    setDialogType("rename");
  }, []);

  const openDeleteDialog = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setNameInput("");
    setError(null);
    setDialogType("delete");
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialogType(null);
    setSelectedProject(null);
    setNameInput("");
    setError(null);
    setIsLoading(false);
  }, []);

  const handleCreateSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!nameInput.trim()) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nameInput.trim() }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create project");
        }

        const { data: project } = await res.json();
        closeDialog();
        router.refresh();
        router.push(`/editor/${project.id}`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    },
    [nameInput, closeDialog, router]
  );

  const handleRenameSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProject || !nameInput.trim()) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/projects/${selectedProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nameInput.trim() }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to rename project");
        }

        closeDialog();
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    },
    [selectedProject, nameInput, closeDialog, router]
  );

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete project");
      }

      const deletedId = selectedProject.id;
      closeDialog();

      if (activeProjectId === deletedId) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }, [selectedProject, activeProjectId, closeDialog, router]);

  return {
    dialogType,
    selectedProject,
    nameInput,
    setNameInput,
    isLoading,
    error,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreateSubmit,
    handleRenameSubmit,
    handleDeleteConfirm,
  };
}
