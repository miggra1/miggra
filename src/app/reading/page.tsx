import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackReadingList } from "@/lib/site-data";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "书单", description: "在读、读过、想读的书" };

const statusColors: Record<string, string> = { "已读完": "text-emerald-400", "在读": "text-amber-400", "想读": "text-blue-400" };

export default async function ReadingPage() {
  const { items } = await listContentItemsSafe("READING");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, href: `/reading/${item.id}` as const }))
    : fallbackReadingList.map((b) => ({ title: b.title, detail: b.detail, status: b.status, href: undefined as string | undefined }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--amber)]">Reading</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">书单</h1>
          <p className="mt-3 text-[var(--muted)]">整理正在读、读过和想读的书。</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {source.map((item, i) => {
            const content = (
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 card-interactive animate-in">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  {item.status && <span className={`rounded-full border border-[var(--border)] px-3 py-1 text-sm ${statusColors[item.status] ?? "text-[var(--muted)]"}`}>{item.status}</span>}
                </div>
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
