import { notFound } from "next/navigation";
import { getPublishedNoteSafe, listNotesSafe } from "@/lib/notes";
import { DetailNav } from "../../components/detail-nav";
import { RelatedItems } from "../../components/related-items";

export const revalidate = 60;
export const runtime = "nodejs";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { note } = await getPublishedNoteSafe(id);

  if (!note) notFound();

  const { notes } = await listNotesSafe();
  const published = notes.filter((item) => item.status === "PUBLISHED");
  const index = published.findIndex((item) => item.id === note.id);
  const prevHref = index > 0 ? `/notes/${published[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < published.length - 1 ? `/notes/${published[index + 1]?.id}` : undefined;
  const related = published
    .filter((item) => item.id !== note.id && item.tag === note.tag)
    .slice(0, 3)
    .map((item) => ({ href: `/notes/${item.id}`, title: item.title, note: item.tag }));

  return (
    /* ── 信纸风：暖底 + 横线 + 信封装饰 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#fcf8f3] text-[#3d3027] dark:bg-[#17120c] dark:text-[#e8dfd3]">
      {/* 信纸横线 */}
      <div className="absolute inset-0 bg-[linear-gradient(#e8dcc8_1px,transparent_1px)] bg-[size:100%_1.75rem] opacity-40 dark:bg-[linear-gradient(rgba(232,223,211,0.06)_1px,transparent_1px)] dark:opacity-25" />
      {/* 信纸左右边界 */}
      <div className="absolute left-[8%] top-0 h-full w-px bg-rose-200/40 dark:bg-rose-400/10" />
      <div className="absolute right-[8%] top-0 h-full w-px bg-rose-200/40 dark:bg-rose-400/10" />

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        {/* ── 信纸正文 ── */}
        <article className="mt-6 rounded-[2rem] border border-amber-200/40 bg-[#fefcf8] p-8 shadow-lg dark:border-amber-700/15 dark:bg-[#1c1710]">
          {/* 信封口锯齿装饰 */}
          <div className="mb-6 flex items-center gap-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="h-4 w-3 rounded-sm bg-rose-300/30 dark:bg-rose-400/15" />
            ))}
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-400">A Letter</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold italic leading-snug">{note.title}</h1>

          {/* 火漆印章标签 */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-red-300/50 bg-red-50 px-4 py-1.5 font-mono text-xs text-red-400 dark:border-red-700/30 dark:bg-red-900/10 dark:text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              {note.tag}
            </span>
            <span className="font-mono text-xs text-stone-400">{new Date(note.createdAt).toLocaleString("zh-CN")}</span>
            {note.pinned ? (
              <span className="rounded-full border-2 border-amber-300/50 bg-amber-50 px-3 py-1 font-mono text-xs text-amber-500 dark:border-amber-600/30 dark:bg-amber-900/10">📌 置顶</span>
            ) : null}
          </div>

          {/* 正文内容 */}
          <div className="mt-8 font-mono text-sm leading-8 text-stone-600 dark:text-stone-300">
            {note.text.split("\n").map((line, i) => (
              <p key={i} className="min-h-[1.75rem]">
                {line || " "}
              </p>
            ))}
          </div>

          {/* 签名字样 */}
          <div className="mt-10 border-t border-amber-200/30 pt-6 text-right font-serif text-lg italic text-rose-300 dark:text-rose-500">
            — Miggra
          </div>
        </article>

        <RelatedItems title="同标签推荐" items={related} />
      </div>
    </main>
  );
}
