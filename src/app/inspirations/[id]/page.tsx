import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3).map((entry) => ({ href: `/inspirations/${entry.id}`, title: entry.title, note: entry.meta ?? "Idea" }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#c4a87c] text-[#3d3027]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.1) 2px, rgba(139,90,43,0.1) 3px)" }} />
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <a href="/inspirations" className="font-mono text-xs text-amber-900/60 hover:text-amber-800 transition">← 回到软木板</a>
        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        <article className="mt-6 -rotate-[0.3deg] rounded-md border-2 border-amber-400/40 bg-yellow-100 p-8 shadow-xl">
          <div className="flex justify-center">
            <div className="-mt-12 mb-4 h-5 w-5 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-md ring-1 ring-red-300" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-600/70">{item.meta ?? "Idea"}</p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-amber-950">{item.title}</h1>
          <div className="mt-6 font-mono text-sm leading-7 text-amber-800/70 whitespace-pre-wrap">{item.detail}</div>
          {item.status ? (
            <div className="mt-5 inline-flex rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 font-mono text-xs text-amber-600">{item.status}</div>
          ) : null}
        </article>

        <RelatedItems title="更多灵感" items={related} />
      </div>
    </main>
  );
}
