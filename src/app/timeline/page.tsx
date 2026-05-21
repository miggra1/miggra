import type { Metadata } from "next";
import { FeaturePageShell } from "../components/feature-page-shell";
import { fallbackTimeline } from "@/lib/site-data";
import { listContentItems } from "@/lib/content";
import { listTimelineMilestones } from "@/lib/timeline";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "时间线",
  description: "查看这个站点是怎么慢慢长出来的。",
};

export default async function TimelinePage() {
  const contentItems = await listContentItems("TIMELINE");
  const milestones = await listTimelineMilestones();
  const source = contentItems.length
    ? contentItems.map((item) => ({
        year: item.meta ?? item.status ?? "",
        title: item.title,
        description: item.detail,
        href: `/timeline/${item.id}`,
      }))
    : fallbackTimeline;

  const personal = milestones.filter((item) => item.kind === "PERSONAL");
  const site = milestones.filter((item) => item.kind === "SITE");

  return (
    <FeaturePageShell eyebrow="Timeline" title="人生节点" description="把个人站的变化和一些重要节点按年份排起来。">
      <div className="space-y-10">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Personal</p>
              <h2 className="mt-2 text-2xl font-semibold">人生节点</h2>
            </div>
          </div>
          <div className="relative space-y-4 border-l border-[var(--border)] pl-6">
            {personal.map((item) => (
              <article key={item.id} className="relative rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-[var(--fg)] shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="text-sm uppercase tracking-[0.2em] text-[var(--subtle)]">{item.year}</div>
                <h2 className="mt-2 text-xl font-medium">{item.title}</h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Site</p>
              <h2 className="mt-2 text-2xl font-semibold">站点节点</h2>
            </div>
          </div>
          <div className="relative space-y-4 border-l border-[var(--border)] pl-6">
            {site.map((item) => (
              <article key={item.id} className="relative rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-[var(--fg)] shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="text-sm uppercase tracking-[0.2em] text-[var(--subtle)]">{item.year}</div>
                <h2 className="mt-2 text-xl font-medium">{item.title}</h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Legacy</p>
              <h2 className="mt-2 text-2xl font-semibold">旧时间线数据</h2>
            </div>
          </div>
          <div className="relative space-y-4 border-l border-[var(--border)] pl-6">
            {source.map((item) => (
              <article key={item.year + item.title} className="relative rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-[var(--fg)] shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="text-sm uppercase tracking-[0.2em] text-[var(--subtle)]">{item.year}</div>
                <h2 className="mt-2 text-xl font-medium">{item.title}</h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </FeaturePageShell>
  );
}
