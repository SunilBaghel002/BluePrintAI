import { task, logger } from "@trigger.dev/sdk/v3";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { liveblocks } from "../lib/liveblocks";

export const designAgentPayloadSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  roomId: z.string().min(1, "Room ID is required"),
  projectId: z.string().optional(),
});

export type DesignAgentPayload = z.infer<typeof designAgentPayloadSchema>;

const nodeShapeSchema = z.enum([
  "rectangle",
  "pill",
  "circle",
  "diamond",
  "hexagon",
  "cylinder",
]);

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("add_node"),
    id: z.string(),
    label: z.string(),
    shape: nodeShapeSchema.default("rectangle"),
    x: z.number(),
    y: z.number(),
    width: z.number().default(140),
    height: z.number().default(80),
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

const designOutputSchema = z.object({
  summary: z.string(),
  actions: z.array(actionSchema),
});

const SYSTEM_PROMPT = `
You are Ghost AI, an expert system architect assistant for BlueprintAI.
Your goal is to generate clean, visually balanced, professional SaaS architecture diagrams based on the user's prompt.

Layout Guidelines:
1. Arrange nodes in a logical flow (e.g. left-to-right for data pipelines or top-to-bottom for tiered microservices).
2. Space nodes cleanly: horizontal gap minimum 200px-260px, vertical gap minimum 120px-180px.
3. Use appropriate shapes:
   - "rectangle" for Microservices, Core App Services, Worker Nodes.
   - "pill" for API Gateways, Load Balancers, Ingress, Mobile/Web Clients.
   - "circle" for Caches, Session Stores, Auth Services.
   - "diamond" for Event Routers, Decision Engines, Load Balancers.
   - "cylinder" for Databases (PostgreSQL, MySQL, MongoDB, Redis).
   - "hexagon" for Third-party APIs, External Webhooks, Payment Gateways.
4. Keep labels standard and concise (e.g., "API Gateway", "Auth Service", "PostgreSQL DB", "Redis Cache", "Kafka Queue").
5. Connect dependent components with "add_edge" with concise labels when appropriate (e.g. "REST", "gRPC", "Pub/Sub", "SQL").
6. ALWAYS assign vibrant "color" (hex background e.g. "#1E3A5F", "#143823", "#0C374D", "#450A0A", "#3B2D08", "#2E1065", "#3F122B", "#3D2010") and matching "textColor" (hex text e.g. "#60A5FA", "#4ADE80", "#38BDF8", "#F87171", "#FACC15", "#C084FC", "#F472B6", "#FB923C") fields on all "add_node" actions according to node type and prompt instructions.
7. If the user explicitly asks for specific colors (e.g., "red", "blue", "green", "purple", "yellow", "pink"), make sure to apply matching background and text colors (e.g. red: color "#450A0A", textColor "#F87171") to those requested nodes.
`;

/**
 * Intelligent architectural synthesis fallback when AI provider API limit/quota is 0.
 */
