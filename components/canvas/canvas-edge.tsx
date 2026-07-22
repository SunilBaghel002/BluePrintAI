"use client";

import * as React from "react";
import {
  type EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow,
  BaseEdge,
} from "@xyflow/react";
import { Tag, X } from "lucide-react";

export function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label: labelProp,
  selected,
  markerEnd,
}: EdgeProps) {
  const { setEdges, deleteElements } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const label =
    (data?.label as string) || (typeof labelProp === "string" ? labelProp : "") || "";
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
    e.preventDefault();
    setIsEditing(true);
  }, []);

  const handleFinishEditing = React.useCallback(() => {
    setIsEditing(false);
    const trimmed = labelValue.trim();
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: trimmed,
            data: {
              ...edge.data,
              label: trimmed,
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

      {/* Invisible wide path for easy hover, selection and click hit-testing */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
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

      {/* Inline Edge Label & Action Renderer */}
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
              placeholder="e.g. Request, Response, Data..."
              className="bg-[#0E0E10]/95 border border-[#52525B] text-xs font-medium text-[#F0F0F0] placeholder:text-[#666670] px-3.5 py-1 rounded-full outline-none shadow-2xl backdrop-blur-md text-center min-w-[110px] focus:border-white/60 focus:ring-1 focus:ring-white/20 transition-all select-text"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          ) : label ? (
            <div
              onClick={handleStartEdit}
              onDoubleClick={handleStartEdit}
              title="Click or double-click to edit label"
              className="group flex items-center gap-1.5 bg-[#0E0E10]/95 border border-[#3F3F46] hover:border-white/50 text-xs font-medium text-[#F0F0F0] px-3.5 py-1 rounded-full shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            >
              <span>{label}</span>
            </div>
          ) : selected || isHovered ? (
            <div
              onClick={handleStartEdit}
              onDoubleClick={handleStartEdit}
              title="Click to add edge label"
              className="group flex items-center gap-1 bg-[#0E0E10]/80 border border-dashed border-[#52525B] hover:border-white/60 text-[11px] font-medium text-[#A1A1AA] hover:text-[#F0F0F0] px-3 py-0.5 rounded-full shadow-md backdrop-blur-sm cursor-pointer transition-all hover:scale-105"
            >
              <Tag className="h-3 w-3 text-[#71717A] group-hover:text-white stroke-[1.5]" />
              <span>Add label</span>
            </div>
          ) : null}

          {(selected || isHovered) && !isEditing && (
            <button
              type="button"
              onClick={handleDeleteEdge}
              title="Delete connection (Backspace)"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0E0E10] border border-[#3F3F46] text-[#888892] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all shadow-md shrink-0 ml-0.5"
            >
              <X className="h-3 w-3 stroke-[1.5]" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
