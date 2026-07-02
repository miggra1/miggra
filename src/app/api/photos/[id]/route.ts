import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deletePhoto, updatePhoto } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePhotoUpdate(body: Record<string, unknown>) {
  const takenAt = typeof body.takenAt === "string" ? body.takenAt : undefined;
  if (takenAt && Number.isNaN(new Date(takenAt).getTime())) {
    return { error: "拍摄日期不正确。" };
  }

  return {
    data: {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "参数不正确。" }, { status: 400 });
  }

  const parsed = parsePhotoUpdate(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const photo = await updatePhoto(id, parsed.data);
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deletePhoto(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
