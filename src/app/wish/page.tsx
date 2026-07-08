import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { listContentItemsSafe } from "@/lib/content";
import { sectionIdentity } from "@/lib/section-identity";
import { fallbackWishItems } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";
export const metadata: Metadata = { title: "愿望清单", description: "想做、想体验的事" };

const tone = sectionIdentity.wish;

function hrefForStatus(status?: string) {
  return status ? `/wish?status=${encodeURIComponent(status)}` : "/wish";
}

export default async function WishPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const selectedStatus = params?.status;
  const { items } = await listContentItemsSafe("WISH");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status, href: `/wish/${item.id}` }))
    : fallbackWishItems.map((item) => ({ title: item.title, detail: item.detail, status: item.status, href: undefined as string | undefined }));
  const statuses = Array.from(new Set(source.map((item) => item.status).filter(Boolean) as string[]));
  const filtered = selectedStatus ? source.filter((item) => item.status === selectedStatus) : source;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className={`text-sm uppercase tracking-[0.3em] ${tone.eyebrowClass}`}>Wish list</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">愿望清单</h1>
          <p className="mt-3 text-[var(--muted)]">一些想完成、想体验、想拥有的事。</p>
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
                <p className={`text-xs uppercase tracking-[0.2em] ${tone.eyebrowClass}`}>愿望</p>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <div className="mt-3 line-clamp-3">
                  <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
                </div>
                {item.status ? <span className={`mt-4 inline-block rounded-full border px-3 py-1 text-sm ${tone.badgeClass}`}>{item.status}</span> : null}
              </div>
            );
            return item.href ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
