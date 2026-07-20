"use client";

import * as React from "react";
import { SHAPE_CONFIGS, ShapeType } from "@/types/canvas";

export let activeDraggedShapeConfig: {
  shape: ShapeType;
  width: number;
  height: number;
} | null = null;

export function setActiveDraggedShape(
  config: { shape: ShapeType; width: number; height: number } | null
) {
  activeDraggedShapeConfig = config;
}

function ShapeIcon({ shape }: { shape: ShapeType }) {
  switch (shape) {
    case "rectangle":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
      );
    case "diamond":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <polygon points="12 3 21 12 12 21 3 12" />
        </svg>
      );
    case "circle":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "pill":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <rect x="3" y="7" width="18" height="10" rx="5" />
        </svg>
      );
    case "cylinder":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M5 6v12c0 2.2 3.1 4 7 4s7-1.8 7-4V6 M5 6c0 2.2 3.1 4 7 4s7-1.8 7-4 M5 6c0-2.2 3.1-4 7-4s7 1.8 7 4" />
        </svg>
      );
    case "hexagon":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5" />
        </svg>
      );
  }
}

export function ShapeToolbar() {
  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    shapeType: ShapeType
  ) => {
    const config = SHAPE_CONFIGS[shapeType];
    setActiveDraggedShape({
      shape: config.type,
      width: config.width,
      height: config.height,
    });

    const payload = JSON.stringify({
      shape: config.type,
      width: config.width,
      height: config.height,
    });

    event.dataTransfer.setData("application/reactflow", payload);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setActiveDraggedShape(null);
  };

  const shapes: ShapeType[] = [
    "rectangle",
    "diamond",
    "circle",
    "pill",
    "cylinder",
    "hexagon",
  ];

  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#1E1E24] bg-[#121215]/90 px-3 py-1.5 shadow-2xl backdrop-blur-md">
      <span className="mr-1.5 text-[10px] font-bold tracking-wider text-[#666670] uppercase select-none">
        SHAPES
      </span>
      <div className="mr-1 h-3.5 w-px bg-[#1E1E24]" />
      {shapes.map((shape) => {
        const config = SHAPE_CONFIGS[shape];
        return (
          <button
            key={shape}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            onDragEnd={handleDragEnd}
            title={`Drag ${config.label} onto canvas`}
            className="group relative flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-[#888892] transition-colors hover:bg-[#1E1E24] hover:text-[#F0F0F0] active:cursor-grabbing"
          >
            <ShapeIcon shape={shape} />
            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-[#1E1E24] bg-[#0A0A0C] px-2 py-0.5 text-[10px] font-medium text-[#F0F0F0] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
