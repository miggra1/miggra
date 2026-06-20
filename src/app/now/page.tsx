import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackNowItems } from "@/lib/site-data";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "Now", description: "此刻在做什么" };

export default async function NowPage() {
  const { items } = await listContentItemsSafe("NOW");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, meta: item.meta ?? "Current", href: `/now/${item.id}` }))
    : fallbackNowItems.map((text, i) => ({ title: `状态 ${i + 1}`, detail: text, meta: "Current", href: undefined as string | undefined }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Now</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">我最近在做什么</h1>
          <p className="mt-3 text-[var(--muted)]">记录当下的学习、工作和生活节奏。</p>
        </header>

        <div className="grid gap-4">
          {source.map((item, i) => {
            const content = (
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.meta}</p>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 leading-8 text-[var(--muted)]">{item.detail}</p>
              </div>
            );
            return item.href ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
