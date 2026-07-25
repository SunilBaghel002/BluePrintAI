import { NextResponse } from "next/server";
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { z } from "zod";
import { auth as triggerAuth } from "@trigger.dev/sdk/v3";
import { getTaskRunByRunId } from "@/lib/db/task-runs";

const tokenRequestSchema = z.object({
  runId: z.string().min(1, "Run ID is required"),
});

export async function POST(req: Request) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = tokenRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { runId } = validation.data;

    const taskRun = await getTaskRunByRunId(runId);
    if (!taskRun) {
      return NextResponse.json({ error: "Task run not found" }, { status: 404 });
    }

    if (taskRun.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this task run" },
        { status: 403 }
      );
    }

    const token = await triggerAuth.createPublicToken({
      scopes: {
        read: {
          runs: [runId],
        },
      },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating public token:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