function synthesizeArchitecture(prompt: string) {
  const p = prompt.toLowerCase();
  const timestamp = Date.now();

  const isRealtime =
    p.includes("realtime") ||
    p.includes("real-time") ||
    p.includes("chat") ||
    p.includes("socket") ||
    p.includes("pub/sub") ||
    p.includes("pubsub");
  const isMedia =
    p.includes("media") ||
    p.includes("blob") ||
    p.includes("file") ||
    p.includes("storage") ||
    p.includes("s3") ||
    p.includes("upload");

  const wantsRed = p.includes("red");
  const redPair = { color: "#450A0A", textColor: "#F87171" };

  const actions: z.infer<typeof actionSchema>[] = [];

  // Row 1: Client & Ingress
  actions.push({
    action: "add_node",
    id: `node_client_${timestamp}`,
    label: p.includes("react native") ? "React Native Mobile App" : "Web / Mobile Client",
    shape: "pill",
    x: 100,
    y: 100,
    width: 170,
    height: 70,
    color: wantsRed ? redPair.color : "#1E3A5F",
    textColor: wantsRed ? redPair.textColor : "#60A5FA",
  });

  actions.push({
    action: "add_node",
    id: `node_gateway_${timestamp}`,
    label: "API Gateway",
    shape: "pill",
    x: 360,
    y: 100,
    width: 150,
    height: 70,
    color: "#3B2D08",
    textColor: "#FACC15",
  });

  actions.push({
    action: "add_edge",
    id: `edge_client_gw_${timestamp}`,
    source: `node_client_${timestamp}`,
    target: `node_gateway_${timestamp}`,
    label: "HTTPS",
  });

  // Row 2: Microservices & Logic Layer
  let colX = 100;

  actions.push({
    action: "add_node",
    id: `node_auth_${timestamp}`,
    label: "Auth Service",
    shape: "circle",
    x: colX,
    y: 280,
    width: 120,
    height: 120,
    color: "#2E1065",
    textColor: "#C084FC",
  });
  actions.push({
    action: "add_edge",
    id: `edge_gw_auth_${timestamp}`,
    source: `node_gateway_${timestamp}`,
    target: `node_auth_${timestamp}`,
    label: "JWT / Session",
  });
  colX += 200;

  if (isRealtime) {
    actions.push({
      action: "add_node",
      id: `node_realtime_${timestamp}`,
      label: "WebSocket Gateway",
      shape: "rectangle",
      x: colX,
      y: 280,
      width: 160,
      height: 80,
      color: wantsRed ? redPair.color : "#450A0A",
      textColor: wantsRed ? redPair.textColor : "#F87171",
    });
    actions.push({
      action: "add_edge",
      id: `edge_gw_realtime_${timestamp}`,
      source: `node_gateway_${timestamp}`,
      target: `node_realtime_${timestamp}`,
      label: "WSS",
    });
    colX += 220;

    actions.push({
      action: "add_node",
      id: `node_pubsub_${timestamp}`,
      label: "Redis Pub/Sub Engine",
      shape: "diamond",
      x: colX,
      y: 280,
      width: 160,
      height: 100,
      color: "#0C374D",
      textColor: "#38BDF8",
    });
    actions.push({
      action: "add_edge",
      id: `edge_realtime_pubsub_${timestamp}`,
      source: `node_realtime_${timestamp}`,
      target: `node_pubsub_${timestamp}`,
      label: "Publish/Sub",
    });
    colX += 220;
  } else {
    actions.push({
      action: "add_node",
      id: `node_app_${timestamp}`,
      label: "Core App Service",
      shape: "rectangle",
      x: colX,
      y: 280,
      width: 160,
      height: 80,
      color: wantsRed ? redPair.color : "#1E3A5F",
      textColor: wantsRed ? redPair.textColor : "#60A5FA",
    });
    actions.push({
      action: "add_edge",
      id: `edge_gw_app_${timestamp}`,
      source: `node_gateway_${timestamp}`,
      target: `node_app_${timestamp}`,
      label: "REST / gRPC",
    });
    colX += 220;
  }

  if (p.includes("redis") || p.includes("cache")) {
    actions.push({
      action: "add_node",
      id: `node_cache_${timestamp}`,
      label: "Redis Cache",
      shape: "circle",
      x: colX,
      y: 280,
      width: 120,
      height: 120,
      color: wantsRed ? redPair.color : "#0C374D",
      textColor: wantsRed ? redPair.textColor : "#38BDF8",
    });
    actions.push({
      action: "add_edge",
      id: `edge_app_cache_${timestamp}`,
      source: `node_app_${timestamp}`,
      target: `node_cache_${timestamp}`,
      label: "Cache Hits",
    });
    colX += 200;
  }

  if (isMedia) {
    actions.push({
      action: "add_node",
      id: `node_media_${timestamp}`,
      label: "Media Handler",
      shape: "rectangle",
      x: colX,
      y: 280,
      width: 150,
      height: 80,
      color: "#3F122B",
      textColor: "#F472B6",
    });
    actions.push({
      action: "add_edge",
      id: `edge_gw_media_${timestamp}`,
      source: `node_gateway_${timestamp}`,
      target: `node_media_${timestamp}`,
      label: "Upload stream",
    });
  }

  // Row 3: Persistence & Storage Layer
  const dbLabel = p.includes("postgresql") || p.includes("postgres") ? "PostgreSQL DB" : "Primary Database";
  actions.push({
    action: "add_node",
    id: `node_db_${timestamp}`,
    label: dbLabel,
    shape: "cylinder",
    x: 220,
    y: 480,
    width: 150,
    height: 90,
    color: "#143823",
    textColor: "#4ADE80",
  });

  if (isRealtime) {
    actions.push({
      action: "add_edge",
      id: `edge_pubsub_db_${timestamp}`,
      source: `node_pubsub_${timestamp}`,
      target: `node_db_${timestamp}`,
      label: "Persist History",
    });
  }

  if (isMedia) {
    actions.push({
      action: "add_node",
      id: `node_blob_${timestamp}`,
      label: "Vercel Blob Storage",
      shape: "hexagon",
      x: 520,
      y: 480,
      width: 160,
      height: 90,
      color: "#3F122B",
      textColor: "#F472B6",
    });
    actions.push({
      action: "add_edge",
      id: `edge_media_blob_${timestamp}`,
      source: `node_media_${timestamp}`,
      target: `node_blob_${timestamp}`,
      label: "Store Assets",
    });
  }

  const summary = `Generated system architecture diagram for: "${prompt.slice(0, 50)}..."`;

  return { summary, actions };
}

