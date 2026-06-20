import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const runtime = "nodejs";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "NOW" } });
  if (!item) return { title: "未找到" };
  return { title: item.title, description: item.detail };
}

export default async function NowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "NOW" } });
  if (!item) notFound();

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/now" className="text-[13px] text-[var(--subtle)] hover:text-[var(--fg)] transition mb-10 inline-block">← 此刻</Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
          <span className="text-[13px] text-[var(--fg-secondary)]">{item.meta ?? "Current"}</span>
        </div>
        <h1 className="text-[32px] font-medium tracking-tight mb-10">{item.title}</h1>
        <div className="text-[16px] leading-[1.8] text-[var(--fg-secondary)] whitespace-pre-wrap">{item.detail}</div>
      </article>
    </main>
  );
}
