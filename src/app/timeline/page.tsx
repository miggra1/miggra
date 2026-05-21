import { travelTimeline } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Timeline</p>
          <h1 className="mt-3 text-3xl font-semibold">时间线</h1>
          <p className="mt-3 text-white/65">把个人站的变化和一些重要节点按年份排起来。</p>
        </header>

        <section className="relative space-y-4 border-l border-white/10 pl-6">
          {travelTimeline.map((item) => (
            <article key={item.year + item.title} className="relative rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
              <div className="text-sm uppercase tracking-[0.2em] text-white/35">{item.year}</div>
              <h2 className="mt-2 text-xl font-medium">{item.title}</h2>
              <p className="mt-4 leading-8 text-white/70">{item.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
