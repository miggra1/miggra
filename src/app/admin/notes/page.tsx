import { listNotesSafe } from "@/lib/notes";
import Link from "next/link";

export default async function AdminNotesList() {
  const { notes } = await listNotesSafe();

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#3b82f6]">碎碎念</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">你的日记本</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{notes.length} 条记录</p>
        </div>
        <Link href="/admin/notes/new" className="btn btn-primary">+ 写一条</Link>
      </div>

      <div className="space-y-0.5">
        {notes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✎</p>
            <p className="text-[var(--muted)] text-sm">还什么都没有。写下第一条碎碎念吧。</p>
            <Link href="/admin/notes/new" className="btn btn-primary mt-4">开始写</Link>
          </div>
        )}
        {notes.map((note, i) => (
          <Link key={note.id} href={`/admin/notes/${note.id}`}
            className="flex items-center gap-4 px-4 py-3 surface-hover rounded-lg animate-in"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: note.status === "PUBLISHED" ? "var(--green)" : note.status === "SCHEDULED" ? "var(--purple)" : "var(--amber)" }} />
            <span className="text-[12px] text-[var(--muted)] w-16 shrink-0 truncate">{note.tag}</span>
            <span className="flex-1 text-[15px] font-medium truncate">{note.title}</span>
            <span className="text-[10px] text-[var(--muted)] font-medium">{note.status === "DRAFT" ? "草稿" : note.status === "SCHEDULED" ? "定时" : "发布"}</span>
            {note.pinned && <span className="text-[10px] text-[var(--rose)] font-medium">置顶</span>}
            <span className="text-[11px] text-[var(--subtle)] tabular-nums">{new Date(note.updatedAt).toISOString().slice(0, 10)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
