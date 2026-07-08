import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { listNotesSafe } from "@/lib/notes";
import { getMoodMeta, moodFor, NOTE_MOODS } from "@/lib/note-mood";

export const revalidate = 60;
export const runtime = "nodejs";

const PAGE_SIZE = 9;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag: filterTag, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const { notes } = await listNotesSafe();
  const allPublished = notes.filter((note) => note.status === "PUBLISHED");
  const published = allPublished.filter((note) => !filterTag || note.tag === filterTag);
  const tags = Array.from(new Set(allPublished.map((note) => note.tag).filter(Boolean)));
  const recentForMood = allPublished.slice(0, 12);
  const moodSpectrum = NOTE_MOODS.map((mood) => ({
    ...mood,
    count: recentForMood.filter((note) => moodFor(note) === mood.value).length,
  })).filter((mood) => mood.count > 0);

  const totalPages = Math.max(1, Math.ceil(published.length / PAGE_SIZE));
  const paged = published.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const leadNote = paged[0];
  const restNotes = paged.slice(1);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (filterTag) params.set("tag", filterTag);
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return q ? `/notes?${q}` : "/notes";
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10">
        <header className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Notes</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">全部碎碎念</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
              这里是日常想法、即时感受和一些没有被整理得太正式的记录。最新或置顶的一篇会被放大，像翻开一本小杂志的第一页。
            </p>
            <p className="mt-3 text-sm text-[var(--subtle)]">{published.length} 篇已发布</p>
          </div>

          {moodSpectrum.length > 0 ? (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--subtle)]">最近的情绪色谱</p>
                <span className="text-xs text-[var(--subtle)]">近 {recentForMood.length} 篇</span>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/10">
                {moodSpectrum.map((mood) => (
                  <span
                    key={mood.value}
                    className={mood.barClass}
                    style={{ flexGrow: mood.count }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {moodSpectrum.map((mood) => (
                  <span key={mood.value} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${mood.borderClass} ${mood.softClass} ${mood.textClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${mood.dotClass}`} />
                    {mood.label} {mood.count}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/notes"
              className={`rounded-full border px-4 py-2 text-sm transition ${!filterTag ? "border-[var(--accent)] bg-[var(--card-strong)] text-[var(--fg)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"}`}
            >
              全部
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/notes?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${filterTag === tag ? "border-[var(--accent)] bg-[var(--card-strong)] text-[var(--fg)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {leadNote ? (
          <div className="grid gap-4 lg:grid-cols-[1.16fr_0.84fr]">
            <Link
              href={`/notes/${leadNote.id}`}
              className="group min-h-[26rem] rounded-[1.75rem] border border-[var(--accent)]/35 bg-[var(--card)] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[var(--card-strong)] sm:p-6"
            >
              {leadNote.coverImage ? (
                <div className="mb-5 overflow-hidden rounded-[1.35rem]">
                  <img src={leadNote.coverImage} alt="" className="h-60 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-72" />
                </div>
              ) : (
                <div className="mb-5 flex h-48 items-end rounded-[1.35rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-5">
                  <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">最新的一点心事，先摊开在这里。</p>
                </div>
              )}
              <NoteMeta note={leadNote} large />
              <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{leadNote.title}</h2>
              <div className="mt-5 line-clamp-4 text-base leading-8">
                <MarkdownRenderer preview>{leadNote.text}</MarkdownRenderer>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {restNotes.slice(0, 2).map((note, i) => (
                <NoteCard key={note.id} note={note} index={i} compact />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-8 text-[var(--muted)]">
            还没有发布的碎碎念。
          </div>
        )}

        {restNotes.length > 2 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {restNotes.slice(2).map((note, i) => (
              <NoteCard key={note.id} note={note} index={i + 2} />
            ))}
          </div>
        ) : null}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                上一页
              </Link>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">上一页</span>
            )}
            <span className="text-sm text-[var(--subtle)]">{page} / {totalPages}</span>
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                下一页
              </Link>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">下一页</span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

function NoteMeta({ note, large = false }: { note: { tag: string; createdAt: Date; title?: string; text?: string }; large?: boolean }) {
  const mood = getMoodMeta(moodFor(note));

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${large ? "sm:text-sm" : ""}`}>
      <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">{note.tag}</span>
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${mood.borderClass} ${mood.softClass} ${mood.textClass}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${mood.dotClass}`} />
        {mood.label}
      </span>
      <time className="text-[var(--subtle)]">{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
    </div>
  );
}

function NoteCard({
  note,
  index,
  compact = false,
}: {
  note: { id: string; tag: string; createdAt: Date; title: string; text: string; coverImage: string | null };
  index: number;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="group rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:bg-[var(--card-strong)] animate-in"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {note.coverImage ? (
        <div className="mb-4 overflow-hidden rounded-2xl">
          <img src={note.coverImage} alt="" className={`w-full object-cover transition duration-500 group-hover:scale-[1.04] ${compact ? "h-32" : "h-40"}`} />
        </div>
      ) : null}
      <NoteMeta note={note} />
      <h2 className={`mt-4 font-semibold leading-snug ${compact ? "text-lg" : "text-xl"}`}>{note.title}</h2>
      <div className={`mt-3 ${compact ? "line-clamp-3" : "line-clamp-2"}`}>
        <MarkdownRenderer preview>{note.text}</MarkdownRenderer>
      </div>
    </Link>
  );
}
