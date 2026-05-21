import { readingList } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";

export default function ReadingPage() {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Reading</p>
          <h1 className="mt-3 text-3xl font-semibold">书单</h1>
          <p className="mt-3 text-white/65">把正在读、读过和准备读的书放在一起，顺手记一点感受。</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {readingList.map((book) => (
            <article key={book.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-medium">{book.title}</h2>
                {book.status ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{book.status}</span> : null}
              </div>
              <p className="mt-4 leading-8 text-white/70">{book.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
