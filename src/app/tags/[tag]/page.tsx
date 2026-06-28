import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ tag: string }> };

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  let notes: Array<{
    id: string;
    title: string;
    text: string;
    tag: string;
    createdAt: Date;
    coverImage: string | null;
  }>;

  try {
    notes = await prisma.note.findMany({
      where: { status: "PUBLISHED", tag: decoded },
      select: {
        id: true,
        title: true,
        text: true,
        tag: true,
        createdAt: true,
        coverImage: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    notes = [];
  }

  if (notes.length === 0) {
    // check if tag exists at all
    try {
      const count = await prisma.note.count({
        where: { tag: decoded },
      });
      if (count === 0) notFound();
    } catch {
      // DB error, show empty state
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-6 py-10 animate-in">
        <div className="mb-10">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--subtle)] hover:text-[var(--fg)] transition"
          >
            ← 首页
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1 text-lg text-[var(--accent)] mr-3 align-middle">
              {decoded}
            </span>
            共 {notes.length} 篇
          </h1>
        </div>

        <div className="grid gap-4">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:bg-[var(--card-strong)]"
            >
              <div className="flex items-center gap-3 text-xs text-[var(--subtle)] mb-3">
                <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
              </div>
              <h2 className="text-xl font-medium group-hover:text-[var(--accent)] transition">
                {note.title}
              </h2>
              <div className="mt-3 line-clamp-3 text-[var(--muted)]">
                <MarkdownRenderer preview>{note.text}</MarkdownRenderer>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
