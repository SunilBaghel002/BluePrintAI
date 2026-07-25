import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { tasks, auth as triggerAuth } from "@trigger.dev/sdk/v3";
import { checkProjectAccess } from "@/lib/project-access";
import { createTaskRun } from "@/lib/db/task-runs";

const specRequestSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        sender: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  nodes: z.array(z.record(z.string(), z.unknown())).optional().default([]),
  edges: z.array(z.record(z.string(), z.unknown())).optional().default([]),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = specRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { roomId, chatHistory, nodes, edges } = validation.data;

    // Resolve project access strictly from authenticated user + roomId
    const access = await checkProjectAccess(roomId);
    if (!access.hasAccess || !access.project) {
      return NextResponse.json(
        { error: "Forbidden: No access to this project" },
        { status: 403 }
      );
    }

    const targetProjectId = access.project.id;

    // Trigger generate-spec background task
    const handle = await tasks.trigger("generate-spec", {
      roomId,
      projectId: targetProjectId,
      chatHistory,
      nodes,
      edges,
    });

    // Save TaskRun for ownership and authorization
    await createTaskRun({
      runId: handle.id,
      projectId: targetProjectId,
      userId,
    });

    // Issue scoped Trigger.dev public access token
    let publicToken: string | undefined;
    try {
      publicToken = await triggerAuth.createPublicToken({
        scopes: {
          read: {
            runs: [handle.id],
          },
        },
        expirationTime: "1h",
      });
    } catch (tokenErr) {
      console.warn("Could not generate public token for spec run:", tokenErr);
    }

    return NextResponse.json({ runId: handle.id, publicToken });
  } catch (error) {
    console.error("Error triggering spec generation task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
