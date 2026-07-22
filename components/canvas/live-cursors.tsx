"use client";

import * as React from "react";
import { useOthers, useOther, shallow } from "@liveblocks/react";
import { useViewport } from "@xyflow/react";
import { useUser } from "@clerk/nextjs";

function CursorPointer({ color }: { color: string }) {
  return (
    <svg
      className="h-5 w-5 drop-shadow-md select-none pointer-events-none"
      viewBox="0 0 24 24"
      fill={color}
      stroke="#0E0E10"
      strokeWidth="1.5"
    >
      <path d="M5.653 3.123A.75.75 0 0 0 4.5 3.75v16.5a.75.75 0 0 0 1.28.53l4.72-4.72h6.25a.75.75 0 0 0 .53-1.28L5.653 3.123z" />
    </svg>
  );
}

const IndividualLiveCursor = React.memo(function IndividualLiveCursor({
  connectionId,
  currentUserId,
}: {
  connectionId: number;
  currentUserId?: string;
}) {
  const other = useOther(
    connectionId,
    (o) => ({
      id: o.id,
      cursor: o.presence?.cursor,
      info: o.info,
    }),
    shallow
  );

  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport();

  if (!other || !other.cursor) return null;
  if (currentUserId && other.id === currentUserId) return null;

  const name = other.info?.name || "Collaborator";
  const color = other.info?.color || "#2563EB";

  const screenX = other.cursor.x * vpZoom + vpX;
  const screenY = other.cursor.y * vpZoom + vpY;

  return (
    <div
      className="absolute left-0 top-0 transition-transform duration-75 ease-out pointer-events-none select-none flex items-start"
      style={{
        transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
      }}
    >
      <CursorPointer color={color} />
      <div
        className="ml-1 mt-3 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white shadow-lg whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
});

export function LiveCursors() {
  const { user } = useUser();

  // Retrieve connection IDs only so parent container does not re-render on cursor movement
  const connectionIds = useOthers(
    (others) => others.map((other) => other.connectionId),
    shallow
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {connectionIds.map((connectionId) => (
        <IndividualLiveCursor
          key={connectionId}
          connectionId={connectionId}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
}
