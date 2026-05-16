import { listNotes } from "@/lib/notes";

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const notes = await listNotes();
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
