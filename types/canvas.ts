import type { Node, Edge } from "@xyflow/react";
import { z } from "zod";

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
  textColor?: string;
  shape?: ShapeType | string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export interface NodeColorPair {
  id: string;
  label: string;
  bg: string;
  text: string;
}

export const NODE_COLOR_PAIRS: NodeColorPair[] = [
  { id: "default", label: "Default Dark", bg: "#121215", text: "#F0F0F0" },
  { id: "blue", label: "Service Blue", bg: "#1E3A5F", text: "#60A5FA" },
  { id: "green", label: "Database Green", bg: "#143823", text: "#4ADE80" },
  { id: "orange", label: "Queue Orange", bg: "#3D2010", text: "#FB923C" },
  { id: "purple", label: "AI Purple", bg: "#2E1065", text: "#C084FC" },
  { id: "pink", label: "Storage Pink", bg: "#3F122B", text: "#F472B6" },
  { id: "yellow", label: "Warning Yellow", bg: "#3B2D08", text: "#FACC15" },
  { id: "cyan", label: "Cache Cyan", bg: "#0C374D", text: "#38BDF8" },
];

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

const nodeSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    data: z.record(z.string(), z.unknown()),
    style: z.record(z.string(), z.unknown()).optional(),
    selected: z.boolean().optional(),
  })
  .passthrough();

const edgeSchema = z
  .object({
    id: z.string(),
    type: z.string().optional(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
    label: z.union([z.string(), z.null()]).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    markerEnd: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export const canvasDataSchema = z.object({
  nodes: z.array(nodeSchema).default([]),
  edges: z.array(edgeSchema).default([]),
});
