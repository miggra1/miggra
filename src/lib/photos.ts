import { prisma } from "@/lib/prisma";

export async function listPhotos() {
  return prisma.photo.findMany({ orderBy: { order: "asc" } });
}

export async function createPhoto(data: { url: string; caption?: string }) {
  return prisma.photo.create({ data: { url: data.url, caption: data.caption ?? null } });
}

export async function deletePhoto(id: string) {
  return prisma.photo.delete({ where: { id } });
}
