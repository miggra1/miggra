import { listNotes } from "@/lib/notes";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  let notes = [];

  try {
    notes = await listNotes();
  } catch {
    notes = [];
  }

  const published = notes.filter((note) => note.status === "PUBLISHED");

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/notes`, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
    ...published.map((note) => ({
      url: `${baseUrl}/notes/${note.id}`,
      lastModified: note.updatedAt,
    })),
  ];
}
