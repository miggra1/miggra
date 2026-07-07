import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "无效的上传请求。" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择文件。" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "不支持的文件类型，仅支持 JPG、PNG、GIF、WebP、SVG。" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "文件大小不能超过 10MB。" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  // TODO: Vercel 生产环境文件系统只读，/tmp 仅为临时存储，请求结束后可能被清理。
  // 需接入外部存储（Vercel Blob / Cloudflare R2 / S3）才能持久化上传文件。
  // 本地开发写入 public/uploads/ 正常工作。
  const isVercel = !!process.env.VERCEL;
  const uploadsDir = isVercel
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const url = isVercel
    ? `/api/upload/${filename}`
    : `/uploads/${filename}`;

  return NextResponse.json({ url, warning: isVercel ? "Vercel 上传仅临时有效，请配置外部存储（如 Vercel Blob / S3）。" : null }, { status: 201 });
}
