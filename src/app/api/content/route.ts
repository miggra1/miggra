import { NextResponse } from "next/server";
import { createContentItem, listContentItems, type ContentSection } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sections = new Set<ContentSection>(["NOW", "WISH", "READING", "INSPIRATION", "TIMELINE"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const section = url.searchParams.get("section") as ContentSection | null;

  if (!section || !sections.has(section)) {
    return NextResponse.json({ error: "请提供有效的 section。" }, { status: 400 });
  }

  const items = await listContentItems(section);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.section !== "string" || typeof body.title !== "string" || typeof body.detail !== "string") {
    return NextResponse.json({ error: "内容不完整。" }, { status: 400 });
  }

  if (!sections.has(body.section)) {
    return NextResponse.json({ error: "无效的 section。" }, { status: 400 });
  }

  const item = await createContentItem({
    section: body.section,
    title: body.title,
    detail: body.detail,
    meta: typeof body.meta === "string" ? body.meta : undefined,
    status: typeof body.status === "string" ? body.status : undefined,
    order: typeof body.order === "number" ? body.order : undefined,
    active: typeof body.active === "boolean" ? body.active : undefined,
  });

  return NextResponse.json({ item }, { status: 201 });
}
