import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createPhoto } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, caption } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "请提供图片 URL。" }, { status: 400 });
    }
    const photo = await createPhoto({ url, caption });
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
