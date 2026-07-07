import { listNotesSafe } from "@/lib/notes";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60;
export const runtime = "nodejs";

const PAGE_SIZE = 10;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag: filterTag, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const { notes } = await listNotesSafe();
  const published = notes.filter(
    (n) => n.status === "PUBLISHED" && (!filterTag || n.tag === filterTag),
  );
  const tags = Array.from(
    new Set(notes.filter((n) => n.status === "PUBLISHED").map((n) => n.tag)),
  );

  const totalPages = Math.ceil(published.length / PAGE_SIZE);
  const paged = published.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (filterTag) params.set("tag", filterTag);
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return q ? `/notes?${q}` : "/notes";
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">碎碎念</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">全部碎碎念</h1>
          <p className="mt-3 text-[var(--muted)]">{published.length} 条已发布</p>
        </header>

        {/* 标签筛选 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a href="/notes"
              className={`rounded-full border px-4 py-2 text-sm transition ${!filterTag ? "border-[var(--accent)] text-[var(--fg)] bg-[var(--card-strong)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"}`}
            >
              全部
            </a>
            {tags.map((tag) => (
              <a key={tag} href={`?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${filterTag === tag ? "border-[var(--accent)] text-[var(--fg)] bg-[var(--card-strong)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"}`}
              >
                {tag}
              </a>
            ))}
          </div>
        )}

        <div className="grid gap-4">
          {paged.map((note, i) => (
            <Link key={note.id} href={`/notes/${note.id}`}
              className="group rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 card-interactive animate-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {note.coverImage && (
                <div className="mb-4 -mx-2 -mt-2 overflow-hidden rounded-2xl">
                  <img src={note.coverImage} alt="" className="w-full h-44 object-cover card-cover transition duration-500" />
                </div>
              )}
              <div className="flex items-center justify-between gap-4 text-sm text-[var(--subtle)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">{note.tag}</span>
                <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{note.title}</h2>
              <div className="mt-3 line-clamp-2">
                <MarkdownRenderer preview>{note.text}</MarkdownRenderer>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4">
            {page > 1 ? (
              <a href={pageHref(page - 1)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                上一页
              </a>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">上一页</span>
            )}
            <span className="text-sm text-[var(--subtle)]">{page} / {totalPages}</span>
            {page < totalPages ? (
              <a href={pageHref(page + 1)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                下一页
              </a>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">下一页</span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
