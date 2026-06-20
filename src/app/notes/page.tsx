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
        <header className="mb-12">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Journal</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">碎碎念</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">按时间排列，每条都是一个瞬间</p>
        </header>

        <div className="space-y-px">
          {published.length === 0 && (
            <p className="text-[var(--subtle)] text-sm py-8 text-center">还没有内容</p>
          )}
          {published.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}
              className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition hover:bg-[var(--card)] group"
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: note.pinned ? "var(--rose)" : "var(--subtle)" }} />
              <span className="text-[13px] text-[var(--fg-secondary)] min-w-[72px]">{note.tag}</span>
              <span className="flex-1 text-[15px] truncate font-medium">{note.title}</span>
              <time className="text-[13px] text-[var(--subtle)] tabular-nums">{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
              <span className="text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition text-xs">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
