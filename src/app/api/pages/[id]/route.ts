import { NextResponse } from "next/server";
import { updatePage, deletePage, isSlugReserved } from "@/lib/pages";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "无效的请求。" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.slug === "string" && body.slug.trim()) {
    const slug = body.slug.trim();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "slug 只能包含小写字母、数字和连字符。" }, { status: 400 });
    }
    if (isSlugReserved(slug)) {
      return NextResponse.json({ error: "这个 slug 已被系统保留，请换一个。" }, { status: 400 });
    }
    data.slug = slug;
  }
  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.content === "string" && body.content.trim()) data.content = body.content.trim();
  if (body.status === "PUBLISHED" || body.status === "DRAFT") data.status = body.status;

  try {
    const page = await updatePage(id, data as Parameters<typeof updatePage>[1]);
    if (!page) {
      return NextResponse.json({ error: "未找到该页面。" }, { status: 404 });
    }
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: "slug 已存在，请换一个。" }, { status: 409 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;
  const removed = await deletePage(id);
  if (!removed) {
    return NextResponse.json({ error: "未找到该页面。" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
