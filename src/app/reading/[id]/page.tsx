import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3).map((entry) => ({ href: `/reading/${entry.id}`, title: entry.title, note: entry.status ?? "Book" }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1a1410] text-[#e8dfd3]">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-400/[0.03] blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <a href="/reading" className="font-mono text-xs text-amber-600/60 hover:text-amber-400 transition">← 回到书房</a>
        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        <article className="mt-6 overflow-hidden rounded-2xl border border-amber-700/15 bg-amber-900/5">
          {/* 书签丝带 */}
          <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-600/70">{item.status ?? item.meta ?? "Book"}</p>
            <h1 className="mt-2 font-serif text-3xl font-light italic tracking-wide">{item.title}</h1>
            <div className="mt-8 font-mono text-sm leading-8 text-amber-600/70 whitespace-pre-wrap">{item.detail}</div>
            <div className="mt-8 border-t border-amber-700/10 pt-4 font-mono text-xs text-amber-700/40">
              添加于 {new Date(item.createdAt).toLocaleString("zh-CN")}
            </div>
          </div>
        </article>

        <RelatedItems title="同系列书单" items={related} />
      </div>
    </main>
  );
}
