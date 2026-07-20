"use client";

import * as React from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { Loader2, AlertTriangle } from "lucide-react";
import { BaseCanvas } from "./base-canvas";

interface CanvasRoomProps {
  roomId: string;
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Liveblocks Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0A0A0C] p-6 text-center text-[#F0F0F0]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#EF4444]/40 bg-[#2A1215] text-[#EF4444] shadow-lg">
            <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="mt-4 text-base font-semibold">
            Unable to connect to collaborative canvas
          </h2>
          <p className="mt-1 max-w-sm text-xs text-[#888892]">
            {this.state.error?.message ||
              "An error occurred while establishing the real-time session."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <CanvasErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{
            cursor: null,
            isThinking: false,
          }}
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#0A0A0C] text-[#888892]">
                <Loader2 className="h-6 w-6 animate-spin text-[#14B8A6]" />
                <span className="mt-3 text-xs font-medium">
                  Connecting to canvas...
                </span>
              </div>
            }
          >
            {() => <BaseCanvas />}
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </CanvasErrorBoundary>
  );
}
