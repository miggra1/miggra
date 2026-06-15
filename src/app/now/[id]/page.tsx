import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailShell } from "../../components/content-detail-shell";
import { DetailNav } from "../../components/detail-nav";
import { RelatedItems } from "../../components/related-items";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "NOW" } });
  if (!item) return { title: "未找到内容" };
  return { title: item.title, description: item.detail };
}

export default async function NowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "NOW" } });
  if (!item) notFound();

  const items = await prisma.contentItem.findMany({ where: { section: "NOW", active: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const index = items.findIndex((entry) => entry.id === item.id);
  const prevHref = index > 0 ? `/now/${items[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < items.length - 1 ? `/now/${items[index + 1]?.id}` : undefined;
  const related = items
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3)
    .map((entry) => ({ href: `/now/${entry.id}`, title: entry.title, note: entry.meta ?? "Current" }));

  return (
    <ContentDetailShell eyebrow="Now" title={item.title} meta={item.meta ?? "Current"} backHref="/now" backLabel="返回 Now" listHref="/notes" listLabel="碎碎念">
      <DetailNav prevHref={prevHref} nextHref={nextHref} />
      <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 leading-8 text-[var(--muted)]">
        {item.detail}
      </section>
      <RelatedItems title="更多状态" items={related} />
    </ContentDetailShell>
  );
}
