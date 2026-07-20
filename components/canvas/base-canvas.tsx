"use client";

import * as React from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { CANVAS_NODE_TYPE, CanvasNode } from "@/types/canvas";
import { CanvasNodeRenderer } from "./canvas-node";
import { ShapeToolbar } from "./shape-toolbar";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

const nodeTypes: NodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer as NodeTypes[string],
};

let idCounter = 1;

function generateNodeId(shape: string): string {
  return `${shape}_${Date.now()}_${idCounter++}`;
}

function BaseCanvasContent() {
  const { screenToFlowPosition } = useReactFlow();
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
    },
    []
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

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
      className="relative h-full w-full bg-[#0A0A0C]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#27272A"
        />
        <MiniMap
          nodeStrokeWidth={3}
          maskColor="rgba(10, 10, 12, 0.75)"
          className="!bg-[#0E0E10] !border !border-[#1E1E24] !rounded-xl overflow-hidden"
        />
        <Cursors />
      </ReactFlow>
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
