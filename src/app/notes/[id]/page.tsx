import { notFound } from "next/navigation";
import { getPublishedNoteSafe } from "@/lib/notes";
import { DbErrorBanner } from "../../components/db-error-banner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { note, dbError } = await getPublishedNoteSafe(id);

  if (dbError) {
    return (
      <>
        <DbErrorBanner />
        <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
          <p className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/70">
            无法加载该碎碎念，请稍后重试。
          </p>
        </main>
      </>
    );
  }

  if (!note) notFound();

  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/35">Note</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
          <span className="rounded-full border border-white/10 px-3 py-1">{note.tag}</span>
          <span>{note.status}</span>
          <time>{new Date(note.createdAt).toLocaleString("zh-CN")}</time>
        </div>
        <h1 className="mt-6 text-4xl font-semibold">{note.title}</h1>
        <p className="mt-6 whitespace-pre-wrap leading-8 text-white/75">{note.text}</p>
        <div className="mt-8">
          <a href="/" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:bg-white/10">
            返回首页
          </a>
        </div>
      </article>
    </main>
  );
}
