import { prisma } from "@/lib/prisma";

export async function createProjectSpec(projectId: string, filePath: string) {
  return prisma.projectSpec.create({
    data: {
      projectId,
      filePath,
    },
  });
}

export async function getProjectSpecById(id: string) {
  return prisma.projectSpec.findUnique({
    where: { id },
  });
}

export async function getProjectSpecsByProjectId(projectId: string) {
  return prisma.projectSpec.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}
