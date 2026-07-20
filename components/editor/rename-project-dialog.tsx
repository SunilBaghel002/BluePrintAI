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
import { Input } from "@/components/ui/input";
import { Project } from "@/types/project";

interface RenameProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function RenameProjectDialog({
  isOpen,
  onClose,
  project,
  name,
  onNameChange,
  onSubmit,
  isLoading = false,
}: RenameProjectDialogProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Change the name for project &quot;<span className="text-text-primary font-medium">{project.name}</span>&quot;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rename-project-name"
              className="text-xs font-medium text-text-secondary"
            >
              New Name
            </label>
            <Input
              id="rename-project-name"
              ref={inputRef}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="border-border bg-base text-text-primary focus:border-accent-primary"
            />
          </div>

          <DialogFooter showCloseButton={false}>
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
              type="submit"
              disabled={!name.trim() || name.trim() === project.name || isLoading}
              className="bg-accent-primary text-white hover:bg-accent-hover"
            >
              {isLoading ? "Renaming..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
