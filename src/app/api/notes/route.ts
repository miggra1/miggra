import { NextResponse } from "next/server";
import { createNote, listNotes } from "@/lib/notes";

export const runtime = "nodejs";

export async function GET() {
  const notes = await listNotes();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || typeof body.text !== "string") {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  const title = body.title.trim();
  const text = body.text.trim();
  const tag = typeof body.tag === "string" ? body.tag : undefined;

  if (!title || !text) {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  const note = await createNote({ title, text, tag });
  return NextResponse.json({ note }, { status: 201 });
}
