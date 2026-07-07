import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json({ results: [] });

  try {
    const [notes, contentItems, pages, guestbookEntries] = await Promise.all([
      prisma.note.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q } },
            { text: { contains: q } },
            { tag: { contains: q } },
          ],
        },
        select: { id: true, title: true, text: true, tag: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.contentItem.findMany({
        where: {
          active: true,
          OR: [
            { title: { contains: q } },
            { detail: { contains: q } },
          ],
        },
        select: { id: true, title: true, detail: true, section: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.page.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        select: { id: true, title: true, slug: true, content: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.guestbookEntry.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { name: { contains: q } },
            { message: { contains: q } },
          ],
        },
        select: { id: true, name: true, message: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const sectionLabels: Record<string, string> = {
      NOW: "Now",
      WISH: "愿望清单",
      READING: "书单",
      INSPIRATION: "灵感",
      TIMELINE: "时间线",
    };

    const results = [
      ...notes.map((n) => ({
        type: "note" as const,
        id: n.id,
        title: n.title,
        snippet: n.text.length > 140 ? n.text.slice(0, 140) + "\u2026" : n.text,
        tag: n.tag,
        createdAt: n.createdAt,
      })),
      ...contentItems.map((c) => ({
        type: "content" as const,
        id: c.id,
        title: c.title,
        snippet: c.detail.length > 140 ? c.detail.slice(0, 140) + "\u2026" : c.detail,
        section: c.section,
        sectionLabel: sectionLabels[c.section] ?? c.section,
        createdAt: c.createdAt,
      })),
      ...pages.map((p) => ({
        type: "page" as const,
        id: p.id,
        title: p.title,
        snippet: p.content.length > 140 ? p.content.slice(0, 140) + "\u2026" : p.content,
        slug: p.slug,
        createdAt: p.createdAt,
      })),
      ...guestbookEntries.map((g) => ({
        type: "guestbook" as const,
        id: g.id,
        title: g.name,
        snippet: g.message.length > 140 ? g.message.slice(0, 140) + "\u2026" : g.message,
        createdAt: g.createdAt,
      })),
    ];

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: true });
  }
}
