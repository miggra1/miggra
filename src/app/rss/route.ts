import { NextResponse } from "next/server";
import { listNotes } from "@/lib/notes";
import type { Note } from "@/lib/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let notes: Note[] = [];

  try {
    notes = await listNotes();
  } catch {
    notes = [];
  }

  const published = notes.filter((note) => note.status === "PUBLISHED").slice(0, 20);
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const items = published
    .map(
      (note) => `<item>
  <title><![CDATA[${note.title}]]></title>
  <link>${baseUrl}/notes/${note.id}</link>
  <guid>${note.id}</guid>
  <pubDate>${new Date(note.createdAt).toUTCString()}</pubDate>
  <description><![CDATA[${note.text}]]></description>
</item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Miggra Journal</title>
    <link>${baseUrl}</link>
    <description>个人碎碎念订阅源</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