export const designAgentTask = task({
  id: "design-agent",
  maxDuration: 3600,
  run: async (payload: DesignAgentPayload) => {
    const validatedPayload = designAgentPayloadSchema.parse(payload);
    const { prompt, roomId, projectId } = validatedPayload;

    logger.info("Design agent task started", {
      roomId,
      projectId,
      promptSnippet: prompt.slice(0, 30),
    });

    const updatePresence = async (
      cursor: { x: number; y: number } | null,
      thinking: boolean
    ) => {
      try {
        await liveblocks.setPresence(roomId, {
          userId: "ghost-ai",
          data: {
            cursor,
            thinking,
            isThinking: thinking,
          },
          userInfo: {
            name: "Ghost AI",
            avatar: "",
            color: "#14B8A6",
          },
          ttl: 300,
        });
      } catch (err) {
        logger.warn("Failed to set AI presence", { error: err });
      }
    };

    const broadcastStatus = async (
      status: "start" | "processing" | "complete" | "error",
      message: string
    ) => {
      try {
        await liveblocks.broadcastEvent(roomId, {
          type: "AI_STATUS",
          status,
          message,
        });
      } catch (err) {
        logger.warn("Failed to broadcast AI status", { error: err });
      }
    };

    const broadcastChatMessage = async (content: string) => {
      try {
        await liveblocks.broadcastEvent(roomId, {
          type: "AI_CHAT",
          id: `msg_ai_${Date.now()}`,
          sender: "Ghost AI",
          senderId: "ghost-ai",
          role: "assistant",
          content,
          timestamp: Date.now(),
        });
      } catch (err) {
        logger.warn("Failed to broadcast AI chat message", { error: err });
      }
    };

    try {
      // 1. Initial AI Presence & Status
      await updatePresence({ x: 300, y: 200 }, true);
      await broadcastStatus("start", "Ghost AI is analyzing architecture requirements...");

      let summary: string;
      let actions: z.infer<typeof actionSchema>[];

      // 2. Attempt AI Generation with Provider Cascade & Fallback for Quota / Billing restrictions
      try {
        await broadcastStatus("processing", "Designing microservices and node layouts...");
        
        const openaiKey = process.env.OPENAI_API_KEY;
        const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
        let generatedResult: { summary: string; actions: z.infer<typeof actionSchema>[] } | null = null;

        if (openaiKey) {
          try {
            logger.info("Attempting AI generation with OpenAI gpt-4o...");
            const openai = createOpenAI({ apiKey: openaiKey });
            const response = await generateObject({
              model: (openai("gpt-4o") as unknown) as Parameters<typeof generateObject>[0]["model"],
              schema: designOutputSchema,
              system: SYSTEM_PROMPT,
              prompt: `User Request: "${prompt}"\n\nGenerate an architecture diagram with structured node and edge actions.`,
              abortSignal: AbortSignal.timeout(30000),
            });
            generatedResult = response.object;
            logger.info("AI design generated via OpenAI gpt-4o", {
              summary: response.object.summary,
              actionCount: response.object.actions.length,
            });
          } catch (openaiErr) {
            logger.warn("OpenAI generation failed or timed out. Attempting Gemini retry if available.", {
              error: openaiErr instanceof Error ? openaiErr.message : openaiErr,
            });
          }
        }

        if (!generatedResult && googleKey) {
          logger.info("Attempting AI generation with Gemini gemini-2.0-flash...");
          const google = createGoogleGenerativeAI({ apiKey: googleKey });
          const response = await generateObject({
            model: (google("gemini-2.0-flash") as unknown) as Parameters<typeof generateObject>[0]["model"],
            schema: designOutputSchema,
            system: SYSTEM_PROMPT,
            prompt: `User Request: "${prompt}"\n\nGenerate an architecture diagram with structured node and edge actions.`,
            abortSignal: AbortSignal.timeout(30000),
          });
          generatedResult = response.object;
          logger.info("AI design generated via Gemini", {
            summary: response.object.summary,
            actionCount: response.object.actions.length,
          });
        }

        if (!generatedResult) {
          throw new Error("No AI provider succeeded or API keys missing.");
        }

        summary = generatedResult.summary;
        actions = generatedResult.actions;
      } catch (aiErr) {
        logger.warn("AI Provider calls failed or quota/billing limit reached. Using architectural synthesis engine fallback.", {
          error: aiErr instanceof Error ? aiErr.message : aiErr,
        });
        
        await broadcastStatus("processing", "Synthesizing architecture nodes and data flows...");
        const fallback = synthesizeArchitecture(prompt);
        summary = fallback.summary;
        actions = fallback.actions;
      }

      // 3. Move cursor to first node position if available
      const firstAddNode = actions.find((a) => a.action === "add_node") as
        | Extract<(typeof actions)[number], { action: "add_node" }>
        | undefined;

      if (firstAddNode) {
        await updatePresence({ x: firstAddNode.x, y: firstAddNode.y }, true);
      }

      // 4. Broadcast Canvas Actions to connected clients
      await broadcastStatus("processing", `Applying ${actions.length} architecture updates...`);
      await liveblocks.broadcastEvent(roomId, {
        type: "AI_CANVAS_ACTIONS",
        summary,
        actions,
      });

      // 5. Complete Task & Broadcast Success (both status and chat message)
      const completionMsg = summary || "Architecture generation complete!";
      await broadcastStatus("complete", completionMsg);
      await broadcastChatMessage(completionMsg);
      await updatePresence(null, false);

      return {
        success: true,
        summary,
        actionsCount: actions.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Generation error";
      logger.error("Error executing design agent task", { error: errorMessage });
      await broadcastStatus("error", errorMessage);
      await broadcastChatMessage(`Error generating architecture: ${errorMessage}`);
      await updatePresence(null, false);

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
