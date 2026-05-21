import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.year !== "string" || typeof body.kind !== "string" || typeof body.title !== "string" || typeof body.detail !== "string") {
    return NextResponse.json({ error: "参数不正确。" }, { status: 400 });
  }

  const item = await prisma.timelineMilestone.update({
    where: { id },
    data: {
      year: body.year.trim() || "2026",
      kind: body.kind === "SITE" ? "SITE" : "PERSONAL",
      title: body.title.trim(),
      detail: body.detail.trim(),
      order: typeof body.order === "number" ? body.order : 0,
      active: typeof body.active === "boolean" ? body.active : true,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.timelineMilestone.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
