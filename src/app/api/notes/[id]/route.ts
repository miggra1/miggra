import { NextResponse } from "next/server";
import { deleteNote, updateNote } from "@/lib/notes";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ error: "内容不能为空。" }, { status: 400 });
  }

  const autosave = body.autosave === true;
  const status: "DRAFT" | "PUBLISHED" | "SCHEDULED" = body.status === "DRAFT" ? "DRAFT" : body.status === "SCHEDULED" ? "SCHEDULED" : "PUBLISHED";
  const title = typeof body.title === "string" && body.title.trim() ? body.title : "未命名草稿";
  const text = body.text.trim();

  if (!autosave && (!title.trim() || !text)) {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  if (autosave && !text) {
    return NextResponse.json({ error: "空内容不会保存到服务端草稿。" }, { status: 400 });
  }

  if (status !== "DRAFT" && !text) {
    return NextResponse.json({ error: "发布内容不能为空。" }, { status: 400 });
  }

  if (status === "SCHEDULED" && typeof body.scheduledAt !== "string") {
    return NextResponse.json({ error: "定时发布需要指定发布时间。" }, { status: 400 });
  }

  const note = await updateNote(id, {
    title,
    text,
    tag: typeof body.tag === "string" ? body.tag : undefined,
    status,
    pinned: Boolean(body.pinned),
    coverImage: typeof body.coverImage === "string" ? body.coverImage : undefined,
    scheduledAt: typeof body.scheduledAt === "string" ? body.scheduledAt : undefined,
  });

  if (!note) {
    return NextResponse.json({ error: "未找到这条碎碎念。" }, { status: 404 });
  }

  return NextResponse.json({ note });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;
  const removed = await deleteNote(id);

  if (!removed) {
    return NextResponse.json({ error: "未找到这条碎碎念。" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
