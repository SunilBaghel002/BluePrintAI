"use client";

import * as React from "react";
import { Check, Link as LinkIcon, Mail, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OwnerItem {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

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
  const [owner, setOwner] = React.useState<OwnerItem | null>(null);
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
        if (json.data) {
          setOwner(json.data.owner || null);
          setCollaborators(json.data.collaborators || []);
        }
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

  const totalMembers = (owner ? 1 : 0) + collaborators.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-6 bg-[#0E0E10] text-[#F0F0F0] border border-[#1F1F24] rounded-2xl shadow-2xl">
        <DialogHeader className="p-0 border-none">
          <DialogTitle className="text-lg font-semibold text-[#F0F0F0]">
            Share project
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888892] mt-1">
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* Card 1: Workspace Link */}
          <div className="rounded-xl border border-[#1F1F24] bg-[#121215] p-4 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#F0F0F0]">
                Workspace link
              </span>
              <span className="text-[11px] text-[#888892] mt-0.5">
                Share a direct link with teammates after you grant them access.
              </span>
            </div>
            <Button
              type="button"
              onClick={handleCopyLink}
              className="h-8 px-3.5 rounded-full border border-[#27272A] bg-[#1A1A1E] text-xs font-medium text-[#F0F0F0] hover:bg-[#24242B] transition-colors shrink-0 flex items-center gap-1.5"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#14B8A6] stroke-[1.5]" />
                  Copied!
                </>
              ) : (
                <>
                  <LinkIcon className="h-3.5 w-3.5 text-[#888892] stroke-[1.5]" />
                  Copy link
                </>
              )}
            </Button>
          </div>

          {/* Card 2: Invite Section (Owner Only) */}
          {isOwner && (
            <div className="rounded-xl border border-[#1F1F24] bg-[#121215] p-3">
              <form onSubmit={handleInviteSubmit} className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555560] stroke-[1.5]" />
                  <Input
                    type="email"
                    placeholder="teammate@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="h-9 w-full rounded-full border border-[#27272A] bg-[#16161A] pl-10 pr-4 text-xs text-[#F0F0F0] placeholder:text-[#555560] focus:border-[#0EA5E9] focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!emailInput.trim() || isInviting}
                  className="h-8 px-4 rounded-full bg-[#14B8A6] text-black font-semibold text-xs hover:bg-[#14B8A6]/90 transition-colors shrink-0 disabled:opacity-50"
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </form>
              {error && <p className="text-[11px] text-state-error mt-2 px-1">{error}</p>}
            </div>
          )}

          {/* Section 3: People with access */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#F0F0F0]">
              <span>People with access</span>
              <span className="text-[#666670] font-normal">{totalMembers} total</span>
            </div>

            <div className="space-y-2 mt-1 max-h-56 overflow-y-auto pr-0.5">
              {isLoading ? (
                <p className="p-4 text-center text-xs text-[#666670]">
                  Loading access list...
                </p>
              ) : (
                <>
                  {/* Owner Card */}
                  {owner && (
                    <div className="rounded-xl border border-[#1F1F24] bg-[#121215] p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {owner.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={owner.avatarUrl}
                            alt={owner.name || owner.email}
                            className="h-9 w-9 rounded-full object-cover shrink-0 border border-[#27272A]"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A5F] text-[#2563EB] font-mono text-xs font-bold shrink-0">
                            {(owner.name || owner.email || "O").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-semibold text-[#F0F0F0] truncate">
                              {owner.name || owner.email}
                            </span>
                            <span className="px-2 py-0.5 rounded-full border border-[#0EA5E9]/40 bg-[#0EA5E9]/10 text-[9px] font-bold tracking-wider text-[#0EA5E9] uppercase shrink-0">
                              OWNER
                            </span>
                          </div>
                          {owner.name && (
                            <span className="text-[11px] text-[#888892] truncate mt-0.5">
                              {owner.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Collaborator Cards */}
                  {collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[#1F1F24] bg-[#121215] p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {c.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.avatarUrl}
                            alt={c.name || c.email}
                            className="h-9 w-9 rounded-full object-cover shrink-0 border border-[#27272A]"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2E1065] text-[#A855F7] font-mono text-xs font-bold shrink-0">
                            {(c.name || c.email).slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-semibold text-[#F0F0F0] truncate">
                              {c.name || c.email}
                            </span>
                            <span className="px-2 py-0.5 rounded-full border border-[#27272A] bg-[#1A1A1E] text-[9px] font-bold tracking-wider text-[#888892] uppercase shrink-0">
                              COLLABORATOR
                            </span>
                          </div>
                          {c.name && (
                            <span className="text-[11px] text-[#888892] truncate mt-0.5">
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
                          className="text-[#888892] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors p-1.5 rounded-md"
                          title="Remove access"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.5]" />
                        </Button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
