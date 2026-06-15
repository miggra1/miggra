import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailShell } from "../../components/content-detail-shell";
import { DetailNav } from "../../components/detail-nav";
import { RelatedItems } from "../../components/related-items";
import { prisma } from "@/lib/prisma";
import { TimelineKind } from "@prisma/client";

export const runtime = "nodejs";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.timelineMilestone.findFirst({ where: { id } });
  if (!item) return { title: "未找到节点" };
  return { title: item.title, description: item.detail };
}

export default async function TimelineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.timelineMilestone.findFirst({ where: { id } });
  if (!item) notFound();

  const items = await prisma.timelineMilestone.findMany({ where: { active: true, kind: item.kind }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const index = items.findIndex((entry) => entry.id === item.id);
  const prevHref = index > 0 ? `/timeline/${items[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < items.length - 1 ? `/timeline/${items[index + 1]?.id}` : undefined;
  const related = items
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3)
    .map((entry) => ({ href: `/timeline/${entry.id}`, title: entry.title, note: entry.year }));

  return (
    <ContentDetailShell
      eyebrow={item.kind === TimelineKind.PERSONAL ? "人生节点" : "站点节点"}
      title={item.title}
      meta={`${item.year} · ${item.kind === TimelineKind.PERSONAL ? "个人经历" : "站点变化"}`}
      backHref="/timeline"
      backLabel="返回时间线"
      listHref="/notes"
      listLabel="碎碎念"
    >
      <DetailNav prevHref={prevHref} nextHref={nextHref} />
      <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 leading-8 text-[var(--muted)]">
        {item.detail}
      </section>
      <RelatedItems title="同类节点" items={related} />
    </ContentDetailShell>
  );
}
