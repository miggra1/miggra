import { NextResponse } from "next/server";
import { listNotes } from "@/lib/notes";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const [notes, contentItems, pages, photos, guestbookEntries, timelineMilestones, homepageModules] = await Promise.all([
    listNotes(),
    prisma.contentItem.findMany(),
    prisma.page.findMany(),
    prisma.photo.findMany(),
    prisma.guestbookEntry.findMany(),
    prisma.timelineMilestone.findMany(),
    prisma.homepageModule.findMany(),
  ]);

  const publishedNotes = notes.filter((note) => note.status === "PUBLISHED");

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      notes: publishedNotes,
      contentItems,
      pages,
      photos,
      guestbookEntries,
      timelineMilestones,
      homepageModules,
    },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="miggra-export.json"',
      },
    },
  );
}
