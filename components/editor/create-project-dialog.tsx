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
import { slugify } from "@/lib/utils";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  name,
  onNameChange,
  onSubmit,
  isLoading = false,
}: CreateProjectDialogProps) {
  const generatedSlug = slugify(name);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter a name for your architecture project to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="project-name"
              className="text-xs font-medium text-text-secondary"
            >
              Project Name
            </label>
            <Input
              id="project-name"
              placeholder="e.g. E-Commerce SaaS"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
              className="border-border bg-base text-text-primary focus:border-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-1 rounded-md border border-border bg-base p-3">
            <span className="text-[11px] font-medium text-text-muted">
              SLUG PREVIEW
            </span>
            <span className="font-mono text-xs text-accent-primary truncate">
              {generatedSlug ? `/project/${generatedSlug}` : "/project/..."}
            </span>
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
              disabled={!name.trim() || isLoading}
              className="bg-accent-primary text-white hover:bg-accent-hover"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
