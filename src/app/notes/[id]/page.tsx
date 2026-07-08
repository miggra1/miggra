import { notFound } from "next/navigation";
import { getPublishedNoteSafe, listNotesSafe } from "@/lib/notes";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { ContinueReading } from "@/app/components/continue-reading";
import { getMoodMeta, moodFor } from "@/lib/note-mood";

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
  const related = published
    .filter((n) => n.id !== id && n.tag === note.tag)
    .slice(0, 3)
    .map((n) => ({ href: `/notes/${n.id}`, title: n.title, note: n.tag }));

  const readingTime = Math.max(1, Math.ceil(note.text.length / 400));
  const mood = getMoodMeta(moodFor(note));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <Link href="/notes" className="text-sm text-[var(--subtle)] hover:text-[var(--fg)] transition">← 返回列表</Link>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl animate-in">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">碎碎念</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{note.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1">{note.tag}</span>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${mood.borderClass} ${mood.softClass} ${mood.textClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mood.dotClass}`} />
              {mood.label}
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">{new Date(note.createdAt).toLocaleString("zh-CN")}</span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">{readingTime} 分钟阅读</span>
            {note.pinned ? <span className="rounded-full border border-amber-300/30 px-3 py-1 text-amber-100">置顶</span> : null}
          </div>
          {note.coverImage && (
            <div className="mt-6 overflow-hidden rounded-2xl">
              <img src={note.coverImage} alt="" loading="lazy" className="w-full object-cover max-h-96" />
            </div>
          )}
          <div className="mt-8">
            <MarkdownRenderer>{note.text}</MarkdownRenderer>
          </div>
        </div>

        <ContinueReading
          prev={prev ? { href: `/notes/${prev.id}`, title: prev.title, note: prev.tag } : null}
          next={next ? { href: `/notes/${next.id}`, title: next.title, note: next.tag } : null}
          related={related}
          listHref="/notes"
          listLabel="全部碎碎念"
        />
      </article>
    </main>
  );
}
