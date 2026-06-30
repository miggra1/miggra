import { prisma } from "@/lib/prisma";

export type ContentSection = "NOW" | "WISH" | "READING" | "INSPIRATION" | "TIMELINE";

export type ContentItemInput = {
  section: ContentSection;
  title: string;
  detail: string;
  meta?: string;
  status?: string;
  order?: number;
  active?: boolean;
};

export const contentSectionTitles: Record<ContentSection, string> = {
  NOW: "Now",
  WISH: "愿望清单",
  READING: "书单",
  INSPIRATION: "灵感",
  TIMELINE: "时间线",
};

export async function listContentItems(section: ContentSection) {
  return prisma.contentItem.findMany({
    where: { section, active: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function listContentItemsForAdmin(section: ContentSection) {
  return prisma.contentItem.findMany({
    where: { section },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
}

export async function listContentItemsSafe(section: ContentSection) {
  try {
    const items = await listContentItems(section);
    return { items, dbError: false as const };
  } catch {
    return { items: [] as Awaited<ReturnType<typeof listContentItems>>, dbError: true as const };
  }
}

export async function listAllContentItems() {
  return prisma.contentItem.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getContentSectionCount() {
  const items = await listAllContentItems();
  return items.reduce<Record<ContentSection, number>>(
    (acc, item) => {
      acc[item.section] += 1;
      return acc;
    },
    { NOW: 0, WISH: 0, READING: 0, INSPIRATION: 0, TIMELINE: 0 },
  );
}

export async function createContentItem(input: ContentItemInput) {
  return prisma.contentItem.create({
    data: {
      section: input.section,
      title: input.title.trim(),
      detail: input.detail.trim(),
      meta: input.meta?.trim() || null,
      status: input.status?.trim() || null,
      order: input.order ?? 0,
      active: input.active ?? true,
    },
  });
}
