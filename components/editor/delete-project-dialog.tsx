"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { AlertTriangle } from "lucide-react";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteProjectDialog({
  isOpen,
  onClose,
  project,
  onConfirm,
  isLoading = false,
}: DeleteProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-state-error">
            <AlertTriangle className="h-5 w-5 stroke-[1.5]" />
            <DialogTitle>Delete Project</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete &quot;<span className="text-text-primary font-medium">{project.name}</span>&quot;? This action cannot be undone and will permanently remove all canvas architecture nodes and data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter showCloseButton={false} className="mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-text-secondary hover:text-text-primary"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-state-error text-white hover:bg-state-error/90"
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
