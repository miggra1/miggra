import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.targetId !== "string") {
    return NextResponse.json({ error: "参数不正确。" }, { status: 400 });
  }

  const [current, target] = await Promise.all([
    prisma.timelineMilestone.findUnique({ where: { id: body.id } }),
    prisma.timelineMilestone.findUnique({ where: { id: body.targetId } }),
  ]);

  if (!current || !target || current.kind !== target.kind) {
    return NextResponse.json({ error: "无法调整顺序。" }, { status: 400 });
  }

  await Promise.all([
    prisma.timelineMilestone.update({ where: { id: current.id }, data: { order: target.order } }),
    prisma.timelineMilestone.update({ where: { id: target.id }, data: { order: current.order } }),
  ]);

  return NextResponse.json({ ok: true });
}
