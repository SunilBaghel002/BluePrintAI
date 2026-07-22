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
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useUpdateMyPresence, useRoom } from "@liveblocks/react";
import { useCanvasAutosave, SaveStatus } from "@/hooks/use-canvas-autosave";
import {
  CANVAS_NODE_TYPE,
  CANVAS_EDGE_TYPE,
  CanvasNode,
  CanvasEdge,
  ShapeType,
} from "@/types/canvas";
import { CanvasNodeRenderer, NodeShape } from "./canvas-node";
import { CanvasEdgeRenderer } from "./canvas-edge";
import { ShapeToolbar, activeDraggedShapeConfig, setActiveDraggedShape } from "./shape-toolbar";
import { CanvasControlBar } from "./canvas-control-bar";
import { CollaboratorAvatars } from "./collaborator-avatars";
import { LiveCursors } from "./live-cursors";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

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

import { canvasLoadSchema } from "@/types/canvas";

import { StarterTemplatesModal, CanvasTemplate } from "@/components/editor";

export interface BaseCanvasProps {
  isTemplatesOpen?: boolean;
  onCloseTemplates?: () => void;
  onSaveStatusChange?: (status: SaveStatus) => void;
  onRegisterSaveHandler?: (saveFn: () => Promise<boolean>) => void;
}

function BaseCanvasContent({
  isTemplatesOpen = false,
  onCloseTemplates = () => {},
  onSaveStatusChange,
  onRegisterSaveHandler,
}: BaseCanvasProps) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [dragPreview, setDragPreview] = React.useState<DragPreviewState | null>(null);
  const shouldFitViewRef = React.useRef(false);
  const updateMyPresence = useUpdateMyPresence();
  const room = useRoom();
  const roomId = room.id;

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  const { saveStatus, triggerManualSave, seedSnapshots } = useCanvasAutosave({
    projectId: roomId,
    nodes,
    edges,
    isInitialLoading,
  });

  React.useEffect(() => {
    onSaveStatusChange?.(saveStatus);
  }, [saveStatus, onSaveStatusChange]);

  React.useEffect(() => {
    onRegisterSaveHandler?.(triggerManualSave);
  }, [triggerManualSave, onRegisterSaveHandler]);

  const hasAttemptedLoadRef = React.useRef(false);

  React.useEffect(() => {
    if (hasAttemptedLoadRef.current) return;
    hasAttemptedLoadRef.current = true;

    if (nodes.length > 0 || edges.length > 0) {
      setIsInitialLoading(false);
      return;
    }

    fetch(`/api/projects/${roomId}/canvas`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.canvas) return;
        const parseResult = canvasLoadSchema.safeParse(data.canvas);
        if (!parseResult.success) {
          console.warn("Invalid canvas structure from saved blob:", parseResult.error);
          return;
        }

        const loadedNodes = parseResult.data.nodes as CanvasNode[];
        const loadedEdges = parseResult.data.edges as CanvasEdge[];

        if (loadedNodes.length > 0 || loadedEdges.length > 0) {
          if (loadedNodes.length > 0) {
            onNodesChange(loadedNodes.map((n) => ({ type: "add", item: n })));
          }
          if (loadedEdges.length > 0) {
            onEdgesChange(loadedEdges.map((e) => ({ type: "add", item: e })));
          }

          seedSnapshots(loadedNodes, loadedEdges);
          shouldFitViewRef.current = true;
        }
      })
      .catch((err) => {
        console.error("Failed to load saved canvas blob:", err);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, [roomId, nodes.length, edges.length, onNodesChange, onEdgesChange, seedSnapshots]);

  const animationFrameRef = React.useRef<number | null>(null);
  const pendingCursorRef = React.useRef<{ x: number; y: number } | null>(null);

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      pendingCursorRef.current = position;

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          if (pendingCursorRef.current) {
            updateMyPresence({ cursor: pendingCursorRef.current });
          }
        });
      }
    },
    [screenToFlowPosition, updateMyPresence]
  );

  const handlePointerLeave = React.useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pendingCursorRef.current = null;
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (shouldFitViewRef.current && nodes.length > 0) {
      shouldFitViewRef.current = false;
      fitView({ duration: 300 });
    }
  }, [nodes, fitView]);

  const handleSelectTemplate = React.useCallback(
    (template: CanvasTemplate) => {
      shouldFitViewRef.current = true;

      const nodeChanges: NodeChange<CanvasNode>[] = [
        ...nodes.map((n) => ({ type: "remove" as const, id: n.id })),
        ...template.nodes.map((n) => ({ type: "add" as const, item: n })),
      ];
      if (nodeChanges.length > 0) {
        onNodesChange(nodeChanges);
      }

      const edgeChanges: EdgeChange<CanvasEdge>[] = [
        ...edges.map((e) => ({ type: "remove" as const, id: e.id })),
        ...template.edges.map((e) => ({ type: "add" as const, item: e })),
      ];
      if (edgeChanges.length > 0) {
        onEdgesChange(edgeChanges);
      }
    },
    [nodes, edges, onNodesChange, onEdgesChange]
  );

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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
        deleteKeyCode={["Backspace", "Delete"]}
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
      </ReactFlow>

      {dragPreview && <DragPreviewGhost preview={dragPreview} />}

      <LiveCursors />
      <CollaboratorAvatars />
      <CanvasControlBar />
      <ShapeToolbar />

      <StarterTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={onCloseTemplates}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export function BaseCanvas({
  isTemplatesOpen = false,
  onCloseTemplates = () => {},
  onSaveStatusChange,
  onRegisterSaveHandler,
}: BaseCanvasProps) {
  return (
    <ReactFlowProvider>
      <BaseCanvasContent
        isTemplatesOpen={isTemplatesOpen}
        onCloseTemplates={onCloseTemplates}
        onSaveStatusChange={onSaveStatusChange}
        onRegisterSaveHandler={onRegisterSaveHandler}
      />
    </ReactFlowProvider>
  );
}
