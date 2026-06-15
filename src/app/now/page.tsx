import type { Metadata } from "next";
import Link from "next/link";
import { FeaturePageShell } from "../components/feature-page-shell";
import { FeatureCardGrid } from "../components/feature-card-grid";
import { fallbackNowItems } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Now",
  description: "记录我最近在做什么、在学什么和在想什么。",
};

export default async function NowPage() {
  const { items, dbError } = await listContentItemsSafe("NOW");
  const source = items.length
    ? items.map((item) => ({
        title: item.title,
        detail: item.detail,
        meta: item.meta ?? "Current",
        href: `/now/${item.id}`,
      }))
    : fallbackNowItems.map((item, index) => ({ title: `状态 ${index + 1}`, detail: item, meta: "Current", href: "/now" }));

  return (
    <FeaturePageShell eyebrow="Now" title="我最近在做什么" description="这是一个轻量的状态页，记录当下的学习、工作和生活节奏。">
      {dbError ? <DbErrorBanner /> : null}
      <FeatureCardGrid items={source} />
    </FeaturePageShell>
  );
}
