import { withDbTimeout } from "@/lib/db-timeout";
import { prisma } from "@/lib/prisma";
import type { NoteStatus } from "@prisma/client";

export type PageData = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type PageInput = {
  slug: string;
  title: string;
  content: string;
  status?: NoteStatus;
};

const RESERVED_SLUGS = new Set([
  "notes", "now", "wish", "reading", "inspirations", "timeline",
  "guestbook", "admin", "api", "rss", "pages", "page",
]);

export function isSlugReserved(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export async function listPages() {
  return withDbTimeout(
    prisma.page.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    }),
  );
}

export async function listPagesSafe() {
  try {
    const pages = await listPages();
    return { pages, dbError: false as const };
  } catch {
    return { pages: [] as PageData[], dbError: true as const };
  }
}

export async function getPublishedPages() {
  return withDbTimeout(
    prisma.page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
    }),
  );
}

export async function getPublishedPage(slug: string) {
  return withDbTimeout(
    prisma.page.findFirst({
      where: { slug, status: "PUBLISHED" },
    }),
  );
}

export async function getPublishedPageSafe(slug: string) {
  try {
    const page = await getPublishedPage(slug);
    return { page, dbError: false as const };
  } catch {
    return { page: null, dbError: true as const };
  }
}

export async function getPageById(id: string) {
  return withDbTimeout(
    prisma.page.findUnique({ where: { id } }),
  );
}

export async function createPage(input: PageInput) {
  return prisma.page.create({
    data: {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      content: input.content.trim(),
      status: input.status ?? "DRAFT",
    },
  });
}

export async function updatePage(id: string, input: Partial<PageInput>) {
  try {
    return await prisma.page.update({
      where: { id },
      data: {
        ...(input.slug !== undefined && { slug: input.slug.trim().toLowerCase() }),
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.content !== undefined && { content: input.content.trim() }),
        ...(input.status !== undefined && { status: input.status }),
      },
    });
  } catch {
    return null;
  }
}

export async function deletePage(id: string) {
  try {
    await prisma.page.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
