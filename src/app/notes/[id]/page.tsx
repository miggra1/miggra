import { notFound } from "next/navigation";
import { getPublishedNoteSafe, listNotesSafe } from "@/lib/notes";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between text-sm text-[var(--subtle)]">
          <Link href="/notes" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">← 返回列表</Link>
          <div className="flex gap-3">
            {prev ? <Link href={`/notes/${prev.id}`} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">上一条</Link> : null}
            {next ? <Link href={`/notes/${next.id}`} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">下一条</Link> : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">碎碎念</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{note.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1">{note.tag}</span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">{new Date(note.createdAt).toLocaleString("zh-CN")}</span>
            {note.pinned ? <span className="rounded-full border border-amber-300/30 px-3 py-1 text-amber-100">置顶</span> : null}
          </div>
          {note.coverImage && (
            <div className="mt-6 overflow-hidden rounded-2xl">
              <img src={note.coverImage} alt="" className="w-full object-cover max-h-96" />
            </div>
          )}
          <div className="mt-8">
            <MarkdownRenderer>{note.text}</MarkdownRenderer>
          </div>
        </div>
      </article>
    </main>
  );
}
