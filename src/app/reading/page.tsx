import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { listContentItemsSafe } from "@/lib/content";
import { sectionIdentity } from "@/lib/section-identity";
import { fallbackReadingList } from "@/lib/site-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "书单", description: "在读、读过、想读的书" };

const tone = sectionIdentity.reading;
const statusColors: Record<string, string> = { "已读完": "text-emerald-300", "在读": "text-amber-200", "想读": "text-blue-300" };

function hrefForStatus(status?: string) {
  return status ? `/reading?status=${encodeURIComponent(status)}` : "/reading";
}

export default async function ReadingPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const selectedStatus = params?.status;
  const { items } = await listContentItemsSafe("READING");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, href: `/reading/${item.id}` as const }))
    : fallbackReadingList.map((b) => ({ title: b.title, detail: b.detail, status: b.status, href: undefined as string | undefined }));
  const statuses = Array.from(new Set(source.map((item) => item.status).filter(Boolean) as string[]));
  const filtered = selectedStatus ? source.filter((item) => item.status === selectedStatus) : source;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className={`text-sm uppercase tracking-[0.3em] ${tone.eyebrowClass}`}>Reading</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">书单</h1>
          <p className="mt-3 text-[var(--muted)]">整理正在读、读过和想读的书。</p>
        </header>
        {statuses.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href={hrefForStatus()} className={`rounded-full border px-4 py-2 text-sm transition ${!selectedStatus ? `${tone.badgeClass}` : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>全部</Link>
            {statuses.map((status) => (
              <Link key={status} href={hrefForStatus(status)} className={`rounded-full border px-4 py-2 text-sm transition ${selectedStatus === status ? `${tone.badgeClass}` : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>{status}</Link>
            ))}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, i) => {
            const content = (
              <div className={`rounded-[1.5rem] border bg-[var(--card)] p-6 card-interactive animate-in ${tone.borderClass} ${tone.hoverClass}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  {item.status ? <span className={`rounded-full border px-3 py-1 text-sm ${tone.borderClass} ${tone.softClass} ${statusColors[item.status] ?? tone.textClass}`}>{item.status}</span> : null}
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
