import { NextResponse } from "next/server";
import { listPages, createPage } from "@/lib/pages";
import { isAdminAuthenticated } from "@/lib/auth";
import { isSlugReserved } from "@/lib/pages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pages = await listPages();
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);

  if (!body || typeof body.slug !== "string" || typeof body.title !== "string" || typeof body.content !== "string") {
    return NextResponse.json({ error: "slug、标题和内容不能为空。" }, { status: 400 });
  }

  const slug = body.slug.trim();
  const title = body.title.trim();
  const content = body.content.trim();

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "slug、标题和内容不能为空。" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "slug 只能包含小写字母、数字和连字符。" }, { status: 400 });
  }

  if (isSlugReserved(slug)) {
    return NextResponse.json({ error: "这个 slug 已被系统保留，请换一个。" }, { status: 400 });
  }

  const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  try {
    const page = await createPage({ slug, title, content, status });
    return NextResponse.json({ page }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "slug 已存在，请换一个。" }, { status: 409 });
  }
}
