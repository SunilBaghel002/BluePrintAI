import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectSpecsByProjectId } from "@/lib/db/project-specs";
import { specRouteParamsSchema } from "@/lib/validations/spec-params";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  // 1. Validate route params before auth, access check, or DB work
  const rawParams = await params;
  const paramValidation = specRouteParamsSchema.safeParse(rawParams);
  if (!paramValidation.success) {
    return NextResponse.json(
      { error: "Invalid route parameters", details: paramValidation.error.flatten() },
      { status: 400 }
    );
  }
  const { projectId } = paramValidation.data;

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

  try {
    // 4. Fetch specs from database
    const rawSpecs = await getProjectSpecsByProjectId(projectId);

    // 5. Project each spec to exclude filePath
    const specs = rawSpecs.map((spec) => ({
      id: spec.id,
      createdAt: spec.createdAt.toISOString(),
    }));

    return NextResponse.json({ specs });
  } catch (error) {
    console.error("Error fetching project specs:", error);
    return NextResponse.json({ error: "Failed to fetch project specs" }, { status: 500 });
  }
}
