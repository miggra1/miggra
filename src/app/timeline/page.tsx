import type { Metadata } from "next";
import { listTimelineMilestonesSafe } from "@/lib/timeline";
import { fallbackTimeline } from "@/lib/site-data";
import Link from "next/link";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "时间线", description: "这个站是怎么长出来的" };

export default async function TimelinePage() {
  const { milestones } = await listTimelineMilestonesSafe();
  const personal = milestones.filter((m) => m.kind === "PERSONAL");
  const site = milestones.filter((m) => m.kind === "SITE");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Timeline</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">时间线</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">看这个站是怎么慢慢长出来的</p>
        </header>

        <div className="relative pl-8 border-l border-[var(--border)]">
          {[...personal, ...site].map((item, i) => (
            <div key={item.id} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[calc(2rem+4px)] top-1 h-3 w-3 rounded-full border-2 border-[var(--border)] bg-[var(--bg)]" />
              <span className="text-[13px] text-[var(--fg-secondary)]">{item.year}</span>
              <h2 className="text-[17px] font-medium mt-1">{item.title}</h2>
              <p className="text-[14px] text-[var(--fg-secondary)] mt-2 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
