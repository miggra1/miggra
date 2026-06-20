import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe } from "@/lib/content";
import { fallbackReadingList } from "@/lib/site-data";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "书单", description: "在读、读过、想读的书" };

export default async function ReadingPage() {
  const { items } = await listContentItemsSafe("READING");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, href: `/reading/${item.id}` as const }))
    : fallbackReadingList.map((b) => ({ title: b.title, detail: b.detail, status: b.status, href: undefined as string | undefined }));

  const statusColor: Record<string, string> = { "已读完": "var(--green)", "在读": "var(--amber)", "想读": "var(--subtle)" };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Library</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">书单</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">书不需要读完才值得被记下来</p>
        </header>

        <div className="space-y-3">
          {source.map((item, i) => {
            const dot = statusColor[item.status ?? ""] ?? "var(--subtle)";
            const content = (
              <div className="flex items-start gap-5 card-apple p-5 group cursor-pointer">
                <div className="w-10 h-14 shrink-0 rounded-md flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: dot, color: "white", opacity: 0.3 }} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-medium">{item.title}</h2>
                  <p className="text-[14px] text-[var(--fg-secondary)] mt-1 line-clamp-2 leading-relaxed">{item.detail}</p>
                </div>
                {item.status && (
                  <span className="shrink-0 text-[12px] text-[var(--fg-secondary)] mt-1">{item.status}</span>
                )}
              </div>
            );
            return item.href ? <Link key={item.href} href={item.href}>{content}</Link> : <div key={`${item.title}-${i}`}>{content}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
