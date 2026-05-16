import { NextResponse } from "next/server";
import { deleteNote, updateNote } from "@/lib/notes";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || typeof body.text !== "string") {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  const note = await updateNote(id, {
    title: body.title,
    text: body.text,
    tag: typeof body.tag === "string" ? body.tag : undefined,
    status: typeof body.status === "string" ? body.status : undefined,
  });

  if (!note) {
    return NextResponse.json({ error: "未找到这条碎碎念。" }, { status: 404 });
  }

  return NextResponse.json({ note });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const removed = await deleteNote(id);

  if (!removed) {
    return NextResponse.json({ error: "未找到这条碎碎念。" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
