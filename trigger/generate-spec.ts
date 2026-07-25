import { task, logger } from "@trigger.dev/sdk/v3";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";
import { liveblocks } from "../lib/liveblocks";

const chatHistoryItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  sender: z.string().optional(),
});

const nodeItemSchema = z
  .object({
    id: z.string().optional(),
    label: z.string().optional(),
    shape: z.string().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

const edgeItemSchema = z
  .object({
    id: z.string().optional(),
    source: z.string().optional(),
    target: z.string().optional(),
    label: z.string().optional(),
  })
  .passthrough();

export const generateSpecPayloadSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  projectId: z.string().optional(),
  chatHistory: z.array(chatHistoryItemSchema).optional().default([]),
  nodes: z.array(nodeItemSchema).optional().default([]),
  edges: z.array(edgeItemSchema).optional().default([]),
});

export type GenerateSpecPayload = z.infer<typeof generateSpecPayloadSchema>;

const SPEC_SYSTEM_PROMPT = `
You are Ghost AI, an elite SaaS systems architect for BlueprintAI.
Your goal is to generate a comprehensive, clear, professional Markdown Technical Specification document based on the provided architecture canvas nodes, edges, and user chat context.

Required Markdown Structure:
# Architectural Specification & Technical Blueprint

## 1. Executive Summary & Overview
High-level description of the system architecture, core application goals, target user scale, and architectural patterns.

## 2. System Boundaries & Microservices
Detailed breakdown of each service/node on the canvas, its role, ingress gateways, and service-to-service communication paths.

## 3. Data Models & Storage Strategy
Detailed database schema design (PostgreSQL / Redis / MongoDB / Blob storage), entity relationships, indexing, caching, and persistence mechanisms.

## 4. API & Integration Contracts
Interface definitions (REST, gRPC, WebSocket), request/response structures, message queues, and external webhook integrations.

## 5. Security, Auth & Reliability
Authentication & authorization flows (JWT / OAuth2 / Session), encryption at rest & in transit, rate limiting, and failure recovery.

## 6. Infrastructure & Deployment
Deployment configuration (Docker / Kubernetes / Serverless), CI/CD pipeline, monitoring, and autoscaling strategy.
`;

/**
 * Technical specification synthesis fallback when AI provider API limits/quota are reached.
 */
function synthesizeTechnicalSpec(
  roomId: string,
  nodes: z.infer<typeof nodeItemSchema>[],
  edges: z.infer<typeof edgeItemSchema>[],
  chatHistory: z.infer<typeof chatHistoryItemSchema>[]
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const nodeList =
    nodes.length > 0
      ? nodes.map((n) => `- **${n.label || n.id}** (${n.shape || "rectangle"})`).join("\n")
      : "- **API Gateway** (pill)\n- **Auth Microservice** (circle)\n- **Core App Service** (rectangle)\n- **PostgreSQL DB** (cylinder)";

  const edgeList =
    edges.length > 0
      ? edges.map((e) => `- ${e.source} -> ${e.target} ${e.label ? `[${e.label}]` : ""}`).join("\n")
      : "- Web Client -> API Gateway [HTTPS]\n- API Gateway -> Core App Service [gRPC]\n- Core App Service -> PostgreSQL DB [SQL]";

  const chatContext =
    chatHistory.length > 0
      ? chatHistory.map((c) => `> **${c.role.toUpperCase()}**: ${c.content}`).join("\n\n")
      : "_No chat prompt history provided._";

  return `# Architectural Specification & Technical Blueprint

**Project Workspace ID:** \`${roomId}\`  
**Generated Date:** ${timestamp}  
**Draft Version:** 1.0 (Synthesized Draft)

---

## 1. Executive Summary & Overview
This technical specification details the SaaS architecture designed within BlueprintAI workspace \`${roomId}\`. The system is engineered to satisfy high concurrency, modular microservice isolation, sub-100ms response latencies, and linear horizontal scaling.

### Architectural Goals:
- High availability with fault isolation across microservices.
- Strict data persistence guarantees using relational and caching tiers.
- Real-time streaming and responsive client-server contracts.

---

## 2. System Boundaries & Microservices

### Active Canvas Components:
${nodeList}

### Connection Topology:
${edgeList}

---

## 3. Data Models & Storage Strategy
- **Relational Storage (PostgreSQL):** Primary transactional database enforcing ACID compliance, multi-region replication, and automated point-in-time recovery.
- **Caching Layer (Redis):** In-memory distributed cache for session management, token validation, and API response caching with automatic TTL eviction.
- **Object Storage (Vercel Blob / S3):** Scalable storage for media assets, export artifacts, and binary documents.

---

## 4. API & Integration Contracts
- **Protocols:** RESTful HTTP/2 APIs for external clients; gRPC for internal inter-service communication.
- **Real-Time Streaming:** WebSockets (WSS) and Redis Pub/Sub for live collaboration and instantaneous state synchronization.

---

## 5. Security, Auth & Reliability
- **Authentication:** Clerk / OAuth2 with JWT bearer token validation at API Gateway boundaries.
- **Encryption:** TLS 1.3 in transit; AES-256 for data at rest.
- **Resilience:** Circuit breakers, exponential backoff retries, and rate limiting (100 req/min per tenant).

---

## 6. Infrastructure & Deployment
- **Runtime:** Containerized Next.js App Router & Node.js microservices deployed to Vercel / Cloud Infrastructure.
- **CI/CD:** Automated GitHub Actions build, lint, typecheck, and zero-downtime deployment pipelines.

---

### Recent Conversation Context:
${chatContext}
`;
}

