import { prisma } from "@/lib/prisma";

export async function listTimelineMilestones() {
  return prisma.timelineMilestone.findMany({
    where: { active: true },
    orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}
