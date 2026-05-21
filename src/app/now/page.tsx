import { nowItems } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";

export default function NowPage() {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Now</p>
          <h1 className="mt-3 text-3xl font-semibold">我最近在做什么</h1>
          <p className="mt-3 text-white/65">这是一个轻量的状态页，记录当下的学习、工作和生活节奏。</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {nowItems.map((item, index) => (
            <article key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">0{index + 1}</div>
              <p className="mt-4 leading-8 text-white/75">{item}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
