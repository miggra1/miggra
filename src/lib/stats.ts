import type { Note } from "@/lib/notes";
import { prisma } from "@/lib/prisma";

export type SiteStats = {
  totalNotes: number;
  publishedNotes: number;
  draftNotes: number;
  tagCount: number;
  pinnedNotes: number;
  latestNoteAt: Date | null;
};

export const emptyStats: SiteStats = {
  totalNotes: 0,
  publishedNotes: 0,
  draftNotes: 0,
  tagCount: 0,
  pinnedNotes: 0,
  latestNoteAt: null,
};

export function computeStatsFromNotes(notes: Note[]): SiteStats {
  const published = notes.filter((note) => note.status === "PUBLISHED");
  const tags = new Set(published.map((note) => note.tag));
  const latestNote = notes.reduce<Note | null>(
    (latest, note) => (!latest || note.createdAt > latest.createdAt ? note : latest),
    null,
  );

  return {
    totalNotes: notes.length,
    publishedNotes: published.length,
    draftNotes: notes.filter((note) => note.status === "DRAFT").length,
    tagCount: tags.size,
    pinnedNotes: notes.filter((note) => note.pinned).length,
    latestNoteAt: latestNote?.createdAt ?? null,
  };
}

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
