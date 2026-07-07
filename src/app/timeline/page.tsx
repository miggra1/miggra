import type { Metadata } from "next";
import { listTimelineMilestonesSafe } from "@/lib/timeline";
import { fallbackTimeline } from "@/lib/site-data";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "时间线", description: "这个站是怎么长出来的" };

export default async function TimelinePage() {
  const { milestones } = await listTimelineMilestonesSafe();
  const personal = milestones.filter((m) => m.kind === "PERSONAL");
  const site = milestones.filter((m) => m.kind === "SITE");

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--cyan)]">Timeline</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">人生节点</h1>
          <p className="mt-3 text-[var(--muted)]">看这个站是怎么慢慢长出来的。</p>
        </header>

        <div className="space-y-10">
          {[{ title: "人生节点", items: personal }, { title: "站点节点", items: site }].map((group) =>
            group.items.length ? (
              <section key={group.title}>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--cyan)] mb-6">{group.title}</p>
                <div className="relative space-y-6 border-l-2 border-[var(--cyan)]/30 pl-8">
                  {group.items.map((item, i) => (
                    <article key={item.id} className="relative rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 card-interactive animate-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="absolute -left-[2.1rem] top-6 h-4 w-4 rounded-full bg-[var(--cyan)] ring-4 ring-[var(--bg)] shadow-[0_0_16px_var(--cyan)]" />
                      <div className="text-2xl font-bold text-[var(--cyan)]/80 tracking-tight">{item.year}</div>
                      <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                      <div className="mt-3 line-clamp-3">
                        <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
                      </div>
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
