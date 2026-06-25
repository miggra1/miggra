import { NextResponse } from "next/server";
import { createNote, listNotesSafe } from "@/lib/notes";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { notes } = await listNotesSafe();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || typeof body.text !== "string") {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  const title = body.title.trim();
  const text = body.text.trim();
  const tag = typeof body.tag === "string" ? body.tag : undefined;
  const pinned = Boolean(body.pinned);
  const status: "DRAFT" | "PUBLISHED" | "SCHEDULED" = body.status === "DRAFT" ? "DRAFT" : body.status === "SCHEDULED" ? "SCHEDULED" : "PUBLISHED";
  const coverImage = typeof body.coverImage === "string" ? body.coverImage : undefined;
  const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : undefined;

  if (!title || !text) {
    return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
  }

  // 定时发布必须指定时间
  if (status === "SCHEDULED" && !scheduledAt) {
    return NextResponse.json({ error: "定时发布需要指定发布时间。" }, { status: 400 });
  }

  const note = await createNote({ title, text, tag, pinned, status, coverImage, scheduledAt });
  return NextResponse.json({ note }, { status: 201 });
}
