import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.status !== "string") {
    return NextResponse.json({ error: "状态不正确。" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.update({
    where: { id },
    data: { status: body.status === "PUBLISHED" ? "PUBLISHED" : body.status === "HIDDEN" ? "HIDDEN" : "PENDING" },
  });

  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.guestbookEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
