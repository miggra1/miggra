import { listNotesSafe } from "@/lib/notes";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export default async function NotesPage() {
  const { notes, dbError } = await listNotesSafe();
  const published = notes.filter((note) => note.status === "PUBLISHED");
  const pinned = published.filter((note) => note.pinned);
  const timeline = published;

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Archive</p>
          <h1 className="mt-3 text-3xl font-semibold">全部公开碎碎念</h1>
          <p className="mt-3 text-white/65">这里按时间展示所有已发布内容，置顶内容会优先出现。</p>
        </header>

        {pinned.length ? (
          <section className="grid gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/35">Pinned</p>
              <h2 className="mt-2 text-xl font-semibold">置顶精选</h2>
            </div>
            {pinned.map((note) => (
              <a key={note.id} href={`/notes/${note.id}`} className="rounded-[1.5rem] border border-amber-300/25 bg-amber-300/8 p-6 transition hover:bg-amber-300/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-medium">{note.title}</h2>
                  <span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs text-amber-100">置顶</span>
                </div>
                <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-white/75">{note.text}</p>
              </a>
            ))}
          </section>
        ) : null}

        <section className="grid gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/35">Timeline</p>
            <h2 className="mt-2 text-xl font-semibold">时间轴</h2>
          </div>
          <div className="relative space-y-4 border-l border-white/10 pl-6">
            {timeline.map((note) => (
              <a key={note.id} href={`/notes/${note.id}`} className="relative block rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.08]">
                <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-medium">{note.title}</h2>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{note.tag}</span>
                </div>
                <div className="mt-2 text-xs text-white/45">{new Date(note.createdAt).toLocaleString("zh-CN")}</div>
                <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-white/65">{note.text}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
