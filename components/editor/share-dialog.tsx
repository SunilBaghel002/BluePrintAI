"use client";

import * as React from "react";
import { Check, Copy, Trash2, UserPlus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CollaboratorItem {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  projectId,
  projectName,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = React.useState<CollaboratorItem[]>([]);
  const [isOwner, setIsOwner] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInviting, setIsInviting] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const copyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/editor/${projectId}` : "";


  const fetchCollaborators = React.useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const json = await res.json();
        setCollaborators(json.data || []);
        setIsOwner(Boolean(json.isOwner));
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Failed to load collaborators");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load collaborators");
      console.error("Failed to load collaborators:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, fetchCollaborators]);

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
  };


  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !isOwner) return;
    setIsInviting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to invite collaborator");
      }

      setEmailInput("");
      fetchCollaborators();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!isOwner) return;
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      }
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface text-text-primary border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent-primary stroke-[1.5]" />
            <DialogTitle>Share Workspace</DialogTitle>
          </div>
          <DialogDescription className="text-text-secondary text-xs">
            Collaborate on &quot;<span className="text-text-primary font-medium">{projectName}</span>&quot; in real time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Link Copy Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Project Link
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="h-8 border-border bg-base text-xs text-text-secondary select-all font-mono"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="h-8 shrink-0 gap-1.5 bg-accent-primary text-xs font-medium text-white hover:bg-accent-hover px-3"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 stroke-[1.5]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 stroke-[1.5]" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Invite Section (Owner Only) */}
          {isOwner && (
            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Invite Collaborator
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="colleague@company.com"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-8 border-border bg-base text-xs text-text-primary focus:border-accent-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!emailInput.trim() || isInviting}
                  className="h-8 shrink-0 gap-1 bg-accent-primary text-xs font-medium text-white hover:bg-accent-hover px-3"
                >
                  <UserPlus className="h-3.5 w-3.5 stroke-[1.5]" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
              {error && <p className="text-[11px] text-state-error">{error}</p>}
            </form>
          )}

          {/* Collaborator List Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Members & Collaborators
            </span>

            <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-base p-2 space-y-1">
              {isLoading ? (
                <p className="p-3 text-center text-xs text-text-muted">
                  Loading collaborators...
                </p>
              ) : collaborators.length === 0 ? (
                <p className="p-3 text-center text-xs text-text-muted">
                  No invited collaborators yet.
                </p>
              ) : (
                collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.avatarUrl}
                          alt={c.name || c.email}
                          className="h-6 w-6 rounded-full object-cover shrink-0 border border-border"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-dim text-accent-primary font-mono text-[10px] shrink-0 font-semibold">
                          {(c.name || c.email).slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-text-primary truncate">
                          {c.name || c.email}
                        </span>
                        {c.name && (
                          <span className="text-[10px] text-text-muted truncate">
                            {c.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleRemoveCollaborator(c.id)}
                        className="text-state-error hover:bg-state-error/10"
                        title="Remove access"
                      >
                        <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
