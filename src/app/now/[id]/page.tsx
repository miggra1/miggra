import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3).map((entry) => ({ href: `/now/${entry.id}`, title: entry.title, note: entry.meta ?? "Current" }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0c] text-[#d4d4d8]">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs text-zinc-600">
          <a href="/now" className="hover:text-blue-400 transition">← cd ..</a>
          <span>/</span>
          <span className="text-zinc-400">{item.id.slice(0, 8)}</span>
        </div>

        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        <article className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">{item.meta ?? "Current"}</p>
          </div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight">{item.title}</h1>
          <div className="mt-6 font-mono text-sm leading-7 text-zinc-400 whitespace-pre-wrap">{item.detail}</div>
          <div className="mt-8 pt-6 border-t border-white/[0.04] font-mono text-[10px] text-zinc-700">
            last updated: {new Date(item.updatedAt).toISOString()}
          </div>
        </article>

        <RelatedItems title="更多状态" items={related} />
      </div>
    </main>
  );
}
