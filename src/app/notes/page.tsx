import { listNotesSafe } from "@/lib/notes";
import Link from "next/link";

export const revalidate = 60;
export const runtime = "nodejs";

export default async function NotesPage() {
  const { notes } = await listNotesSafe();
  const published = notes.filter((n) => n.status === "PUBLISHED");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12 animate-in">
          <p className="text-[11px] uppercase tracking-widest text-[#3b82f6]">Journal</p>
          <h1 className="text-[36px] font-semibold mt-2 tracking-tight">碎碎念</h1>
          <p className="text-[var(--fg-secondary)] mt-2 text-sm">{published.length} 条公开记录，按时间排列</p>
        </header>

        <div className="space-y-0.5">
          {published.length === 0 && (
            <div className="text-center py-20 surface rounded-xl">
              <p className="text-4xl mb-3">📖</p>
              <p className="text-[var(--muted)] text-sm">还没有公开的碎碎念</p>
            </div>
          )}
          {published.map((note, i) => (
            <Link key={note.id} href={`/notes/${note.id}`}
              className="flex items-center gap-4 px-4 py-3.5 surface-hover rounded-lg animate-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="h-2 w-2 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: note.pinned ? "var(--rose)" : "var(--subtle)" }} />
              <span className="text-[12px] text-[var(--muted)] w-16 shrink-0">{note.tag}</span>
              <span className="flex-1 text-[15px] font-medium truncate">{note.title}</span>
              <time className="text-[12px] text-[var(--subtle)] tabular-nums">{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
