"use client";

import * as React from "react";
import { Project, ProjectDialogType } from "@/types/project";

export function useProjectDialogs() {
  const [dialogType, setDialogType] = React.useState<ProjectDialogType>(null);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [nameInput, setNameInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const openCreateDialog = React.useCallback(() => {
    setSelectedProject(null);
    setNameInput("");
    setDialogType("create");
  }, []);

  const openRenameDialog = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setNameInput(project.name);
    setDialogType("rename");
  }, []);

  const openDeleteDialog = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setNameInput("");
    setDialogType("delete");
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialogType(null);
    setSelectedProject(null);
    setNameInput("");
    setIsLoading(false);
  }, []);

  return {
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
  };
}
