import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const runtime = "nodejs"; export const revalidate = 60;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.timelineMilestone.findFirst({ where: { id } });
  if (!item) return { title: "未找到" };
  return { title: item.title, description: item.detail };
}

export default async function TimelineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.timelineMilestone.findFirst({ where: { id } });
  if (!item) notFound();
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/timeline" className="inline-block mb-8 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--subtle)] transition hover:bg-[var(--card-strong)]">← 返回时间线</Link>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">{item.kind === "PERSONAL" ? "人生节点" : "站点节点"}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">{item.year} · {item.kind === "PERSONAL" ? "个人经历" : "站点变化"}</p>
          <div className="mt-8">
            <MarkdownRenderer>{item.detail}</MarkdownRenderer>
          </div>
        </div>
      </article>
    </main>
  );
}
