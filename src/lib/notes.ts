import { prisma } from "@/lib/prisma";
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
  return prisma.note.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
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
