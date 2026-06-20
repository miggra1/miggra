import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailNav } from "../../components/detail-nav";
import { RelatedItems } from "../../components/related-items";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "WISH" } });
  if (!item) return { title: "未找到内容" };
  return { title: item.title, description: item.detail };
}

export default async function WishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "WISH" } });
  if (!item) notFound();

  const items = await prisma.contentItem.findMany({ where: { section: "WISH", active: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const index = items.findIndex((entry) => entry.id === item.id);
  const prevHref = index > 0 ? `/wish/${items[index - 1]?.id}` : undefined;
  const nextHref = index >= 0 && index < items.length - 1 ? `/wish/${items[index + 1]?.id}` : undefined;
  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3).map((entry) => ({ href: `/wish/${entry.id}`, title: entry.title, note: entry.status ?? "Goal" }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#12102a] to-[#1a1040] text-[#e8e0f0]">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 60% 20%, rgba(200,180,255,0.5), transparent), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.4), transparent)" }} />
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <a href="/wish" className="font-mono text-xs text-violet-400/60 hover:text-violet-300 transition">← 回到星空</a>
        <DetailNav prevHref={prevHref} nextHref={nextHref} />

        <article className="mt-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl" style={{ boxShadow: "0 30px 80px rgba(160,140,220,0.1)" }}>
          <div className="text-center mb-6">
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400/50">{item.meta ?? "Wish"}</p>
          <h1 className="mt-2 text-center font-serif text-3xl font-light tracking-wide">{item.title}</h1>
          {item.status ? (
            <div className="mt-4 flex justify-center">
              <span className="rounded-full border border-violet-400/15 bg-violet-400/5 px-4 py-1.5 font-mono text-xs text-violet-300/70">{item.status}</span>
            </div>
          ) : null}
          <div className="mt-8 font-mono text-sm leading-8 text-violet-200/60 whitespace-pre-wrap">{item.detail}</div>
        </article>

        <RelatedItems title="其他愿望" items={related} />
      </div>
    </main>
  );
}
