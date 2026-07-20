import { prisma } from "@/lib/prisma";

export async function getProjectsByOwner(ownerId: string) {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
  });
}

export async function createProject(data: {
  ownerId: string;
  name?: string;
  description?: string;
}) {
  return prisma.project.create({
    data: {
      ownerId: data.ownerId,
      name: data.name && data.name.trim() ? data.name.trim() : "Untitled Project",
      description: data.description?.trim(),
    },
  });
}

export async function updateProject(
  id: string,
  data: { name?: string; description?: string }
) {
  const updateData: { name?: string; description?: string } = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim() || "Untitled Project";
  }
  if (data.description !== undefined) {
    updateData.description = data.description.trim();
  }

  return prisma.project.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

export async function getProjectsSharedWithUser(email: string) {
  if (!email) return [];
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { email },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
  return collaborators.map((c) => c.project);
}

export async function getProjectCollaborators(projectId: string) {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
}

export async function addProjectCollaborator(projectId: string, email: string) {
  const cleanEmail = email.toLowerCase().trim();
  return prisma.projectCollaborator.create({
    data: {
      projectId,
      email: cleanEmail,
    },
  });
}

export async function removeProjectCollaborator(
  projectId: string,
  collaboratorId: string
) {
  const result = await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  if (result.count === 0) {
    throw new Error("Collaborator not found");
  }

  return result;
}



