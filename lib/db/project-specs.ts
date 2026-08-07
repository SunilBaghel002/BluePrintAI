import { prisma } from "@/lib/prisma";

export async function createProjectSpec(projectId: string, filePath: string) {
  return prisma.projectSpec.create({
    data: {
      projectId,
      filePath,
    },
  });
}

export async function getProjectSpecById(id: string, projectId: string) {
  return prisma.projectSpec.findFirst({
    where: {
      id,
      projectId,
    },
  });
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export async function getProjectSpecsByProjectId(
  projectId: string,
  options?: PaginationOptions
) {
  const take = options?.limit ? Math.min(Math.max(options.limit, 1), 100) : 50;
  const skip = options?.offset ? Math.max(options.offset, 0) : undefined;

  return prisma.projectSpec.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
}
