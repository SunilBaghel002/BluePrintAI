"use client";

import * as React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CanvasNode, CanvasNodeData } from "@/types/canvas";

export function CanvasNodeRenderer({ data, selected }: NodeProps<CanvasNode>) {
  const nodeData = data as CanvasNodeData;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center rounded-lg border bg-[#121215] p-3 text-xs text-[#F0F0F0] transition-all ${
        selected
          ? "border-[#14B8A6] ring-2 ring-[#14B8A6]/40 shadow-lg shadow-[#14B8A6]/10"
          : "border-[#27272A] hover:border-[#3F3F46]"
      }`}
      style={{
        backgroundColor: nodeData.color || undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-[#0A0A0C] !bg-[#14B8A6]"
      />

      <span className="truncate text-center font-medium select-none">
        {nodeData.label || "\u00A0"}
      </span>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-[#0A0A0C] !bg-[#14B8A6]"
      />
    </div>
  );
}
