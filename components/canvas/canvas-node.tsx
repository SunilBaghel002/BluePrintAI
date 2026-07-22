"use client";

import * as React from "react";
import { Handle, Position, NodeProps, NodeResizer, NodeToolbar, useReactFlow } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { CanvasNode, CanvasNodeData, ShapeType, NODE_COLOR_PAIRS } from "@/types/canvas";

interface NodeShapeProps {
  shape?: ShapeType | string;
  label?: string;
  color?: string;
  textColor?: string;
  selected?: boolean;
  isEditing?: boolean;
  labelValue?: string;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onChangeLabel?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFinishEditing?: () => void;
  onCancelEditing?: () => void;
}

export function NodeShape({
  shape = "rectangle",
  label = "",
  color,
  textColor,
  selected = false,
  isEditing = false,
  labelValue = "",
  onDoubleClick,
  onChangeLabel,
  onFinishEditing,
  onCancelEditing,
}: NodeShapeProps) {
  const shapeType: ShapeType = (shape as ShapeType) || "rectangle";
  const fillColor = color || "#121215";
  const labelColor = textColor || "#F0F0F0";
  const strokeColor = selected ? "#71717A" : "#27272A";

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const renderLabelContent = (maxWClass = "max-w-[85%]") => {
    if (isEditing) {
      return (
        <textarea
          ref={textareaRef}
          rows={1}
          value={labelValue}
          onChange={onChangeLabel}
          onBlur={onFinishEditing}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onCancelEditing?.();
            } else if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onFinishEditing?.();
            }
          }}
          className={`nodrag nopan relative z-20 w-full ${maxWClass} mx-auto resize-none bg-transparent text-center font-medium text-xs outline-none border-b border-[#71717A] p-0 focus:ring-0 select-text overflow-hidden`}
          style={{ color: labelColor }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      );
    }

    return (
      <span
        className={`block w-full ${maxWClass} mx-auto truncate text-center font-medium text-xs select-none z-10 cursor-text px-1 py-0.5 rounded transition-colors hover:bg-white/5 ${
          !label ? "text-[#666670] italic" : ""
        }`}
        style={{ color: label ? labelColor : undefined }}
        title="Double-click to edit label"
      >
        {label || "Double-click to edit"}
      </span>
    );
  };

  switch (shapeType) {
    case "rectangle":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className={`relative flex h-full w-full items-center justify-center rounded-xl border p-2 text-xs transition-colors overflow-hidden ${
            selected ? "border-[#71717A]" : "border-[#27272A] hover:border-[#52525B]"
          }`}
          style={{ backgroundColor: fillColor, color: labelColor }}
        >
          {renderLabelContent("max-w-[85%]")}
        </div>
      );

    case "pill":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-2 text-xs transition-colors overflow-hidden ${
            selected ? "border-[#71717A]" : "border-[#27272A] hover:border-[#52525B]"
          }`}
          style={{ backgroundColor: fillColor, color: labelColor }}
        >
          {renderLabelContent("max-w-[75%]")}
        </div>
      );

    case "circle":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-2 text-xs transition-colors overflow-hidden ${
            selected ? "border-[#71717A]" : "border-[#27272A] hover:border-[#52525B]"
          }`}
          style={{ backgroundColor: fillColor, color: labelColor }}
        >
          {renderLabelContent("max-w-[70%]")}
        </div>
      );

    case "diamond":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className="relative h-full w-full flex items-center justify-center overflow-hidden cursor-text"
          style={{ color: labelColor }}
        >
          <svg
            className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
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
          <div className="relative z-10 w-full text-center overflow-hidden">
            {renderLabelContent("max-w-[60%]")}
          </div>
        </div>
      );

    case "hexagon":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className="relative h-full w-full flex items-center justify-center overflow-hidden cursor-text"
          style={{ color: labelColor }}
        >
          <svg
            className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
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
          <div className="relative z-10 w-full text-center overflow-hidden">
            {renderLabelContent("max-w-[70%]")}
          </div>
        </div>
      );

    case "cylinder":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className="relative h-full w-full flex items-center justify-center overflow-hidden cursor-text"
          style={{ color: labelColor }}
        >
          <svg
            className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
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
          <div className="relative z-10 w-full text-center pt-2 overflow-hidden">
            {renderLabelContent("max-w-[75%]")}
          </div>
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

