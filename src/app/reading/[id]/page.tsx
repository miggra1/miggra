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
  const item = await prisma.contentItem.findFirst({ where: { id, section: "READING" } });
  if (!item) return { title: "未找到内容" };
  return { title: item.title, description: item.detail };
}

export default async function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "READING" } });
  if (!item) notFound();

  const items = await prisma.contentItem.findMany({ where: { section: "READING", active: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const index = items.findIndex((entry) => entry.id === item.id);
  const prevHref = index > 0 ? `/reading/${items[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < items.length - 1 ? `/reading/${items[index + 1]?.id}` : undefined;
  const related = items
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3)
    .map((entry) => ({ href: `/reading/${entry.id}`, title: entry.title, note: entry.status ?? "Book" }));

  return (
    <ContentDetailShell eyebrow="Reading" title={item.title} meta={item.status ?? item.meta ?? "Book"} backHref="/reading" backLabel="返回书单" listHref="/notes" listLabel="碎碎念">
      <DetailNav prevHref={prevHref} nextHref={nextHref} />
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 leading-8 text-white/75">
        {item.detail}
      </section>
      <RelatedItems title="同系列书单" items={related} />
    </ContentDetailShell>
  );
}
