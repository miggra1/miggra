import { getPublishedPages } from "@/lib/pages";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/notes`, lastModified: now },
    { url: `${baseUrl}/photos`, lastModified: now },
    { url: `${baseUrl}/now`, lastModified: now },
    { url: `${baseUrl}/wish`, lastModified: now },
    { url: `${baseUrl}/reading`, lastModified: now },
    { url: `${baseUrl}/inspirations`, lastModified: now },
    { url: `${baseUrl}/life`, lastModified: now },
    { url: `${baseUrl}/timeline`, lastModified: now },
    { url: `${baseUrl}/guestbook`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
  ];

  // 动态添加已发布的页面
  let pageUrls: Array<{ url: string; lastModified: Date }> = [];
  try {
    const pages = await getPublishedPages();
    pageUrls = pages.map((page) => ({
      url: `${baseUrl}/pages/${page.slug}`,
      lastModified: page.updatedAt,
    }));
  } catch {
    // 数据库不可用时跳过
  }

  return [...staticUrls, ...pageUrls];
}
