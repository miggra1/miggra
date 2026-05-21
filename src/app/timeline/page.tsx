import type { Metadata } from "next";
import { FeaturePageShell } from "../components/feature-page-shell";
import { fallbackTimeline } from "@/lib/site-data";
import { listContentItems } from "@/lib/content";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "时间线",
  description: "查看这个站点是怎么慢慢长出来的。",
};

export default async function TimelinePage() {
  const items = await listContentItems("TIMELINE");
  const source = items.length
    ? items.map((item) => ({ year: item.meta ?? item.status ?? "", title: item.title, description: item.detail, href: `/timeline/${item.id}` }))
    : fallbackTimeline;

  return (
    <FeaturePageShell
      eyebrow="Timeline"
      title="时间线"
      description="把个人站的变化和一些重要节点按年份排起来。"
    >
      <section className="relative space-y-4 border-l border-white/10 pl-6">
        {source.map((item) => (
          <article key={item.year + item.title} className="relative rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <span className="absolute -left-[1.92rem] top-7 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
            <div className="text-sm uppercase tracking-[0.2em] text-white/35">{item.year}</div>
            <h2 className="mt-2 text-xl font-medium">{item.title}</h2>
            <p className="mt-4 leading-8 text-white/70">{item.description}</p>
          </article>
        ))}
      </section>
    </FeaturePageShell>
  );
}
