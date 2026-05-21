import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await prisma.guestbookEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.status !== "string") {
    return NextResponse.json({ error: "参数不正确。" }, { status: 400 });
  }

  const allowed = new Set(["PENDING", "PUBLISHED", "HIDDEN"]);
  if (!allowed.has(body.status)) {
    return NextResponse.json({ error: "状态不合法。" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ entry });
}
