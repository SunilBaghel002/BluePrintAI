import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectSpecById } from "@/lib/db/project-specs";

interface RouteParams {
  params: Promise<{
    projectId: string;
    specId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { projectId, specId } = await params;

  // 1. Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify project access
  const access = await checkProjectAccess(projectId);
  if (!access.hasAccess || !access.project) {
    return NextResponse.json({ error: "Forbidden: No access to this project" }, { status: 403 });
  }

  // 3. Retrieve ProjectSpec record
  const spec = await getProjectSpecById(specId);
  if (!spec) {
    return NextResponse.json({ error: "Spec not found" }, { status: 404 });
  }

  if (spec.projectId !== projectId && spec.projectId !== access.project.id) {
    return NextResponse.json({ error: "Forbidden: Spec does not belong to this project" }, { status: 403 });
  }

  // 4. Fetch file content from Vercel Blob
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN is missing in environment variables");
    return NextResponse.json(
      { error: "Blob storage configuration error: BLOB_READ_WRITE_TOKEN missing" },
      { status: 500 }
    );
  }

  try {
    const blobResponse = await fetch(spec.filePath, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!blobResponse.ok) {
      console.error(
        `Failed to fetch spec blob from URL: ${spec.filePath}, status: ${blobResponse.status}`
      );
      return NextResponse.json({ error: "Failed to fetch spec content from storage" }, { status: 500 });
    }

    const content = await blobResponse.text();

    return NextResponse.json({
      spec: {
        id: spec.id,
        projectId: spec.projectId,
        filePath: spec.filePath,
        createdAt: spec.createdAt.toISOString(),
        content,
      },
    });
  } catch (error) {
    console.error("Error fetching spec details:", error);
    return NextResponse.json({ error: "Failed to fetch spec details" }, { status: 500 });
  }
}
