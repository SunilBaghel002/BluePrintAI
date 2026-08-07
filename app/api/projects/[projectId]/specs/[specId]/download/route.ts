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

  // 3. Verify spec existence and project ownership
  const spec = await getProjectSpecById(specId);
  if (!spec) {
    return NextResponse.json({ error: "Spec not found" }, { status: 404 });
  }

  if (spec.projectId !== projectId && spec.projectId !== access.project.id) {
    return NextResponse.json({ error: "Forbidden: Spec does not belong to this project" }, { status: 403 });
  }

  // 4. Fetch content from Vercel Blob
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
      return NextResponse.json({ error: "Failed to retrieve spec file content" }, { status: 500 });
    }

    const fileContent = await blobResponse.text();
    const filename = `spec-${projectId}-${specId}.md`;

    // 5. Return as a downloadable Markdown attachment
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error retrieving spec download:", error);
    return NextResponse.json(
      { error: "Internal server error retrieving spec file" },
      { status: 500 }
    );
  }
}
