import { prisma } from "@/lib/prisma";
import type { ContentSection } from "@/lib/content";

export type HomepageCounts = Record<ContentSection | "NOTES" | "PHOTOS" | "GUESTBOOK", number>;

export const emptyHomepageCounts: HomepageCounts = {
  NOTES: 0,
  NOW: 0,
  WISH: 0,
  READING: 0,
  INSPIRATION: 0,
  TIMELINE: 0,
  PHOTOS: 0,
  GUESTBOOK: 0,
};

export async function getHomepageCountsSafe(): Promise<HomepageCounts> {
  try {
    const [notes, contentGroups, photos, guestbook] = await Promise.all([
      prisma.note.count({ where: { status: "PUBLISHED" } }),
      prisma.contentItem.groupBy({
        by: ["section"],
        where: { active: true },
        _count: { _all: true },
      }),
      prisma.photo.count({ where: { active: true } }),
      prisma.guestbookEntry.count({ where: { status: "PUBLISHED" } }),
    ]);

    const counts = { ...emptyHomepageCounts, NOTES: notes, PHOTOS: photos, GUESTBOOK: guestbook };
    contentGroups.forEach((group) => {
      counts[group.section] = group._count._all;
    });

    return counts;
  } catch {
    return emptyHomepageCounts;
  }
}
