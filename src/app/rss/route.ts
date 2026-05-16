import { NextResponse } from "next/server";
import { listNotes } from "@/lib/notes";

export const runtime = "nodejs";

export async function GET() {
  const notes = await listNotes();
  const published = notes.filter((note) => note.status === "PUBLISHED").slice(0, 20);

  const items = published
    .map(
      (note) => `
        <item>
          <title><![CDATA[${note.title}]]></title>
          <link>${process.env.SITE_URL ?? "http://localhost:3000"}/notes/${note.id}</link>
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
        <link>${process.env.SITE_URL ?? "http://localhost:3000"}</link>
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
