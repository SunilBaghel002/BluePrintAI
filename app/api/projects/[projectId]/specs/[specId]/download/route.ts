import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectSpecById } from "@/lib/db/project-specs";
import { fetchSpecContent } from "@/lib/spec-storage";
import { specRouteParamsSchema } from "@/lib/validations/spec-params";

interface RouteParams {
  params: Promise<{
    projectId: string;
    specId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  // 1. Validate route params before auth, access check, or DB work
  const rawParams = await params;
  const paramValidation = specRouteParamsSchema.safeParse(rawParams);
  if (!paramValidation.success || !paramValidation.data.specId) {
    return NextResponse.json(
      { error: "Invalid route parameters", details: paramValidation.error?.flatten() },
      { status: 400 }
    );
  }
  const { projectId, specId } = paramValidation.data as { projectId: string; specId: string };

  // 2. Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Verify project access
  const access = await checkProjectAccess(projectId);
  if (!access.hasAccess || !access.project) {
    return NextResponse.json({ error: "Forbidden: No access to this project" }, { status: 403 });
  }

  // 4. Retrieve ProjectSpec scoped strictly to the authorized project
  const spec = await getProjectSpecById(specId, access.project.id);
  if (!spec) {
    return NextResponse.json({ error: "Spec not found" }, { status: 404 });
  }

  try {
    // 5. Fetch content via shared Vercel Blob helper
    const fileContent = await fetchSpecContent(spec.filePath);

    // 6. Construct filename using database-backed spec.projectId and spec.id
    const filename = `spec-${spec.projectId}-${spec.id}.md`;

    // 7. Return as a downloadable Markdown attachment
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
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error retrieving spec file";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
