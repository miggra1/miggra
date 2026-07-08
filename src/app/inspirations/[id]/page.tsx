import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { ContinueReading } from "@/app/components/continue-reading";

export const runtime = "nodejs"; export const revalidate = 60;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "INSPIRATION" } });
  if (!item) return { title: "未找到" };
  return { title: item.title, description: item.detail };
}

export default async function InspirationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "INSPIRATION" } });
  if (!item) notFound();
  const siblings = await prisma.contentItem.findMany({
    where: { section: "INSPIRATION", active: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  const index = siblings.findIndex((entry) => entry.id === id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  const related = siblings.filter((entry) => entry.id !== id).slice(0, 3).map((entry) => ({ href: `/inspirations/${entry.id}`, title: entry.title, note: entry.meta ?? "灵感" }));
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/inspirations" className="inline-block mb-8 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--subtle)] transition hover:bg-[var(--card-strong)]">← 返回灵感</Link>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">{item.meta ?? "Idea"}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
          <div className="mt-8">
            <MarkdownRenderer>{item.detail}</MarkdownRenderer>
          </div>
        </div>
        <ContinueReading
          prev={prev ? { href: `/inspirations/${prev.id}`, title: prev.title, note: prev.meta ?? "灵感" } : null}
          next={next ? { href: `/inspirations/${next.id}`, title: next.title, note: next.meta ?? "灵感" } : null}
          related={related}
          listHref="/inspirations"
          listLabel="返回灵感墙"
        />
      </article>
    </main>
  );
}
