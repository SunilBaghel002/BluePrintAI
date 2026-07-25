"use client";

import * as React from "react";
import { useEventListener } from "@liveblocks/react";
import { aiStatusPayloadSchema, AI_GENERATING_STATUSES } from "@/types/tasks";

export interface RealtimeRunOptions {
  accessToken?: string | null;
  enabled?: boolean;
}

export interface RealtimeRunResult {
  runId: string | null;
  status: "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED" | "IDLE";
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
}

/**
 * Custom React hook for tracking active Trigger.dev run status in real time
 * using Liveblocks broadcast feed & run token state.
 */
export function useRealtimeRun(
  runId?: string | null,
  options?: RealtimeRunOptions
): RealtimeRunResult {
  const [status, setStatus] = React.useState<RealtimeRunResult["status"]>("IDLE");
  const [error, setError] = React.useState<string | null>(null);
  const prevRunIdRef = React.useRef<string | null>(null);

  // Derive/adjust state during render when runId changes
  if (runId !== prevRunIdRef.current) {
    prevRunIdRef.current = runId || null;
    setStatus(runId ? "EXECUTING" : "IDLE");
    setError(null);
  }

  useEventListener(({ event }) => {
    if (!runId) return;

    const parseResult = aiStatusPayloadSchema.safeParse(event);
    if (!parseResult.success) return;

    const payload = parseResult.data;

    if (AI_GENERATING_STATUSES.includes(payload.status)) {
      setStatus("EXECUTING");
    } else if (payload.status === "complete") {
      setStatus("COMPLETED");
    } else if (payload.status === "error") {
      setStatus("FAILED");
      setError(payload.message || "Run execution failed.");
    }
  });

  const isLoading = status === "EXECUTING" || status === "PENDING";
  const isCompleted = status === "COMPLETED";

  return {
    runId: runId || null,
    status,
    isLoading,
    isCompleted,
    error,
  };
}
