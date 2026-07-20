import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { removeProjectCollaborator } from "@/lib/db/projects";

interface RouteContext {
  params: Promise<{
    projectId: string;
    collaboratorId: string;
  }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, collaboratorId } = await context.params;
    const { isOwner } = await checkProjectAccess(projectId);

    if (!isOwner) {
      return NextResponse.json(
        { error: "Only project owners can remove collaborators" },
        { status: 403 }
      );
    }

    await removeProjectCollaborator(projectId, collaboratorId);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error && error.message === "Collaborator not found") {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

