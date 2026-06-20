import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const runtime = "nodejs"; export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "READING" } });
  if (!item) return { title: "未找到" };
  return { title: item.title, description: item.detail };
}

export default async function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "READING" } });
  if (!item) notFound();

  return (
    <main className="min-h-screen"><article className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/reading" className="text-[13px] text-[var(--subtle)] hover:text-[var(--fg)] transition mb-10 inline-block">← 书单</Link>
      {item.status && <p className="text-[13px] text-[var(--fg-secondary)] mb-2">{item.status}</p>}
      <h1 className="text-[32px] font-medium tracking-tight mb-10">{item.title}</h1>
      <div className="text-[16px] leading-[1.8] text-[var(--fg-secondary)] whitespace-pre-wrap">{item.detail}</div>
    </article></main>
  );
}
