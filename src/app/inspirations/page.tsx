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
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Ideas</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">灵感</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">脑子里冒出来的东西，趁热存下来</p>
        </header>
        <InspirationsClient items={source} />
      </div>
    </main>
  );
}
