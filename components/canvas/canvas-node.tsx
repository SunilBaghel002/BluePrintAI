"use client";

import * as React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CanvasNode, CanvasNodeData, ShapeType } from "@/types/canvas";

interface NodeShapeProps {
  shape?: ShapeType | string;
  label?: string;
  color?: string;
  selected?: boolean;
}

export function NodeShape({
  shape = "rectangle",
  label = "",
  color,
  selected = false,
}: NodeShapeProps) {
  const shapeType: ShapeType = (shape as ShapeType) || "rectangle";
  const fillColor = color || "#121215";
  const strokeColor = selected ? "#14B8A6" : "#27272A";

  switch (shapeType) {
    case "rectangle":
      return (
        <div
          className={`relative flex h-full w-full items-center justify-center rounded-xl border p-3 text-xs text-[#F0F0F0] transition-colors ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          <span className="truncate text-center font-medium select-none z-10">
            {label || "\u00A0"}
          </span>
        </div>
      );

    case "pill":
      return (
        <div
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-3 text-xs text-[#F0F0F0] transition-colors ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          <span className="truncate text-center font-medium select-none z-10">
            {label || "\u00A0"}
          </span>
        </div>
      );

    case "circle":
      return (
        <div
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-3 text-xs text-[#F0F0F0] transition-colors ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          <span className="truncate text-center font-medium select-none z-10">
            {label || "\u00A0"}
          </span>
        </div>
      );

    case "diamond":
      return (
        <div className="relative h-full w-full flex items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,2 98,50 50,98 2,50"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={selected ? "2" : "1.5"}
              vectorEffect="non-scaling-stroke"
              className="transition-colors"
            />
          </svg>
          <span className="relative z-10 truncate px-4 text-center text-xs font-medium text-[#F0F0F0] select-none">
            {label || "\u00A0"}
          </span>
        </div>
      );

    case "hexagon":
      return (
        <div className="relative h-full w-full flex items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,2 96,25 96,75 50,98 4,75 4,25"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={selected ? "2" : "1.5"}
              vectorEffect="non-scaling-stroke"
              className="transition-colors"
            />
          </svg>
          <span className="relative z-10 truncate px-4 text-center text-xs font-medium text-[#F0F0F0] select-none">
            {label || "\u00A0"}
          </span>
        </div>
      );

    case "cylinder":
      return (
        <div className="relative h-full w-full flex items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Cylinder Body */}
            <path
              d="M 4,16 L 4,84 C 4,94 96,94 96,84 L 96,16 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={selected ? "2" : "1.5"}
              vectorEffect="non-scaling-stroke"
              className="transition-colors"
            />
            {/* Top Cap */}
            <ellipse
              cx="50"
              cy="16"
              rx="46"
              ry="10"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={selected ? "2" : "1.5"}
              vectorEffect="non-scaling-stroke"
              className="transition-colors"
            />
          </svg>
          <span className="relative z-10 truncate px-4 text-center text-xs font-medium text-[#F0F0F0] select-none">
            {label || "\u00A0"}
          </span>
        </div>
      );

    default:
      return null;
  }
}

const PORT_HANDLES = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

export function CanvasNodeRenderer({ data, selected }: NodeProps<CanvasNode>) {
  const nodeData = data as CanvasNodeData;

  return (
    <div className="relative h-full w-full">
      {PORT_HANDLES.map((h) => (
        <React.Fragment key={h.id}>
          {/* Main source & target handles for clean 4-port connections */}
          <Handle
            type="source"
            id={h.id}
            position={h.position}
            isConnectable={true}
            className="!h-3 !w-3 !border-2 !border-black !bg-[#14B8A6] hover:!bg-[#2DD4BF] hover:!scale-125 transition-all z-30 cursor-crosshair"
          />
          <Handle
            type="target"
            id={h.id}
            position={h.position}
            isConnectable={true}
            className="!h-3 !w-3 !border-2 !border-black !bg-[#14B8A6] hover:!bg-[#2DD4BF] hover:!scale-125 transition-all z-30 cursor-crosshair"
          />
          {/* Fallback target handles for any legacy storage edges */}
          <Handle
            type="source"
            id={`${h.id}-target`}
            position={h.position}
            isConnectable={true}
            className="!h-3 !w-3 opacity-0 pointer-events-none z-0"
          />
          <Handle
            type="target"
            id={`${h.id}-target`}
            position={h.position}
            isConnectable={true}
            className="!h-3 !w-3 opacity-0 pointer-events-none z-0"
          />
        </React.Fragment>
      ))}

      <NodeShape
        shape={nodeData.shape}
        label={nodeData.label}
        color={nodeData.color}
        selected={selected}
      />
    </div>
  );
}
