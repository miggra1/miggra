import { listNotesSafe } from "@/lib/notes";
import Link from "next/link";

export default async function AdminNotesList() {
  const { notes } = await listNotesSafe();

  return (
    <div className="px-8 py-10 max-w-4xl animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Notes</p>
          <h1 className="text-[28px] font-medium mt-1">碎碎念</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{notes.length} 条</p>
        </div>
        <Link href="/admin/notes/new" className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-full transition hover:opacity-90">+ 新建</Link>
      </div>

      <div className="space-y-px">
        {notes.map((note) => (
          <Link key={note.id} href={`/admin/notes/${note.id}`}
            className="flex items-center gap-4 px-4 py-3 rounded-lg transition hover:bg-[var(--card)] group"
          >
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: note.status === "PUBLISHED" ? "var(--green)" : "var(--amber)" }} />
            <span className="text-xs text-[var(--fg-secondary)] min-w-[60px]">{note.tag}</span>
            <span className="flex-1 text-[15px] truncate">{note.title}</span>
            {note.pinned && <span className="text-[10px] text-[var(--rose)]">置顶</span>}
            <span className="text-xs text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition">编辑 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
