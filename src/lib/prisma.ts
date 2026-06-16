import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL!;
  // TiDB Cloud Serverless 强制要求 TLS 加密传输
  if (raw.includes("tidbcloud.com") && !raw.includes("sslaccept")) {
    const sep = raw.includes("?") ? "&" : "?";
    return `${raw}${sep}sslaccept=strict`;
  }
  return raw;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
