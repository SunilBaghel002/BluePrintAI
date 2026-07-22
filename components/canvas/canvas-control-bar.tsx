"use client";

import * as React from "react";
import { useReactFlow } from "@xyflow/react";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react";
import { Plus, Minus, Maximize2, Undo2, Redo2 } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function CanvasControlBar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleZoomIn = React.useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = React.useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleFitView = React.useCallback(() => {
    fitView({ duration: 300 });
  }, [fitView]);

  useKeyboardShortcuts({
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onUndo: undo,
    onRedo: redo,
  });

  return (
    <div className="absolute bottom-6 left-6 z-40 nodrag nopan flex items-center gap-1 rounded-full border border-[#1E1E24] bg-[#0E0E10]/95 px-3 py-1.5 shadow-2xl backdrop-blur-md text-[#F0F0F0] select-none">
      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#A0A0A0] transition-colors hover:bg-white/10 hover:text-white active:scale-95"
        >
          <Minus className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={handleFitView}
          title="Fit View"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#A0A0A0] transition-colors hover:bg-white/10 hover:text-white active:scale-95"
        >
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#A0A0A0] transition-colors hover:bg-white/10 hover:text-white active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-1 h-4 w-px bg-[#27272A]" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            canUndo
              ? "text-[#A0A0A0] hover:bg-white/10 hover:text-white active:scale-95"
              : "cursor-not-allowed text-[#404048] opacity-40"
          }`}
        >
          <Undo2 className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            canRedo
              ? "text-[#A0A0A0] hover:bg-white/10 hover:text-white active:scale-95"
              : "cursor-not-allowed text-[#404048] opacity-40"
          }`}
        >
          <Redo2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
