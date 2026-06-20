import type { Metadata } from "next";
import { fallbackTimeline } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { listTimelineMilestonesSafe } from "@/lib/timeline";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "时间线",
  description: "查看这个站点是怎么慢慢长出来的。",
};

export default async function TimelinePage() {
  const { items: contentItems, dbError: contentDbError } = await listContentItemsSafe("TIMELINE");
  const { milestones, dbError: milestonesDbError } = await listTimelineMilestonesSafe();
  const dbError = contentDbError || milestonesDbError;

  const source = contentItems.length
    ? contentItems.map((item) => ({ year: item.meta ?? item.status ?? "", title: item.title, description: item.detail, href: `/timeline/${item.id}` }))
    : fallbackTimeline;

  const personal = milestones.filter((item) => item.kind === "PERSONAL");
  const site = milestones.filter((item) => item.kind === "SITE");

  return (
    /* ── 老照片相册风：暖灰底 + 相框卡片 + 胶片齿孔 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#2a2520] text-[#e0d8ce]">
      {/* 相册纹理 */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {dbError ? <DbErrorBanner /> : null}

        <header className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/50">Photo Album</p>
          <h1 className="mt-2 font-serif text-4xl font-light italic tracking-wide">时间相册</h1>
          <p className="mt-2 font-mono text-sm text-stone-500">翻看这个站是怎么慢慢长出来的</p>
        </header>

        {/* ── 人生节点 ── */}
        {personal.length ? (
          <section className="mb-12">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/60">Personal · 人生节点</p>
            <div className="relative space-y-6 border-l-2 border-dashed border-amber-700/30 pl-8">
              {personal.map((item) => (
                <article key={item.id} className="group relative rounded-xl border border-stone-700/30 bg-stone-800/50 p-5 transition hover:border-amber-600/30 hover:bg-stone-800/70">
                  {/* 胶片齿孔 */}
                  <div className="absolute -left-[2.15rem] top-6 flex flex-col gap-1.5">
                    <div className="h-1 w-1.5 rounded-sm bg-stone-600" />
                    <div className="h-1 w-1.5 rounded-sm bg-stone-600" />
                  </div>
                  {/* 光圈节点 */}
                  <div className="absolute -left-[2.5rem] top-7 h-2.5 w-2.5 rounded-full border-2 border-amber-500/50 bg-stone-800 animate-pulse" style={{ boxShadow: "0 0 12px rgba(245,158,11,0.3)" }} />
                  <div className="font-mono text-xs text-amber-500/70">{item.year}</div>
                  <h2 className="mt-2 font-serif text-lg font-medium">{item.title}</h2>
                  <p className="mt-2 font-mono text-sm leading-7 text-stone-400">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── 站点节点 ── */}
        {site.length ? (
          <section className="mb-12">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400/60">Site · 站点节点</p>
            <div className="relative space-y-6 border-l-2 border-dashed border-blue-700/30 pl-8">
              {site.map((item) => (
                <article key={item.id} className="group relative rounded-xl border border-stone-700/30 bg-stone-800/50 p-5 transition hover:border-blue-600/30 hover:bg-stone-800/70">
                  <div className="absolute -left-[2.15rem] top-6 flex flex-col gap-1.5">
                    <div className="h-1 w-1.5 rounded-sm bg-stone-600" />
                    <div className="h-1 w-1.5 rounded-sm bg-stone-600" />
                  </div>
                  <div className="absolute -left-[2.5rem] top-7 h-2.5 w-2.5 rounded-full border-2 border-blue-400/50 bg-stone-800 animate-pulse" style={{ boxShadow: "0 0 12px rgba(96,165,250,0.3)" }} />
                  <div className="font-mono text-xs text-blue-400/70">{item.year}</div>
                  <h2 className="mt-2 font-serif text-lg font-medium">{item.title}</h2>
                  <p className="mt-2 font-mono text-sm leading-7 text-stone-400">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
