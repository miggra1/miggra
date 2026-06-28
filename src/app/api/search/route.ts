import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json({ results: [] });

  try {
    const notes = await prisma.note.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q } },
          { text: { contains: q } },
        ],
      },
      select: { id: true, title: true, text: true, tag: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const results = notes.map((n) => ({
      id: n.id,
      title: n.title,
      snippet: n.text.length > 140 ? n.text.slice(0, 140) + "…" : n.text,
      tag: n.tag,
      createdAt: n.createdAt,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: true });
  }
}
