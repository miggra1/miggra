export const runtime = "nodejs";
export const revalidate = 0;

export default function sitemap() {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/notes`, lastModified: now },
    { url: `${baseUrl}/now`, lastModified: now },
    { url: `${baseUrl}/wish`, lastModified: now },
    { url: `${baseUrl}/reading`, lastModified: now },
    { url: `${baseUrl}/inspirations`, lastModified: now },
    { url: `${baseUrl}/timeline`, lastModified: now },
    { url: `${baseUrl}/guestbook`, lastModified: now },
  ];
}
