import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const entries = await prisma.guestbookEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "参数不正确。" }, { status: 400 });
  }

  const data: { status?: "PENDING" | "PUBLISHED" | "HIDDEN"; reply?: string | null; repliedAt?: Date | null } = {};

  if (typeof body.status === "string") {
    const allowed = new Set(["PENDING", "PUBLISHED", "HIDDEN"]);
    if (!allowed.has(body.status)) {
      return NextResponse.json({ error: "状态不合法。" }, { status: 400 });
    }
    data.status = body.status as "PENDING" | "PUBLISHED" | "HIDDEN";
  }

  if (typeof body.reply === "string") {
    const reply = body.reply.trim();
    data.reply = reply || null;
    data.repliedAt = reply ? new Date() : null;
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "没有可更新的内容。" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.update({
    where: { id: body.id },
    data,
  });

  return NextResponse.json({ entry });
}
