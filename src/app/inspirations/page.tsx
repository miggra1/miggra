import type { Metadata } from "next";
import { FeaturePageShell } from "../components/feature-page-shell";
import { fallbackInspirations } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";
import { InspirationsClient } from "./inspirations-client";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "灵感收集",
  description: "收集点子、备忘和灵感碎片。",
};

export default async function InspirationsPage() {
  const { items, dbError } = await listContentItemsSafe("INSPIRATION");
  const source = items.length
    ? items.map((item, index) => ({
        title: item.title,
        detail: item.detail,
        meta: item.meta ?? (index % 2 === 0 ? "灵感" : "便签"),
        status: item.status ?? undefined,
        href: `/inspirations/${item.id}`,
      }))
    : fallbackInspirations.map((item, index) => ({
        title: item.title,
        detail: item.detail,
        meta: index % 2 === 0 ? item.meta : "便签",
        pinned: index === 0,
      }));

  return (
    <FeaturePageShell eyebrow="Inspiration" title="灵感墙" description="把脑子里突然冒出来的想法先放进来，之后再慢慢整理。">
      {dbError ? <DbErrorBanner /> : null}
      <InspirationsClient items={source} />
    </FeaturePageShell>
  );
}
