export const runtime = "nodejs";
export const revalidate = 0;

export default function sitemap() {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/notes`, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
  ];
}
