import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || typeof body.detail !== "string") {
    return NextResponse.json({ error: "内容不完整。" }, { status: 400 });
  }

  try {
    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        title: body.title.trim(),
        detail: body.detail.trim(),
        meta: typeof body.meta === "string" ? body.meta.trim() || null : null,
        status: typeof body.status === "string" ? body.status.trim() || null : null,
        order: typeof body.order === "number" ? body.order : undefined,
        active: typeof body.active === "boolean" ? body.active : undefined,
      },
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "未找到该内容。" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await context.params;

  try {
    await prisma.contentItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "未找到该内容。" }, { status: 404 });
  }
}
