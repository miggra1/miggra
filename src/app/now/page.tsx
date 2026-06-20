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
    : fallbackNowItems.map((text, i) => ({ title: `状态 ${i + 1}`, detail: text, meta: "Current", href: "/now" }));

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12 animate-in">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-40" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--green)]" />
            </span>
            <p className="text-[11px] uppercase tracking-widest text-[var(--green)] font-medium">Live</p>
          </div>
          <h1 className="text-[36px] font-semibold mt-2 tracking-tight">此刻</h1>
          <p className="text-[var(--fg-secondary)] mt-2 text-sm">最近在做什么、在学什么、在想什么</p>
        </header>

        <div className="space-y-1">
          {source.map((item, i) => {
            const content = (
              <div className="flex items-start gap-4 px-4 py-4 surface-hover rounded-lg animate-in" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--border-strong)]" />
                <div>
                  <h2 className="text-[17px] font-semibold">{item.title}</h2>
                  <p className="text-[14px] text-[var(--fg-secondary)] mt-1.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
            return item.href && items.length ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
