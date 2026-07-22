"use client";

import * as React from "react";
import {
  type EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow,
  BaseEdge,
} from "@xyflow/react";
import { X } from "lucide-react";

export function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const { setEdges, deleteElements } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const label = (data?.label as string) || "";
  const [labelValue, setLabelValue] = React.useState(label);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isEditing) {
      setLabelValue(label);
    }
  }, [label, isEditing]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const handleStartEdit = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleFinishEditing = React.useCallback(() => {
    setIsEditing(false);
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              label: labelValue,
            },
          };
        }
        return edge;
      })
    );
  }, [id, labelValue, setEdges]);

  const handleCancelEditing = React.useCallback(() => {
    setIsEditing(false);
    setLabelValue(label);
  }, [label]);

  const handleLabelChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabelValue(e.target.value);
    },
    []
  );

  const handleDeleteEdge = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteElements({ edges: [{ id }] });
    },
    [id, deleteElements]
  );

  const strokeColor = selected || isHovered ? "#E4E4E7" : "#888892";
  const strokeWidth = selected || isHovered ? 2 : 1.5;

  const markerId = `edge-marker-${id}-${selected || isHovered ? "active" : "inactive"}`;
  const customMarkerEnd = markerEnd ? `url(#${markerId})` : undefined;

  return (
    <>
      {markerEnd && (
        <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
            </marker>
          </defs>
        </svg>
      )}

      {/* Invisible wide path for easy hover and click hit-testing */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleStartEdit}
      />

      {/* Visible Edge Line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={customMarkerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transition: "stroke 0.15s ease, stroke-width 0.15s ease",
        }}
      />

      {/* Inline Edge Label Renderer */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan z-20 flex items-center gap-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={labelValue}
              onChange={handleLabelChange}
              onBlur={handleFinishEditing}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancelEditing();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  handleFinishEditing();
                }
              }}
              className="bg-[#121215] border border-[#71717A] text-xs text-[#E4E4E7] px-2 py-0.5 rounded-full outline-none shadow-lg text-center min-w-[60px]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : label ? (
            <div
              onDoubleClick={handleStartEdit}
              className="group flex items-center gap-1 bg-[#121215]/90 border border-[#27272A] hover:border-[#71717A] text-[11px] text-[#A1A1AA] hover:text-[#F0F0F0] px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm cursor-pointer transition-colors"
            >
              <span>{label}</span>
            </div>
          ) : selected || isHovered ? (
            <div
              onDoubleClick={handleStartEdit}
              className="opacity-60 hover:opacity-100 text-[10px] text-[#71717A] bg-[#121215]/80 px-2 py-0.5 rounded-full border border-dashed border-[#27272A] cursor-pointer transition-all"
            >
              Add label
            </div>
          ) : null}

          {(selected || isHovered) && !isEditing && (
            <button
              type="button"
              onClick={handleDeleteEdge}
              title="Delete connection (Backspace)"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#121215] border border-[#27272A] text-[#888892] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all shadow-md shrink-0"
            >
              <X className="h-3 w-3 stroke-[1.5]" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