export function CanvasNodeRenderer({ id, data, selected }: NodeProps<CanvasNode>) {
  const nodeData = data as CanvasNodeData;
  const { setNodes, deleteElements } = useReactFlow();

  const [isEditing, setIsEditing] = React.useState(false);
  const [labelValue, setLabelValue] = React.useState(nodeData.label || "");

  const shapeType: ShapeType = (nodeData.shape as ShapeType) || "rectangle";

  React.useEffect(() => {
    if (!isEditing) {
      setLabelValue(nodeData.label || "");
    }
  }, [nodeData.label, isEditing]);

  const handleDoubleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  }, []);

  const handleFinishEditing = React.useCallback(() => {
    setIsEditing(false);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: labelValue,
            },
          };
        }
        return node;
      })
    );
  }, [id, labelValue, setNodes]);

  const handleCancelEditing = React.useCallback(() => {
    setIsEditing(false);
    setLabelValue(nodeData.label || "");
  }, [nodeData.label]);

  const handleLabelChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLabelValue(e.target.value);
    },
    []
  );

  const handleColorChange = React.useCallback(
    (bg: string, text: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                color: bg,
                textColor: text,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  const handleDeleteNode = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteElements({ nodes: [{ id }] });
    },
    [id, deleteElements]
  );

  const handleStyleClass = `!h-2.5 !w-2.5 !border-2 !border-[#0A0A0C] !bg-white hover:!scale-125 transition-all duration-150 z-30 cursor-crosshair shadow-sm ${
    selected ? "opacity-100" : "opacity-0 group-hover/node:opacity-100"
  }`;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="group/node relative h-full w-full"
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={50}
        keepAspectRatio={shapeType === "circle"}
        lineClassName="!border-[#71717A]/60"
        handleClassName="!h-2.5 !w-2.5 !bg-white !border-2 !border-[#0A0A0C] !rounded-full hover:!scale-125 z-40 shadow-sm"
      />

      <NodeToolbar
        isVisible={selected && !isEditing}
        position={Position.Top}
        offset={12}
        className="nodrag nopan flex items-center gap-1.5 rounded-full border border-[#1E1E24] bg-[#0E0E10]/95 px-2.5 py-1.5 shadow-2xl backdrop-blur-md z-50"
      >
        {NODE_COLOR_PAIRS.map((pair) => {
          const isCurrent =
            (nodeData.color || "#121215") === pair.bg &&
            (nodeData.textColor || "#F0F0F0") === pair.text;

          return (
            <button
              key={pair.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(pair.bg, pair.text);
              }}
              title={pair.label}
              className={`group relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-150 ${
                isCurrent
                  ? "scale-125 border-white ring-2 ring-white/40 z-10"
                  : "border-white/20 hover:scale-110 hover:border-white/60"
              }`}
              style={{
                backgroundColor: pair.bg,
                boxShadow: `0 0 6px ${pair.text}40`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full opacity-80 pointer-events-none"
                style={{ backgroundColor: pair.text }}
              />
            </button>
          );
        })}

        <div className="h-3 w-px bg-[#27272A] mx-0.5" />

        <button
          type="button"
          onClick={handleDeleteNode}
          title="Delete shape (Backspace)"
          className="flex h-5 w-5 items-center justify-center rounded-full text-[#888892] hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3 w-3 stroke-[1.5]" />
        </button>
      </NodeToolbar>

      {PORT_HANDLES.map((h) => (
        <React.Fragment key={h.id}>
          {/* Target handle rendered underneath */}
          <Handle
            type="target"
            id={`${h.id}-target`}
            position={h.position}
            isConnectable={true}
            className={handleStyleClass}
          />
          {/* Source handle rendered on top so drag initiation starts from source */}
          <Handle
            type="source"
            id={h.id}
            position={h.position}
            isConnectable={true}
            className={handleStyleClass}
          />
          {/* Fallback source handle for id={`${h.id}-target`} */}
          <Handle
            type="source"
            id={`${h.id}-target`}
            position={h.position}
            isConnectable={true}
            className="!h-2.5 !w-2.5 opacity-0 pointer-events-none z-0"
          />
          {/* Fallback target handle for id={h.id} */}
          <Handle
            type="target"
            id={h.id}
            position={h.position}
            isConnectable={true}
            className="!h-2.5 !w-2.5 opacity-0 pointer-events-none z-0"
          />
          {/* Fallback handles for `${h.id}-source` */}
          <Handle
            type="source"
            id={`${h.id}-source`}
            position={h.position}
            isConnectable={true}
            className="!h-2.5 !w-2.5 opacity-0 pointer-events-none z-0"
          />
          <Handle
            type="target"
            id={`${h.id}-source`}
            position={h.position}
            isConnectable={true}
            className="!h-2.5 !w-2.5 opacity-0 pointer-events-none z-0"
          />
        </React.Fragment>
      ))}

      <NodeShape
        shape={nodeData.shape}
        label={nodeData.label}
        color={nodeData.color}
        textColor={nodeData.textColor}
        selected={selected}
        isEditing={isEditing}
        labelValue={labelValue}
        onDoubleClick={handleDoubleClick}
        onChangeLabel={handleLabelChange}
        onFinishEditing={handleFinishEditing}
        onCancelEditing={handleCancelEditing}
      />
    </div>
  );
}
