"use client";

import * as React from "react";
import { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseCanvasAutosaveProps {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  debounceMs?: number;
  isInitialLoading?: boolean;
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  debounceMs = 2000,
  isInitialLoading = false,
}: UseCanvasAutosaveProps) {
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
  const isFirstRenderRef = React.useRef(true);
  const prevNodesRef = React.useRef<CanvasNode[]>([]);
  const prevEdgesRef = React.useRef<CanvasEdge[]>([]);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const saveRequestIdRef = React.useRef(0);

  const seedSnapshots = React.useCallback((seededNodes: CanvasNode[], seededEdges: CanvasEdge[]) => {
    prevNodesRef.current = seededNodes;
    prevEdgesRef.current = seededEdges;
  }, []);

  const performSave = React.useCallback(
    async (nodesToSave: CanvasNode[], edgesToSave: CanvasEdge[]) => {
      const currentRequestId = ++saveRequestIdRef.current;
      setSaveStatus("saving");
      try {
        const response = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodes: nodesToSave,
            edges: edgesToSave,
          }),
          signal: AbortSignal.timeout(10000),
        });

        // Invalidate stale in-flight requests
        if (currentRequestId !== saveRequestIdRef.current) {
          return false;
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Canvas autosave failed:", errData.error || errData);
          setSaveStatus("error");
          return false;
        }

        setSaveStatus("saved");
        return true;
      } catch (err) {
        if (currentRequestId !== saveRequestIdRef.current) {
          return false;
        }
        console.error("Canvas autosave network error:", err);
        setSaveStatus("error");
        return false;
      }
    },
    [projectId]
  );

  const triggerManualSave = React.useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    return performSave(nodes, edges);
  }, [performSave, nodes, edges]);

  React.useEffect(() => {
    if (isInitialLoading) {
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
      return;
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
      return;
    }

    // Optimized change detection: cheap length and reference checks before stringifying
    const nodesLengthChanged = nodes.length !== prevNodesRef.current.length;
    const edgesLengthChanged = edges.length !== prevEdgesRef.current.length;

    const nodesChanged =
      nodesLengthChanged ||
      (nodes !== prevNodesRef.current && JSON.stringify(nodes) !== JSON.stringify(prevNodesRef.current));
    const edgesChanged =
      edgesLengthChanged ||
      (edges !== prevEdgesRef.current && JSON.stringify(edges) !== JSON.stringify(prevEdgesRef.current));

    if (!nodesChanged && !edgesChanged) {
      return;
    }

    prevNodesRef.current = nodes;
    prevEdgesRef.current = edges;
    setSaveStatus("saving");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSave(nodes, edges);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, debounceMs, isInitialLoading, performSave]);

  return {
    saveStatus,
    triggerManualSave,
    seedSnapshots,
  };
}
