import { notFound } from "next/navigation";
import { getPublishedNoteSafe, listNotesSafe } from "@/lib/notes";
import { DetailNav } from "../../components/detail-nav";
import { RelatedItems } from "../../components/related-items";

export const revalidate = 60;
export const runtime = "nodejs";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { note } = await getPublishedNoteSafe(id);

  if (!note) {
    notFound();
  }

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
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <DetailNav prevHref={prevHref} nextHref={nextHref} />
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">碎碎念</p>
          <h1 className="mt-3 text-3xl font-semibold">{note.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50">
            <span className="rounded-full border border-white/10 px-3 py-1">{note.tag}</span>
            <span className="rounded-full border border-white/10 px-3 py-1">{new Date(note.createdAt).toLocaleString("zh-CN")}</span>
            {note.pinned ? <span className="rounded-full border border-amber-300/30 px-3 py-1 text-amber-100">置顶</span> : null}
          </div>
          <p className="mt-6 whitespace-pre-wrap leading-8 text-white/75">{note.text}</p>
        </article>
        <RelatedItems title="同标签推荐" items={related} />
      </div>
    </main>
  );
}
