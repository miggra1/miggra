import { listNotesSafe } from "@/lib/notes";
import { DbErrorBanner } from "../../components/db-error-banner";
import { NotesWorkspace } from "./notes-workspace";

export default async function AdminNotesPage() {
  const { notes, dbError } = await listNotesSafe();

  return (
    /* ── 深夜写作角落 ── */
    <div className="min-h-screen bg-[#0d0b0a] text-[#e8dfd3]">
      {dbError ? <DbErrorBanner /> : null}
      <div className="px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/60">Writing Corner</p>
          <h1 className="mt-2 font-serif text-3xl font-light italic">碎碎念工作台</h1>
          <p className="mt-1 font-mono text-xs text-stone-500">夜深了，写点什么吧。</p>
        </header>
        <NotesWorkspace initialNotes={notes} />
      </div>
    </div>
  );
}
