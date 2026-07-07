import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.status !== "string") {
    return NextResponse.json({ error: "状态不正确。" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.update({
    where: { id },
    data: { status: body.status === "PUBLISHED" ? "PUBLISHED" : body.status === "HIDDEN" ? "HIDDEN" : "PENDING" },
  }).catch(() => null);

  if (!entry) {
    return NextResponse.json({ error: "留言不存在。" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.guestbookEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "留言不存在或已被删除。" }, { status: 404 });
  }
}
