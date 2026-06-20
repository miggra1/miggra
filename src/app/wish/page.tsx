import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackWishItems } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";
export const metadata: Metadata = { title: "愿望", description: "想做、想体验、想完成的事" };

export default async function WishPage() {
  const { items } = await listContentItemsSafe("WISH");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, href: `/wish/${item.id}` as const }))
    : fallbackWishItems.map((item) => ({ title: item.title, detail: item.detail, status: item.status, href: undefined as string | undefined }));

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Wish List</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">愿望清单</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">想去的地方、想做的事、想成为的样子</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {source.map((item, i) => {
            const content = (
              <div className="card-apple p-6 group cursor-pointer">
                <p className="text-[11px] text-[var(--subtle)] uppercase tracking-widest mb-3">愿望</p>
                <h2 className="text-[20px] font-medium tracking-tight">{item.title}</h2>
                <p className="text-[14px] text-[var(--fg-secondary)] mt-2 leading-relaxed line-clamp-3">{item.detail}</p>
                {item.status && (
                  <span className="inline-block mt-4 text-[12px] text-[var(--fg-secondary)] rounded-full border border-[var(--border)] px-3 py-1">
                    {item.status}
                  </span>
                )}
              </div>
            );
            return item.href ? (
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
