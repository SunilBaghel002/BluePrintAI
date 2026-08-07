import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = (): PrismaClient => {
  const dbUrl = process.env.DATABASE_URL ?? "";

  if (dbUrl.startsWith("prisma+postgres://") || dbUrl.startsWith("prisma://")) {
    return new PrismaClient({
      accelerateUrl: dbUrl,
    });
  }

  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const getPrismaInstance = (): PrismaClient => {
  const cached = globalForPrisma.prisma;
  if (cached) {
    if ("projectSpec" in cached) {
      return cached;
    }
    // Drop cached Prisma clients generated before ProjectSpec model was added
    (cached as unknown as { $disconnect?: () => Promise<void> }).$disconnect?.().catch(() => {});
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
};

export const prisma = getPrismaInstance();
