"use client";

import * as React from "react";
import { useOthers, shallow } from "@liveblocks/react";
import { useUser, UserButton } from "@clerk/nextjs";

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function CollaboratorAvatars() {
  const { user } = useUser();

  // Selector with shallow comparison so cursor updates do NOT trigger re-renders
  const rawOthers = useOthers(
    (others) =>
      others.map((other) => ({
        connectionId: other.connectionId,
        id: other.id,
        name: other.info?.name,
        avatar: other.info?.avatar,
        color: other.info?.color,
      })),
    shallow
  );

  // Exclude current user ID and deduplicate multiple connections per user account
  const collaborators = React.useMemo(() => {
    const currentUserId = user?.id;
    const seenUserKeys = new Set<string>();
    if (currentUserId) {
      seenUserKeys.add(currentUserId);
    }

    const unique: typeof rawOthers = [];

    for (const other of rawOthers) {
      if (currentUserId && other.id === currentUserId) {
        continue;
      }

      const key = other.id || other.name || String(other.connectionId);
      if (!seenUserKeys.has(key)) {
        seenUserKeys.add(key);
        unique.push(other);
      }
    }

    return unique;
  }, [rawOthers, user?.id]);

  const visibleCollaborators = collaborators.slice(0, 5);
  const overflowCount = Math.max(0, collaborators.length - 5);

  return (
    <div className="absolute top-3 right-4 z-40 nodrag nopan flex items-center gap-2 rounded-full border border-surface-border bg-base/95 px-3 py-1.5 shadow-2xl backdrop-blur-md text-primary-text select-none">
      {/* Collaborator Avatars */}
      {collaborators.length > 0 && (
        <div className="flex items-center -space-x-2">
          {visibleCollaborators.map((other) => {
            const name = other.name || "Collaborator";
            const avatar = other.avatar;
            const color = other.color || "#2563EB";

            return (
              <div
                key={other.connectionId}
                title={name}
                className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-base overflow-hidden"
                style={{ backgroundColor: color }}
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-white tracking-tighter">
                    {getInitials(name)}
                  </span>
                )}
              </div>
            );
          })}

          {overflowCount > 0 && (
            <div
              title={`${overflowCount} more collaborator${overflowCount > 1 ? "s" : ""}`}
              className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-border ring-2 ring-base text-[10px] font-semibold text-muted-text"
            >
              +{overflowCount}
            </div>
          )}
        </div>
      )}

      {/* Divider - only appears when collaborators exist */}
      {collaborators.length > 0 && (
        <div className="h-4 w-px bg-surface-border" />
      )}

      {/* Clerk UserButton for current user */}
      <div className="flex h-7 w-7 items-center justify-center">
        <UserButton />
      </div>
    </div>
  );
}
