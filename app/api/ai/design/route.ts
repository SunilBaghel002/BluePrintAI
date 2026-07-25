import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { tasks } from "@trigger.dev/sdk/v3";
import { checkProjectAccess } from "@/lib/project-access";
import { createTaskRun } from "@/lib/db/task-runs";

const designRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  roomId: z.string().min(1, "Room ID is required"),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = designRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, roomId, projectId } = validation.data;
    const targetProjectId = projectId || roomId;

    const access = await checkProjectAccess(roomId);
    if (!access.hasAccess) {
      return NextResponse.json(
        { error: "Forbidden: No access to this project" },
        { status: 403 }
      );
    }

    const handle = await tasks.trigger("design-agent", {
      prompt,
      roomId,
      projectId: targetProjectId,
    });

    await createTaskRun({
      runId: handle.id,
      projectId: targetProjectId,
      userId,
    });

    return NextResponse.json({ runId: handle.id });
  } catch (error: any) {
    console.error("Error triggering design task:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
