import { notFound } from "next/navigation";
import { getPublishedNoteSafe, listNotesSafe } from "@/lib/notes";
import Link from "next/link";

export const revalidate = 60; export const runtime = "nodejs";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { note } = await getPublishedNoteSafe(id);
  if (!note) notFound();

  const { notes } = await listNotesSafe();
  const published = notes.filter((n) => n.status === "PUBLISHED");
  const index = published.findIndex((n) => n.id === id);
  const prev = index > 0 ? published[index - 1] : null;
  const next = index < published.length - 1 ? published[index + 1] : null;

  return (
    <main className="min-h-screen animate-in">
      <article className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/notes" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition mb-10">← 碎碎念</Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[12px] px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--muted)]">{note.tag}</span>
          <time className="text-[12px] text-[var(--subtle)]">{new Date(note.createdAt).toLocaleString("zh-CN")}</time>
          {note.pinned && <span className="text-[11px] text-[var(--rose)] font-medium">置顶</span>}
        </div>

        <h1 className="text-[36px] font-semibold leading-tight tracking-tight mb-12">{note.title}</h1>

        <div className="text-[17px] leading-[1.9] text-[var(--fg-secondary)] whitespace-pre-wrap">
          {note.text}
        </div>

        <nav className="flex items-center justify-between mt-20 pt-8 border-t border-[var(--border)]">
          {prev ? <Link href={`/notes/${prev.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition">← {prev.title.slice(0, 16)}</Link> : <span />}
          {next ? <Link href={`/notes/${next.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition text-right">{next.title.slice(0, 16)} →</Link> : <span />}
        </nav>
      </article>
    </main>
  );
}
