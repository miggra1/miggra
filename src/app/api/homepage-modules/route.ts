import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const modules = await prisma.homepageModule.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ modules });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.modules)) {
    return NextResponse.json({ error: "模块数据不正确。" }, { status: 400 });
  }

  await prisma.$transaction(
    (body.modules as Array<{ id: string; title?: string; enabled?: boolean; order?: number }>)
      .filter((m) => m.id)
      .map((module) =>
        prisma.homepageModule.update({
          where: { id: module.id },
          data: {
            ...(typeof module.title === "string" ? { title: module.title.trim() } : {}),
            ...(typeof module.enabled === "boolean" ? { enabled: module.enabled } : {}),
            ...(typeof module.order === "number" ? { order: module.order } : {}),
          },
        }),
      ),
  );

  return NextResponse.json({ ok: true });
}
