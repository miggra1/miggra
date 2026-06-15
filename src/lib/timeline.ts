import { prisma } from "@/lib/prisma";

export async function listTimelineMilestones() {
  return prisma.timelineMilestone.findMany({
    where: { active: true },
    orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function listTimelineMilestonesSafe() {
  try {
    const milestones = await listTimelineMilestones();
    return { milestones, dbError: false as const };
  } catch {
    return { milestones: [] as Awaited<ReturnType<typeof listTimelineMilestones>>, dbError: true as const };
  }
}
