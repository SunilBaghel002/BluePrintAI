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