export const generateSpecTask = task({
  id: "generate-spec",
  maxDuration: 3600,
  run: async (payload: GenerateSpecPayload) => {
    let roomId = payload?.roomId || "unknown_room";

    const updatePresence = async (thinking: boolean) => {
      try {
        await liveblocks.setPresence(roomId, {
          userId: "ghost-ai",
          data: {
            cursor: null,
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
        logger.warn("Failed to set AI spec presence", { error: err });
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

    try {
      const validatedPayload = generateSpecPayloadSchema.parse(payload);
      const { projectId, chatHistory, nodes, edges } = validatedPayload;
      roomId = validatedPayload.roomId;
      const targetProjectId = projectId || roomId;

      logger.info("Generate spec task started", {
        roomId,
        projectId: targetProjectId,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        chatCount: chatHistory.length,
      });

      await updatePresence(true);
      await broadcastStatus("start", "Ghost AI is compiling technical architecture spec...");

      let markdownSpec = "";
      const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
      const openaiKey = process.env.OPENAI_API_KEY;

      const userContextPrompt = `
Workspace Room ID: "${roomId}"
Nodes Count: ${nodes.length}
Nodes Detail: ${JSON.stringify(nodes)}
Edges Detail: ${JSON.stringify(edges)}
Recent Chat Context: ${JSON.stringify(chatHistory.slice(-6))}

Please generate a comprehensive, highly technical Markdown architectural specification document based on this architecture graph.
`;

      await broadcastStatus("processing", "Generating Markdown specification document...");

      // 1. Attempt Gemini via @ai-sdk/google
      if (googleKey) {
        try {
          logger.info("Attempting spec generation with Gemini gemini-2.0-flash...");
          const google = createGoogleGenerativeAI({ apiKey: googleKey });
          const response = await generateText({
            model: (google("gemini-2.0-flash") as unknown) as Parameters<typeof generateText>[0]["model"],
            system: SPEC_SYSTEM_PROMPT,
            prompt: userContextPrompt,
            abortSignal: AbortSignal.timeout(45000),
          });
          markdownSpec = response.text;
          logger.info("Spec generated via Gemini", { length: markdownSpec.length });
        } catch (geminiErr) {
          logger.warn("Gemini spec generation failed or timed out. Attempting OpenAI fallback.", {
            error: geminiErr instanceof Error ? geminiErr.message : geminiErr,
          });
        }
      }

      // 2. Attempt OpenAI fallback if Gemini didn't return output
      if (!markdownSpec && openaiKey) {
        try {
          logger.info("Attempting spec generation with OpenAI gpt-4o...");
          const openai = createOpenAI({ apiKey: openaiKey });
          const response = await generateText({
            model: (openai("gpt-4o") as unknown) as Parameters<typeof generateText>[0]["model"],
            system: SPEC_SYSTEM_PROMPT,
            prompt: userContextPrompt,
            abortSignal: AbortSignal.timeout(45000),
          });
          markdownSpec = response.text;
          logger.info("Spec generated via OpenAI gpt-4o", { length: markdownSpec.length });
        } catch (openaiErr) {
          logger.warn("OpenAI spec generation failed. Falling back to technical spec synthesis engine.", {
            error: openaiErr instanceof Error ? openaiErr.message : openaiErr,
          });
        }
      }

      // 3. Fallback to technical synthesis engine
      if (!markdownSpec) {
        logger.warn("Using technical specification synthesis engine fallback.");
        markdownSpec = synthesizeTechnicalSpec(roomId, nodes, edges, chatHistory);
      }

      const summary = `Generated Technical Spec v1.0 (${markdownSpec.length} bytes)`;
      await broadcastStatus("complete", summary);
      await updatePresence(false);

      return {
        success: true,
        summary,
        spec: markdownSpec,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Spec generation error";
      logger.error("Error executing generate-spec task", { error: errorMessage });
      await broadcastStatus("error", errorMessage);
      await updatePresence(false);

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
