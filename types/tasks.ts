import { z } from "zod";

/**
 * Schema for AI_STATUS broadcast events sent by the design agent
 * via liveblocks.broadcastEvent. Validated in the AI sidebar
 * before displaying status messages to all room participants.
 */
export const aiStatusPayloadSchema = z.object({
  type: z.literal("AI_STATUS"),
  status: z.enum(["start", "processing", "complete", "error"]),
  message: z.string(),
  text: z.string().optional(),
});

export type AiStatusPayload = z.infer<typeof aiStatusPayloadSchema>;

/** Active generation states where the UI should show loading indicators. */
export const AI_GENERATING_STATUSES: AiStatusPayload["status"][] = [
  "start",
  "processing",
];

/**
 * Schema for real-time room chat messages sent over the Liveblocks ai-chat feed.
 */
export const aiChatMessageSchema = z.object({
  type: z.literal("AI_CHAT"),
  id: z.string(),
  sender: z.string(),
  senderId: z.string().optional(),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  timestamp: z.number(),
});

export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;

const nodeShapeSchema = z.enum([
  "rectangle",
  "pill",
  "circle",
  "diamond",
  "hexagon",
  "cylinder",
]);

export const aiCanvasActionItemSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("add_node"),
    id: z.string(),
    label: z.string(),
    shape: nodeShapeSchema.optional(),
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
    color: z.string().optional(),
    textColor: z.string().optional(),
  }),
  z.object({
    action: z.literal("move_node"),
    id: z.string(),
    x: z.number(),
    y: z.number(),
  }),
  z.object({
    action: z.literal("resize_node"),
    id: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({
    action: z.literal("update_node"),
    id: z.string(),
    label: z.string().optional(),
    shape: nodeShapeSchema.optional(),
    color: z.string().optional(),
    textColor: z.string().optional(),
  }),
  z.object({
    action: z.literal("delete_node"),
    id: z.string(),
  }),
  z.object({
    action: z.literal("add_edge"),
    id: z.string(),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
  }),
  z.object({
    action: z.literal("delete_edge"),
    id: z.string(),
  }),
]);

export const aiCanvasActionsSchema = z.object({
  type: z.literal("AI_CANVAS_ACTIONS"),
  summary: z.string().optional(),
  actions: z.array(aiCanvasActionItemSchema),
});

export type AiCanvasActionsPayload = z.infer<typeof aiCanvasActionsSchema>;


