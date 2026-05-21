import { inspirations } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";

export default function InspirationsPage() {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Inspiration</p>
          <h1 className="mt-3 text-3xl font-semibold">灵感收集页</h1>
          <p className="mt-3 text-white/65">把脑子里突然冒出来的想法先放进来，之后再慢慢整理。</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {inspirations.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              {item.meta ? <div className="text-xs uppercase tracking-[0.2em] text-white/35">{item.meta}</div> : null}
              <h2 className="mt-3 text-xl font-medium">{item.title}</h2>
              <p className="mt-4 leading-8 text-white/70">{item.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
