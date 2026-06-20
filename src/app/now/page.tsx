import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackNowItems } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";
export const metadata: Metadata = { title: "Now", description: "此刻在做什么" };

export default async function NowPage() {
  const { items } = await listContentItemsSafe("NOW");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, meta: item.meta ?? "Current", href: `/now/${item.id}` }))
    : fallbackNowItems.map((text, i) => ({ title: `状态 ${i + 1}`, detail: text, meta: "Current", href: "/now" }));

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
            <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Live</p>
          </div>
          <h1 className="text-[32px] font-medium tracking-tight">此刻</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">最近在做什么、在学什么、在想什么</p>
        </header>

        <div className="space-y-1">
          {source.map((item, i) => {
            const content = (
              <div className="flex items-start gap-4 px-4 py-3.5 rounded-lg transition hover:bg-[var(--card)]">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--border)]" />
                <div>
                  <h2 className="text-[17px] font-medium">{item.title}</h2>
                  <p className="text-[14px] text-[var(--fg-secondary)] mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
            return item.href && items.length ? (
              <Link key={item.href} href={item.href}>{content}</Link>
            ) : (
              <div key={`${item.title}-${i}`}>{content}</div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
