import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectSpecsByProjectId } from "@/lib/db/project-specs";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { projectId } = await params;

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

  try {
    // 3. Fetch specs from database
    const specs = await getProjectSpecsByProjectId(projectId);
    return NextResponse.json({ specs });
  } catch (error) {
    console.error("Error fetching project specs:", error);
    return NextResponse.json({ error: "Failed to fetch project specs" }, { status: 500 });
  }
}
