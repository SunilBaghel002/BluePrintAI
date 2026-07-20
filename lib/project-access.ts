import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getProjectById } from "@/lib/db/projects";

export async function getClerkIdentity() {
  const { userId } = await auth();
  if (!userId) {
    return { userId: null, email: null };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return { userId, email };
}

export async function checkProjectAccess(roomId: string) {
  const { userId, email } = await getClerkIdentity();

  if (!userId) {
    return { hasAccess: false, isOwner: false, project: null };
  }

  const project = await getProjectById(roomId);
  if (!project) {
    return { hasAccess: false, isOwner: false, project: null };
  }

  if (project.ownerId === userId) {
    return { hasAccess: true, isOwner: true, project };
  }

  if (email) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_email: {
          projectId: roomId,
          email,
        },
      },
    });

    if (collaborator) {
      return { hasAccess: true, isOwner: false, project };
    }
  }

  return { hasAccess: false, isOwner: false, project: null };
}
