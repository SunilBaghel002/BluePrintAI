"use client";

import * as React from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  MarkerType,
  useReactFlow,
  useViewport,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { CANVAS_NODE_TYPE, CANVAS_EDGE_TYPE, CanvasNode, ShapeType } from "@/types/canvas";
import { CanvasNodeRenderer, NodeShape } from "./canvas-node";
import { CanvasEdgeRenderer } from "./canvas-edge";
import { ShapeToolbar, activeDraggedShapeConfig, setActiveDraggedShape } from "./shape-toolbar";
import { CanvasControlBar } from "./canvas-control-bar";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

const nodeTypes: NodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer as NodeTypes[string],
};

const edgeTypes: EdgeTypes = {
  [CANVAS_EDGE_TYPE]: CanvasEdgeRenderer as EdgeTypes[string],
};

let idCounter = 1;

function generateNodeId(shape: string): string {
  return `${shape}_${Date.now()}_${idCounter++}`;
}

interface DragPreviewState {
  shape: ShapeType;
  width: number;
  height: number;
  x: number;
  y: number;
}

function DragPreviewGhost({ preview }: { preview: DragPreviewState }) {
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport();

  const left = preview.x * vpZoom + vpX;
  const top = preview.y * vpZoom + vpY;
  const width = preview.width * vpZoom;
  const height = preview.height * vpZoom;

  return (
    <div
      className="pointer-events-none absolute z-50 opacity-60"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <NodeShape shape={preview.shape} label="" selected={true} />
    </div>
  );
}

function BaseCanvasContent() {
  const { screenToFlowPosition } = useReactFlow();
  const [dragPreview, setDragPreview] = React.useState<DragPreviewState | null>(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      if (activeDraggedShapeConfig) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        setDragPreview({
          shape: activeDraggedShapeConfig.shape,
          width: activeDraggedShapeConfig.width,
          height: activeDraggedShapeConfig.height,
          x: position.x - activeDraggedShapeConfig.width / 2,
          y: position.y - activeDraggedShapeConfig.height / 2,
        });
      }
    },
    [screenToFlowPosition]
  );

  const handleDragLeave = React.useCallback(() => {
    setDragPreview(null);
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragPreview(null);
      setActiveDraggedShape(null);

      const rawPayload = event.dataTransfer.getData("application/reactflow");
      if (!rawPayload) return;

      try {
        const { shape, width, height } = JSON.parse(rawPayload);

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const centeredPosition = {
          x: position.x - (width ?? 120) / 2,
          y: position.y - (height ?? 80) / 2,
        };

        const newNode: CanvasNode = {
          id: generateNodeId(shape),
          type: CANVAS_NODE_TYPE,
          position: centeredPosition,
          data: {
            label: "",
            shape: shape,
          },
          style: {
            width: width ?? 120,
            height: height ?? 80,
          },
        };

        onNodesChange([{ type: "add", item: newNode }]);
      } catch (err) {
        console.error("Error handling shape drop:", err);
      }
    },
    [screenToFlowPosition, onNodesChange]
  );

  return (
    <div
      className="relative h-full w-full bg-black overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[12, 12]}
        defaultEdgeOptions={{
          type: CANVAS_EDGE_TYPE,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#888892",
            width: 14,
            height: 14,
          },
        }}
        fitView
        colorMode="dark"
        className="!bg-black"
        style={{ backgroundColor: "#000000" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#33333A"
        />
        <MiniMap
          nodeStrokeWidth={3}
          maskColor="rgba(0, 0, 0, 0.75)"
          className="!bg-[#0E0E10] !border !border-[#1E1E24] !rounded-xl overflow-hidden"
        />
        <Cursors />
      </ReactFlow>

      {dragPreview && <DragPreviewGhost preview={dragPreview} />}

      <CanvasControlBar />
      <ShapeToolbar />
    </div>
  );
}

export function BaseCanvas() {
  return (
    <ReactFlowProvider>
      <BaseCanvasContent />
    </ReactFlowProvider>
  );
}
