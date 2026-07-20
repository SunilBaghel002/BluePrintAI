import { NextResponse } from "next/server";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkProjectAccess } from "@/lib/project-access";
import {
  addProjectCollaborator,
  getProjectCollaborators,
} from "@/lib/db/projects";

const inviteSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

interface RouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;
    const { hasAccess, isOwner, project } = await checkProjectAccess(projectId);

    if (!hasAccess || !project) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const dbCollaborators = await getProjectCollaborators(projectId);

    const clerk = await clerkClient();


    let ownerUser: User | null = null;
    try {
      ownerUser = await clerk.users.getUser(project.ownerId);
    } catch (err) {
      console.error("Owner lookup error:", err);
    }

    const ownerEmail = ownerUser?.emailAddresses?.[0]?.emailAddress ?? "";
    const ownerName = ownerUser
      ? `${ownerUser.firstName ?? ""} ${ownerUser.lastName ?? ""}`.trim() || ownerUser.username
      : null;
    const ownerAvatar = ownerUser?.imageUrl ?? null;

    const owner = {
      id: project.ownerId,
      email: ownerEmail,
      name: ownerName,
      avatarUrl: ownerAvatar,
    };

    const emails = dbCollaborators.map((c) => c.email);

    let clerkUsers: User[] = [];
    if (emails.length > 0) {
      try {
        const res = await clerk.users.getUserList({ emailAddress: emails });
        clerkUsers = res.data;
      } catch (err) {
        console.error("Clerk user lookup error:", err);
      }
    }

    const collaborators = dbCollaborators.map((c) => {
      const match = clerkUsers.find((u: User) =>
        u.emailAddresses?.some(
          (e) => e.emailAddress.toLowerCase() === c.email.toLowerCase()
        )
      );

      const fullName = match
        ? `${match.firstName ?? ""} ${match.lastName ?? ""}`.trim()
        : null;

      return {
        id: c.id,
        email: c.email,
        createdAt: c.createdAt,
        name: fullName || match?.username || null,
        avatarUrl: match?.imageUrl || null,
      };
    });

    return NextResponse.json({ data: { owner, collaborators }, isOwner });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;
    const { isOwner } = await checkProjectAccess(projectId);

    if (!isOwner) {
      return NextResponse.json(
        { error: "Only project owners can invite collaborators" },
        { status: 403 }
      );
    }

    let json: unknown = {};
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = inviteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    try {
      const collaborator = await addProjectCollaborator(projectId, email);
      return NextResponse.json({ data: collaborator }, { status: 201 });
    } catch {
      return NextResponse.json(
        { error: "Collaborator already invited or duplicate request" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
