import { NextResponse } from "next/server";
import { transitionScheduledNotes } from "@/lib/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 由外部定时任务（cron）调用，将到期的 SCHEDULED 笔记转为 PUBLISHED */
export async function GET(request: Request) {
  // 强制要求 token，防止未配置时被随意触发
  const authHeader = request.headers.get("authorization");
  const token = process.env.CRON_SECRET;
  if (!token || authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const count = await transitionScheduledNotes();
    return NextResponse.json({ published: count });
  } catch {
    return NextResponse.json({ error: "数据库错误" }, { status: 500 });
  }
}
