import { withDbTimeout } from "@/lib/db-timeout";
import { prisma } from "@/lib/prisma";
import { computeStatsFromNotes, emptyStats } from "@/lib/stats";
import type { Note as PrismaNote, NoteStatus } from "@prisma/client";

export type Note = PrismaNote;

export type NoteInput = {
  title: string;
  text: string;
  tag?: string;
  status?: NoteStatus;
  pinned?: boolean;
};

export async function listNotes() {
  return withDbTimeout(
    prisma.note.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
  );
}

export async function listNotesSafe() {
  try {
    const notes = await listNotes();
    return { notes, dbError: false as const };
  } catch {
    return { notes: [] as Note[], dbError: true as const };
  }
}

export async function getHomePageData() {
  try {
    const notes = await listNotes();
    return { notes, stats: computeStatsFromNotes(notes), dbError: false as const };
  } catch {
    return { notes: [] as Note[], stats: emptyStats, dbError: true as const };
  }
}

export async function getPublishedNote(id: string) {
  return withDbTimeout(
    prisma.note.findFirst({
      where: { id, status: "PUBLISHED" },
    }),
  );
}

export async function getPublishedNoteSafe(id: string) {
  try {
    const note = await getPublishedNote(id);
    return { note, dbError: false as const };
  } catch {
    return { note: null, dbError: true as const };
  }
}

export async function createNote(input: NoteInput) {
  return prisma.note.create({
    data: {
      title: input.title.trim(),
      text: input.text.trim(),
      tag: input.tag?.trim() || "随想",
      status: input.status ?? "PUBLISHED",
      pinned: input.pinned ?? false,
    },
  });
}

export async function updateNote(id: string, input: NoteInput) {
  try {
    return await prisma.note.update({
      where: { id },
      data: {
        title: input.title.trim(),
        text: input.text.trim(),
        tag: input.tag?.trim() || "随想",
        status: input.status,
        pinned: input.pinned,
      },
    });
  } catch {
    return null;
  }
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
