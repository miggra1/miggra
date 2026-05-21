import type { Metadata } from "next";
import { FeaturePageShell } from "../components/feature-page-shell";
import { FeatureCardGrid } from "../components/feature-card-grid";
import { fallbackInspirations } from "@/lib/site-data";
import { listContentItems } from "@/lib/content";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "灵感收集",
  description: "收集点子、备忘和灵感碎片。",
};

export default async function InspirationsPage() {
  const items = await listContentItems("INSPIRATION");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, meta: item.meta ?? "Idea", href: `/inspirations/${item.id}` }))
    : fallbackInspirations.map((item) => ({ title: item.title, detail: item.detail, meta: item.meta }));

  return (
    <FeaturePageShell
      eyebrow="Inspiration"
      title="灵感收集页"
      description="把脑子里突然冒出来的想法先放进来，之后再慢慢整理。"
    >
      <FeatureCardGrid items={source} />
    </FeaturePageShell>
  );
}
