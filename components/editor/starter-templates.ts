import { MarkerType } from "@xyflow/react";
import {
  CanvasNode,
  CanvasEdge,
  CANVAS_NODE_TYPE,
  CANVAS_EDGE_TYPE,
} from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Architecture",
    description:
      "Decoupled microservices using API Gateway, Auth, User and Order services with PostgreSQL, Redis cache, and Kafka queue.",
    nodes: [
      {
        id: "api_gateway",
        type: CANVAS_NODE_TYPE,
        position: { x: 100, y: 220 },
        data: {
          label: "API Gateway",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "auth_service",
        type: CANVAS_NODE_TYPE,
        position: { x: 360, y: 100 },
        data: {
          label: "Auth Service",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "user_service",
        type: CANVAS_NODE_TYPE,
        position: { x: 360, y: 220 },
        data: {
          label: "User Service",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "order_service",
        type: CANVAS_NODE_TYPE,
        position: { x: 360, y: 340 },
        data: {
          label: "Order Service",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "redis_cache",
        type: CANVAS_NODE_TYPE,
        position: { x: 620, y: 110 },
        data: {
          label: "Redis Cache",
          shape: "pill",
          color: "#0C374D",
          textColor: "#38BDF8",
        },
        style: { width: 160, height: 60 },
      },
      {
        id: "user_db",
        type: CANVAS_NODE_TYPE,
        position: { x: 630, y: 200 },
        data: {
          label: "Users DB",
          shape: "cylinder",
          color: "#143823",
          textColor: "#4ADE80",
        },
        style: { width: 130, height: 120 },
      },
      {
        id: "kafka_queue",
        type: CANVAS_NODE_TYPE,
        position: { x: 620, y: 340 },
        data: {
          label: "Kafka Queue",
          shape: "hexagon",
          color: "#3D2010",
          textColor: "#FB923C",
        },
        style: { width: 140, height: 100 },
      },
    ],
    edges: [
      {
        id: "e_gw_auth",
        type: CANVAS_EDGE_TYPE,
        source: "api_gateway",
        target: "auth_service",
        label: "HTTP / JWT",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_gw_user",
        type: CANVAS_EDGE_TYPE,
        source: "api_gateway",
        target: "user_service",
        label: "gRPC",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_gw_order",
        type: CANVAS_EDGE_TYPE,
        source: "api_gateway",
        target: "order_service",
        label: "gRPC",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_user_cache",
        type: CANVAS_EDGE_TYPE,
        source: "user_service",
        target: "redis_cache",
        label: "Cache",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_user_db",
        type: CANVAS_EDGE_TYPE,
        source: "user_service",
        target: "user_db",
        label: "SQL",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_order_queue",
        type: CANVAS_EDGE_TYPE,
        source: "order_service",
        target: "kafka_queue",
        label: "Events",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
    ],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Deployment Pipeline",
    description:
      "Automated integration & delivery pipeline with Source Control, Build Runner, Test Suite, Artifact Registry, and Kubernetes.",
    nodes: [
      {
        id: "git_repo",
        type: CANVAS_NODE_TYPE,
        position: { x: 100, y: 200 },
        data: {
          label: "Git Repo",
          shape: "diamond",
          color: "#121215",
          textColor: "#F0F0F0",
        },
        style: { width: 120, height: 120 },
      },
      {
        id: "build_runner",
        type: CANVAS_NODE_TYPE,
        position: { x: 300, y: 220 },
        data: {
          label: "Build Worker",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "test_runner",
        type: CANVAS_NODE_TYPE,
        position: { x: 530, y: 220 },
        data: {
          label: "Test Suite",
          shape: "rectangle",
          color: "#3B2D08",
          textColor: "#FACC15",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "image_registry",
        type: CANVAS_NODE_TYPE,
        position: { x: 760, y: 110 },
        data: {
          label: "Artifact Registry",
          shape: "cylinder",
          color: "#3F122B",
          textColor: "#F472B6",
        },
        style: { width: 130, height: 120 },
      },
      {
        id: "k8s_cluster",
        type: CANVAS_NODE_TYPE,
        position: { x: 755, y: 280 },
        data: {
          label: "K8s Production",
          shape: "hexagon",
          color: "#143823",
          textColor: "#4ADE80",
        },
        style: { width: 140, height: 100 },
      },
    ],
    edges: [
      {
        id: "e_git_build",
        type: CANVAS_EDGE_TYPE,
        source: "git_repo",
        target: "build_runner",
        label: "Push Hook",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_build_test",
        type: CANVAS_EDGE_TYPE,
        source: "build_runner",
        target: "test_runner",
        label: "Artifacts",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_test_registry",
        type: CANVAS_EDGE_TYPE,
        source: "test_runner",
        target: "image_registry",
        label: "Push Image",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_registry_k8s",
        type: CANVAS_EDGE_TYPE,
        source: "image_registry",
        target: "k8s_cluster",
        label: "Helm Deploy",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description:
      "Real-time event processing architecture using Client Telemetry, Event Bus, Stream Processor, Notifications, and Data Warehouse.",
    nodes: [
      {
        id: "client_apps",
        type: CANVAS_NODE_TYPE,
        position: { x: 100, y: 210 },
        data: {
          label: "Client Apps",
          shape: "pill",
          color: "#121215",
          textColor: "#F0F0F0",
        },
        style: { width: 150, height: 60 },
      },
      {
        id: "event_ingest",
        type: CANVAS_NODE_TYPE,
        position: { x: 310, y: 200 },
        data: {
          label: "Ingestion API",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 150, height: 80 },
      },
      {
        id: "event_bus",
        type: CANVAS_NODE_TYPE,
        position: { x: 520, y: 190 },
        data: {
          label: "Event Bus",
          shape: "hexagon",
          color: "#3D2010",
          textColor: "#FB923C",
        },
        style: { width: 130, height: 100 },
      },
      {
        id: "stream_processor",
        type: CANVAS_NODE_TYPE,
        position: { x: 710, y: 100 },
        data: {
          label: "Stream Processor",
          shape: "rectangle",
          color: "#2E1065",
          textColor: "#C084FC",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "realtime_notify",
        type: CANVAS_NODE_TYPE,
        position: { x: 710, y: 280 },
        data: {
          label: "Notifier Worker",
          shape: "rectangle",
          color: "#1E3A5F",
          textColor: "#60A5FA",
        },
        style: { width: 160, height: 80 },
      },
      {
        id: "data_warehouse",
        type: CANVAS_NODE_TYPE,
        position: { x: 930, y: 175 },
        data: {
          label: "Data Warehouse",
          shape: "cylinder",
          color: "#143823",
          textColor: "#4ADE80",
        },
        style: { width: 130, height: 130 },
      },
    ],
    edges: [
      {
        id: "e_client_ingest",
        type: CANVAS_EDGE_TYPE,
        source: "client_apps",
        target: "event_ingest",
        label: "Events",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_ingest_bus",
        type: CANVAS_EDGE_TYPE,
        source: "event_ingest",
        target: "event_bus",
        label: "Publish",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_bus_stream",
        type: CANVAS_EDGE_TYPE,
        source: "event_bus",
        target: "stream_processor",
        label: "Stream",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_bus_notify",
        type: CANVAS_EDGE_TYPE,
        source: "event_bus",
        target: "realtime_notify",
        label: "Subscribe",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
      {
        id: "e_stream_warehouse",
        type: CANVAS_EDGE_TYPE,
        source: "stream_processor",
        target: "data_warehouse",
        label: "Batch Write",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#888892", width: 14, height: 14 },
      },
    ],
  },
];
