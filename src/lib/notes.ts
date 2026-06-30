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
  coverImage?: string | null;
  scheduledAt?: string | null;
};

export async function listNotes() {
  return withDbTimeout(
    prisma.note.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
  );
}

export async function listPublishedNotes() {
  return withDbTimeout(
    prisma.note.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
  );
}

export async function listRecentEditableNotes() {
  return withDbTimeout(
    prisma.note.findMany({
      orderBy: [{ updatedAt: "desc" }],
      take: 12,
    }),
  );
}

export async function listScheduledNotes() {
  return withDbTimeout(
    prisma.note.findMany({
      where: { status: "SCHEDULED" },
      orderBy: [{ scheduledAt: "asc" }, { updatedAt: "desc" }],
      take: 6,
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
      coverImage: input.coverImage?.trim() || null,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
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
        coverImage: input.coverImage?.trim() ?? null,
        scheduledAt: input.scheduledAt !== undefined
          ? (input.scheduledAt ? new Date(input.scheduledAt) : null)
          : undefined,
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

/** 查询往年今日发布的笔记 */
export async function getOnThisDayNotes() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  try {
    // 获取非今年的已发布笔记，在应用层过滤月份和日期
    const all = await prisma.note.findMany({
      where: {
        status: "PUBLISHED",
        createdAt: { lt: new Date(now.getFullYear(), 0, 1) },
      },
      select: { id: true, title: true, text: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return all.filter((n) => {
      const d = new Date(n.createdAt);
      return d.getMonth() + 1 === month && d.getDate() === day;
    });
  } catch {
    return [];
  }
}

/** 将到期的定时发布笔记转为已发布，返回更新的数量 */
export async function transitionScheduledNotes() {
  const result = await prisma.note.updateMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: new Date() },
    },
    data: {
      status: "PUBLISHED",
    },
  });
  return result.count;
}
