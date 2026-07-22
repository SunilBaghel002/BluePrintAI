import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { put } from "@vercel/blob";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectById, updateProjectCanvasBlob } from "@/lib/db/projects";

const canvasDataSchema = z.object({
  nodes: z.array(z.record(z.string(), z.any())).default([]),
  edges: z.array(z.record(z.string(), z.any())).default([]),
});

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { projectId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await checkProjectAccess(projectId);
  if (!access.hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let bodyJson: unknown;
  try {
    bodyJson = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = canvasDataSchema.safeParse(bodyJson);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid canvas payload format", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { nodes, edges } = parseResult.data;

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error("BLOB_READ_WRITE_TOKEN is missing in environment variables");
      return NextResponse.json(
        { error: "Blob storage configuration error: BLOB_READ_WRITE_TOKEN missing" },
        { status: 500 }
      );
    }

    const payload = JSON.stringify({
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    });

    const blob = await put(`canvas/${projectId}.json`, payload, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: token,
    });

    await updateProjectCanvasBlob(projectId, blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Vercel Blob canvas save error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save canvas blob";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { projectId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await checkProjectAccess(projectId);
  if (!access.hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const project = await getProjectById(projectId);
    if (!project || !project.canvasJsonPath) {
      return NextResponse.json({ canvas: null });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const fetchHeaders: Record<string, string> = {};
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(project.canvasJsonPath, {
      headers: fetchHeaders,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch canvas blob from URL: ${project.canvasJsonPath}, status: ${response.status}`
      );
      return NextResponse.json({ canvas: null });
    }

    const canvasData = await response.json();
    return NextResponse.json({ canvas: canvasData });
  } catch (error) {
    console.error("Canvas load error:", error);
    return NextResponse.json({ canvas: null });
  }
}
