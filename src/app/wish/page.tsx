import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackWishItems } from "@/lib/site-data";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60; export const runtime = "nodejs";
export const metadata: Metadata = { title: "愿望清单", description: "想做、想体验的事" };

export default async function WishPage() {
  const { items } = await listContentItemsSafe("WISH");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status, href: `/wish/${item.id}` }))
    : fallbackWishItems.map((item) => ({ title: item.title, detail: item.detail, status: item.status, href: undefined as string | undefined }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Wish list</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">愿望清单</h1>
          <p className="mt-3 text-[var(--muted)]">一些想完成、想体验、想拥有的事。</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {source.map((item, i) => {
            const content = (
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">愿望</p>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <div className="mt-3 line-clamp-3">
                <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
              </div>
                {item.status && <span className="inline-block mt-4 rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]">{item.status}</span>}
              </div>
            );
            return item.href ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
