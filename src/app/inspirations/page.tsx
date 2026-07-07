import type { Metadata } from "next";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackInspirations } from "@/lib/site-data";
import { InspirationsClient } from "./inspirations-client";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "灵感", description: "点子、备忘和灵感碎片" };

export default async function InspirationsPage() {
  const { items } = await listContentItemsSafe("INSPIRATION");
  const source = items.length
    ? items.map((item, i) => ({ id: item.id, title: item.title, detail: item.detail, meta: item.meta ?? (i % 2 === 0 ? "灵感" : "便签"), href: `/inspirations/${item.id}` }))
    : fallbackInspirations.map((item, i) => ({ title: item.title, detail: item.detail, meta: i % 2 === 0 ? item.meta : "便签", pinned: i === 0 }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--pink)]">Inspiration</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">灵感墙</h1>
          <p className="mt-3 text-[var(--muted)]">把脑子里突然冒出来的想法先放进来，之后再慢慢整理。</p>
        </header>
        <InspirationsClient items={source} />
      </div>
    </main>
  );
}
