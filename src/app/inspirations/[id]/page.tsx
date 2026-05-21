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
  const item = await prisma.contentItem.findFirst({ where: { id, section: "INSPIRATION" } });
  if (!item) return { title: "未找到内容" };
  return { title: item.title, description: item.detail };
}

export default async function InspirationsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "INSPIRATION" } });
  if (!item) notFound();

  const items = await prisma.contentItem.findMany({ where: { section: "INSPIRATION", active: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const index = items.findIndex((entry) => entry.id === item.id);
  const prevHref = index > 0 ? `/inspirations/${items[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < items.length - 1 ? `/inspirations/${items[index + 1]?.id}` : undefined;
  const related = items
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3)
    .map((entry) => ({ href: `/inspirations/${entry.id}`, title: entry.title, note: entry.meta ?? "Idea" }));

  return (
    <ContentDetailShell eyebrow="Inspiration" title={item.title} meta={item.meta ?? "Idea"} backHref="/inspirations" backLabel="返回灵感" listHref="/notes" listLabel="碎碎念">
      <DetailNav prevHref={prevHref} nextHref={nextHref} />
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 leading-8 text-white/75">
        {item.detail}
      </section>
      <RelatedItems title="更多灵感" items={related} />
    </ContentDetailShell>
  );
}
