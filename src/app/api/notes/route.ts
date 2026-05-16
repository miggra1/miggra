import { NextResponse } from "next/server";
import { createNote, listNotes } from "@/lib/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let notes = [];

  try {
    notes = await listNotes();
  } catch {
    notes = [];
  }

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
  const pinned = Boolean(body.pinned);
  const status = body.status === "DRAFT" ? "DRAFT" : "PUBLISHED";

  if (!title || !text) {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  const note = await createNote({ title, text, tag, pinned, status });
  return NextResponse.json({ note }, { status: 201 });
}
