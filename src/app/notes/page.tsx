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
      {/* ── 手账日记风：暖米色底 + 格线纹理 ── */}
      <main className="relative min-h-screen overflow-hidden bg-[#fdfaf5] text-[#3d3027] dark:bg-[#1a1510] dark:text-[#e8dfd3]">
        {/* 格线背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(#e8dcc8_1px,transparent_1px)] bg-[size:100%_2rem] opacity-40 dark:bg-[linear-gradient(rgba(232,223,211,0.08)_1px,transparent_1px)] dark:opacity-30" />
        {/* 左边距红线 */}
        <div className="absolute left-[10%] top-0 h-full w-px bg-rose-300/30 dark:bg-rose-400/15" />

        <div className="relative mx-auto max-w-5xl px-6 py-12">
          {/* ── 页眉 ── */}
          <header className="mb-10 rounded-[2rem] border border-amber-200/60 bg-amber-50/60 px-8 py-8 backdrop-blur-sm dark:border-amber-700/20 dark:bg-amber-900/10">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-500">Journal</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight italic">碎碎念手账</h1>
            <p className="mt-2 font-mono text-sm text-stone-400 dark:text-stone-500">按时间排列 · 每条都是一个瞬间</p>
          </header>

          {/* ── 置顶 ── */}
          {pinned.length ? (
            <section className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">📌</span>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500">置顶便签</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pinned.map((note, i) => (
                  <a
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="group relative rounded-2xl border-2 border-amber-300/40 bg-amber-50/80 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:border-amber-700/30 dark:bg-amber-900/20"
                    style={{ transform: `rotate(${i % 2 === 0 ? "-0.3deg" : "0.4deg"})` }}
                  >
                    {/* 图钉 */}
                    <div className="absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-rose-400 shadow-md ring-2 ring-rose-300/50" />
                    <h2 className="font-serif text-xl font-medium">{note.title}</h2>
                    <p className="mt-3 line-clamp-3 font-mono text-sm leading-relaxed text-stone-500 dark:text-stone-400">{note.text}</p>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {/* ── 时间轴日记条目 ── */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">📖</span>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-400">日记条目</p>
            </div>
            <div className="space-y-4">
              {timeline.map((note, i) => {
                const colors = ["#e57c8a", "#c9a96e", "#7fa998", "#8fa3b8", "#c48ba3"];
                const tagColor = colors[i % colors.length];
                return (
                  <a
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="group relative flex gap-5 rounded-2xl border border-amber-200/40 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:shadow-md dark:border-amber-700/15 dark:bg-amber-900/5 dark:hover:border-amber-600/30"
                  >
                    {/* 彩色标签条 */}
                    <div className="w-1.5 shrink-0 rounded-full" style={{ backgroundColor: tagColor }} />
                    {/* 日期标注 */}
                    <div className="shrink-0 text-right font-mono text-xs text-stone-400 dark:text-stone-500">
                      <div>{new Date(note.createdAt).toISOString().slice(0, 10)}</div>
                      <div className="mt-1 rounded-full border border-amber-200/50 px-2 py-0.5 text-[10px] dark:border-amber-700/20">
                        {note.tag}
                      </div>
                    </div>
                    {/* 内容 */}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-lg font-medium">{note.title}</h2>
                      <p className="mt-2 line-clamp-2 font-mono text-sm leading-relaxed text-stone-500 dark:text-stone-400">{note.text}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
