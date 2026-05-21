import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await prisma.guestbookEntry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ error: "留言不能为空。" }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 40) : "匿名";
  const message = body.message.trim();
  if (!message) {
    return NextResponse.json({ error: "留言不能为空。" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.create({
    data: { name, message, status: "PUBLISHED" },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
