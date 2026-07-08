import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackNowItems } from "@/lib/site-data";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "Now", description: "此刻在做什么" };

function hrefForMeta(meta?: string) {
  return meta ? `/now?type=${encodeURIComponent(meta)}` : "/now";
}

export default async function NowPage({ searchParams }: { searchParams?: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const selectedMeta = params?.type;
  const { items } = await listContentItemsSafe("NOW");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, meta: item.meta ?? "Current", href: `/now/${item.id}` }))
    : fallbackNowItems.map((text, i) => ({ title: `状态 ${i + 1}`, detail: text, meta: "Current", href: undefined as string | undefined }));
  const metas = Array.from(new Set(source.map((item) => item.meta).filter(Boolean)));
  const filtered = selectedMeta ? source.filter((item) => item.meta === selectedMeta) : source;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--green)]">Now</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">我最近在做什么</h1>
          <p className="mt-3 text-[var(--muted)]">记录当下的学习、工作和生活节奏。</p>
        </header>

        {metas.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href={hrefForMeta()} className={`rounded-full border px-4 py-2 text-sm transition ${!selectedMeta ? "border-[var(--accent)] bg-[var(--card-strong)] text-[var(--fg)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>全部</Link>
            {metas.map((meta) => (
              <Link key={meta} href={hrefForMeta(meta)} className={`rounded-full border px-4 py-2 text-sm transition ${selectedMeta === meta ? "border-[var(--accent)] bg-[var(--card-strong)] text-[var(--fg)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>{meta}</Link>
            ))}
          </div>
        )}

        <div className="grid gap-4">
          {filtered.map((item, i) => {
            const content = (
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 card-interactive animate-in" style={{ animationDelay: `${i * 60}ms` }}>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.meta}</p>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <div className="mt-3 line-clamp-3">
                <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
              </div>
              </div>
            );
            return item.href ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
