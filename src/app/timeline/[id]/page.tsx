import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3).map((entry) => ({ href: `/timeline/${entry.id}`, title: entry.title, note: entry.year }));

  const isPersonal = item.kind === TimelineKind.PERSONAL;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2a2520] text-[#e0d8ce]">
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <a href="/timeline" className="font-mono text-xs text-amber-500/60 hover:text-amber-400 transition">← 回到相册</a>
        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        <article className="mt-6 overflow-hidden rounded-xl border-8 border-stone-700/50 bg-stone-800/80 shadow-2xl">
          {/* 照片式卡片 */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`h-3 w-3 rounded-full border-2 ${isPersonal ? "border-amber-500/60 bg-amber-500/20" : "border-blue-400/60 bg-blue-400/20"} animate-pulse`}
                style={{ boxShadow: isPersonal ? "0 0 12px rgba(245,158,11,0.3)" : "0 0 12px rgba(96,165,250,0.3)" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">
                {isPersonal ? "Personal" : "Site"} · {item.year}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light italic">{item.title}</h1>
            <div className="mt-8 font-mono text-sm leading-8 text-stone-400 whitespace-pre-wrap">{item.detail}</div>

            {/* 照片白边装饰 */}
            <div className="mt-8 border border-stone-700/20 p-2">
              <div className="h-24 bg-gradient-to-br from-stone-700/20 to-stone-700/5 flex items-center justify-center font-mono text-[10px] text-stone-600">
                📷 {item.year}
              </div>
            </div>
          </div>
        </article>

        <RelatedItems title="同类节点" items={related} />
      </div>
    </main>
  );
}
