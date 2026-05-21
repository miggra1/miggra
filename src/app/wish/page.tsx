import type { Metadata } from "next";
import Link from "next/link";
import { FeaturePageShell } from "../components/feature-page-shell";
import { FeatureCardGrid } from "../components/feature-card-grid";
import { fallbackWishItems } from "@/lib/site-data";
import { listContentItems } from "@/lib/content";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "愿望清单",
  description: "记录我想完成、想体验和想拥有的事。",
};

export default async function WishPage() {
  const items = await listContentItems("WISH");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, meta: item.meta ?? "Goal" }))
    : fallbackWishItems.map((item) => ({ title: item.title, detail: item.detail, status: item.status, meta: "Goal" }));

  return (
    <FeaturePageShell
      eyebrow="Wish list"
      title="愿望清单"
      description="一些想完成、想体验、想拥有的事情。它们会慢慢被更新掉。"
    >
      <FeatureCardGrid columns={2} items={source} />
    </FeaturePageShell>
  );
}
