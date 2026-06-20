import type { Metadata } from "next";
import { listTimelineMilestonesSafe } from "@/lib/timeline";
import { fallbackTimeline } from "@/lib/site-data";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "时间线", description: "这个站是怎么长出来的" };

export default async function TimelinePage() {
  const { milestones } = await listTimelineMilestonesSafe();
  const personal = milestones.filter((m) => m.kind === "PERSONAL");
  const site = milestones.filter((m) => m.kind === "SITE");

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Timeline</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">人生节点</h1>
          <p className="mt-3 text-[var(--muted)]">看这个站是怎么慢慢长出来的。</p>
        </header>

        <div className="space-y-8">
          {[{ title: "人生节点", items: personal }, { title: "站点节点", items: site }].map((group) =>
            group.items.length ? (
              <section key={group.title}>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)] mb-4">{group.title}</p>
                <div className="relative space-y-4 border-l border-[var(--border)] pl-6">
                  {group.items.map((item) => (
                    <article key={item.id} className="relative rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                      <span className="absolute -left-[1.7rem] top-7 h-3 w-3 rounded-full bg-[var(--fg)] shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                      <div className="text-sm uppercase tracking-[0.2em] text-[var(--subtle)]">{item.year}</div>
                      <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                      <p className="mt-3 leading-8 text-[var(--muted)]">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      </div>
    </main>
  );
}
