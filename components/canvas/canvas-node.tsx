"use client";

import * as React from "react";
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from "@xyflow/react";
import { CanvasNode, CanvasNodeData, ShapeType } from "@/types/canvas";

interface NodeShapeProps {
  shape?: ShapeType | string;
  label?: string;
  color?: string;
  selected?: boolean;
  isEditing?: boolean;
  labelValue?: string;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onChangeLabel?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFinishEditing?: () => void;
}

export function NodeShape({
  shape = "rectangle",
  label = "",
  color,
  selected = false,
  isEditing = false,
  labelValue = "",
  onDoubleClick,
  onChangeLabel,
  onFinishEditing,
}: NodeShapeProps) {
  const shapeType: ShapeType = (shape as ShapeType) || "rectangle";
  const fillColor = color || "#121215";
  const strokeColor = selected ? "#14B8A6" : "#27272A";

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
            if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
              e.preventDefault();
              onFinishEditing?.();
            }
          }}
          className={`nodrag nopan relative z-20 w-full ${maxWClass} mx-auto resize-none bg-transparent text-center font-medium text-xs text-[#F0F0F0] outline-none border-b border-[#14B8A6] p-0 focus:ring-0 select-text overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      );
    }

    return (
      <span
        className={`block w-full ${maxWClass} mx-auto truncate text-center font-medium text-xs select-none z-10 cursor-text px-1 py-0.5 rounded transition-colors hover:bg-white/5 ${
          !label ? "text-[#666670] italic" : "text-[#F0F0F0]"
        }`}
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
          className={`relative flex h-full w-full items-center justify-center rounded-xl border p-2 text-xs text-[#F0F0F0] transition-colors overflow-hidden ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          {renderLabelContent("max-w-[85%]")}
        </div>
      );

    case "pill":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-2 text-xs text-[#F0F0F0] transition-colors overflow-hidden ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          {renderLabelContent("max-w-[75%]")}
        </div>
      );

    case "circle":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className={`relative flex h-full w-full items-center justify-center rounded-full border p-2 text-xs text-[#F0F0F0] transition-colors overflow-hidden ${
            selected ? "border-[#14B8A6]" : "border-[#27272A] hover:border-[#3F3F46]"
          }`}
          style={{ backgroundColor: fillColor }}
        >
          {renderLabelContent("max-w-[70%]")}
        </div>
      );

    case "diamond":
      return (
        <div
          onDoubleClick={onDoubleClick}
          className="relative h-full w-full flex items-center justify-center overflow-hidden cursor-text"
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
  const { setNodes } = useReactFlow();

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

  const handleLabelChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLabelValue(newValue);
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newValue,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative h-full w-full"
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={50}
        keepAspectRatio={shapeType === "circle"}
        lineClassName="!border-[#14B8A6]/60"
        handleClassName="!h-3 !w-3 !bg-[#14B8A6] !border-2 !border-black !rounded-sm hover:!bg-[#2DD4BF] z-40"
      />

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
        isEditing={isEditing}
        labelValue={labelValue}
        onDoubleClick={handleDoubleClick}
        onChangeLabel={handleLabelChange}
        onFinishEditing={handleFinishEditing}
      />
    </div>
  );
}
