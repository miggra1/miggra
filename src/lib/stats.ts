import { prisma } from "@/lib/prisma";

export async function getStats() {
  const [totalNotes, publishedNotes, draftNotes, tags, pinnedNotes, latestNote] = await Promise.all([
    prisma.note.count(),
    prisma.note.count({ where: { status: "PUBLISHED" } }),
    prisma.note.count({ where: { status: "DRAFT" } }),
    prisma.note.findMany({ distinct: ["tag"], select: { tag: true } }),
    prisma.note.count({ where: { pinned: true } }),
    prisma.note.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  return {
    totalNotes,
    publishedNotes,
    draftNotes,
    tagCount: tags.length,
    pinnedNotes,
    latestNoteAt: latestNote?.createdAt ?? null,
  };
}
