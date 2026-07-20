import type { Node, Edge } from "@xyflow/react";

export const CANVAS_NODE_TYPE = "canvasNode" as const;
export const CANVAS_EDGE_TYPE = "canvasEdge" as const;

export type CustomNodeTypes = typeof CANVAS_NODE_TYPE;
export type CustomEdgeTypes = typeof CANVAS_EDGE_TYPE;

export type ShapeType =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export interface CanvasNodeData {
  label: string;
  color?: string;
  shape?: ShapeType | string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export type CanvasNode = Node<CanvasNodeData, CustomNodeTypes>;
export type CanvasEdge = Edge;

export interface ShapeConfig {
  type: ShapeType;
  label: string;
  width: number;
  height: number;
}

export const SHAPE_CONFIGS: Record<ShapeType, ShapeConfig> = {
  rectangle: { type: "rectangle", label: "Rectangle", width: 160, height: 80 },
  diamond: { type: "diamond", label: "Diamond", width: 120, height: 120 },
  circle: { type: "circle", label: "Circle", width: 100, height: 100 },
  pill: { type: "pill", label: "Pill", width: 160, height: 60 },
  cylinder: { type: "cylinder", label: "Cylinder", width: 120, height: 140 },
  hexagon: { type: "hexagon", label: "Hexagon", width: 130, height: 110 },
};
