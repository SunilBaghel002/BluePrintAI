import { prisma } from "@/lib/prisma";

export async function createTaskRun(data: {
  runId: string;
  projectId: string;
  userId: string;
}) {
  return prisma.taskRun.create({
    data: {
      runId: data.runId,
      projectId: data.projectId,
      userId: data.userId,
    },
  });
}

export async function getTaskRunByRunId(runId: string) {
  return prisma.taskRun.findUnique({
    where: { runId },
  });
}
