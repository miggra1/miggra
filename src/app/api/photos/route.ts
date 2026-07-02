import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createPhoto } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePhotoBody(body: Record<string, unknown>) {
  const takenAt = typeof body.takenAt === "string" ? body.takenAt : undefined;
  if (takenAt && Number.isNaN(new Date(takenAt).getTime())) {
    return { error: "拍摄日期不正确。" };
  }

  return {
    data: {
      url: typeof body.url === "string" ? body.url : "",
      caption: typeof body.caption === "string" ? body.caption : undefined,
      album: typeof body.album === "string" ? body.album : undefined,
      takenAt,
      location: typeof body.location === "string" ? body.location : undefined,
      tags: typeof body.tags === "string" ? body.tags : undefined,
      featured: typeof body.featured === "boolean" ? body.featured : undefined,
      active: typeof body.active === "boolean" ? body.active : undefined,
      order: typeof body.order === "number" ? body.order : undefined,
    },
  };
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parsePhotoBody(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (!parsed.data.url.trim()) {
      return NextResponse.json({ error: "请提供图片 URL。" }, { status: 400 });
    }

    const photo = await createPhoto(parsed.data);
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
