import { prisma } from "@/lib/prisma";

export async function getHomepageModules() {
  return prisma.homepageModule.findMany({
    where: { enabled: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getHomepageModulesSafe() {
  try {
    const modules = await getHomepageModules();
    return { modules, dbError: false as const };
  } catch {
    return { modules: [] as Awaited<ReturnType<typeof getHomepageModules>>, dbError: true as const };
  }
}

export async function ensureDefaultHomepageModules() {
  const count = await prisma.homepageModule.count();
  if (count > 0) return;

  await prisma.homepageModule.createMany({
    data: [
      { key: "now", title: "Now", enabled: true, order: 1 },
      { key: "wish", title: "愿望清单", enabled: true, order: 2 },
      { key: "reading", title: "书单", enabled: true, order: 3 },
      { key: "inspirations", title: "灵感墙", enabled: true, order: 4 },
      { key: "timeline", title: "时间线", enabled: true, order: 5 },
      { key: "guestbook", title: "公开留言板", enabled: true, order: 6 },
    ],
  });
}
