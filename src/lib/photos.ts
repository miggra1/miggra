import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type PhotoInput = {
  url: string;
  caption?: string | null;
  album?: string | null;
  takenAt?: string | null;
  location?: string | null;
  tags?: string | null;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

export type PhotoFilters = {
  album?: string;
  year?: string;
  tag?: string;
  featured?: boolean;
  includeInactive?: boolean;
  active?: boolean;
};

export type SerializablePhoto = Awaited<ReturnType<typeof listPhotos>>[number] & {
  takenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeText(value?: string | null) {
  const text = value?.trim();
  return text || null;
}

export function normalizeTags(value?: string | null) {
  const tags = value
    ?.split(/[，,]/)
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];
  return Array.from(new Set(tags)).join(",") || null;
}

export function splitTags(value?: string | null) {
  return value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function photoWhere(filters: PhotoFilters = {}): Prisma.PhotoWhereInput {
  const where: Prisma.PhotoWhereInput = {};

  if (!filters.includeInactive) {
    where.active = filters.active ?? true;
  } else if (typeof filters.active === "boolean") {
    where.active = filters.active;
  }

  if (filters.album) where.album = filters.album;
  if (filters.featured !== undefined) where.featured = filters.featured;
  if (filters.tag) where.tags = { contains: filters.tag };

  if (filters.year && /^\d{4}$/.test(filters.year)) {
    const year = Number(filters.year);
    where.takenAt = {
      gte: new Date(year, 0, 1),
      lt: new Date(year + 1, 0, 1),
    };
  }

  return where;
}

export async function listPhotos(filters: PhotoFilters = {}) {
  return prisma.photo.findMany({
    where: photoWhere(filters),
    orderBy: [{ order: "asc" }, { takenAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function listPhotoFacets(options: { includeInactive?: boolean } = {}) {
  const photos = await prisma.photo.findMany({
    where: options.includeInactive ? {} : { active: true },
    select: { album: true, takenAt: true, tags: true },
  });

  const albums = Array.from(new Set(photos.map((photo) => photo.album).filter(Boolean) as string[])).sort();
  const years = Array.from(new Set(photos.map((photo) => photo.takenAt?.getFullYear()).filter(Boolean) as number[]))
    .sort((a, b) => b - a)
    .map(String);
  const tags = Array.from(new Set(photos.flatMap((photo) => splitTags(photo.tags)))).sort();

  return { albums, years, tags };
}

export async function listHomePhotos(limit = 6) {
  const featured = await listPhotos({ featured: true });
  if (featured.length >= limit) return featured.slice(0, limit);

  const fill = await prisma.photo.findMany({
    where: { active: true, featured: false },
    orderBy: [{ order: "asc" }, { takenAt: "desc" }, { createdAt: "desc" }],
    take: limit - featured.length,
  });

  return [...featured, ...fill].slice(0, limit);
}

export async function createPhoto(data: PhotoInput) {
  return prisma.photo.create({
    data: {
      url: data.url.trim(),
      caption: normalizeText(data.caption),
      album: normalizeText(data.album),
      takenAt: parseDate(data.takenAt),
      location: normalizeText(data.location),
      tags: normalizeTags(data.tags),
      featured: data.featured ?? false,
      active: data.active ?? true,
      order: data.order ?? 0,
    },
  });
}

export async function updatePhoto(id: string, data: Partial<PhotoInput>) {
  return prisma.photo.update({
    where: { id },
    data: {
      caption: data.caption !== undefined ? normalizeText(data.caption) : undefined,
      album: data.album !== undefined ? normalizeText(data.album) : undefined,
      takenAt: data.takenAt !== undefined ? parseDate(data.takenAt) : undefined,
      location: data.location !== undefined ? normalizeText(data.location) : undefined,
      tags: data.tags !== undefined ? normalizeTags(data.tags) : undefined,
      featured: data.featured,
      active: data.active,
      order: data.order,
    },
  });
}

export async function deletePhoto(id: string) {
  return prisma.photo.delete({ where: { id } });
}
