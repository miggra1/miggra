import type { Metadata } from "next";
import { FeaturePageShell } from "../components/feature-page-shell";
import { FeatureCardGrid } from "../components/feature-card-grid";
import { fallbackReadingList } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "书单",
  description: "整理正在读、读过和想读的书。",
};

export default async function ReadingPage() {
  const { items, dbError } = await listContentItemsSafe("READING");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, meta: item.meta ?? "Book", href: `/reading/${item.id}` }))
    : fallbackReadingList.map((book) => ({ title: book.title, detail: book.detail, status: book.status, meta: "Book" }));

  return (
    <FeaturePageShell
      eyebrow="Reading"
      title="书单"
      description="把正在读、读过和准备读的书放在一起，顺手记一点感受。"
    >
      {dbError ? <DbErrorBanner /> : null}
      <FeatureCardGrid items={source} />
    </FeaturePageShell>
  );
}
