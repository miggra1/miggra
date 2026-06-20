import type { Metadata } from "next";
import Link from "next/link";
import { fallbackReadingList } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "书单",
  description: "整理正在读、读过和想读的书。",
};

export default async function ReadingPage() {
  const { items, dbError } = await listContentItemsSafe("READING");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, meta: item.meta ?? "Book", href: `/reading/${item.id}` as const }))
    : fallbackReadingList.map((book) => ({ title: book.title, detail: book.detail, status: book.status, meta: "Book", href: undefined as string | undefined }));

  const statusPalette: Record<string, { bg: string; spine: string; label: string }> = {
    "已读完": { bg: "#1a3a2a", spine: "#2d6a4f", label: "已读完" },
    "在读": { bg: "#3a2a1a", spine: "#b8763b", label: "在读" },
    "想读": { bg: "#1a1a2a", spine: "#4a6a8a", label: "想读" },
  };

  return (
    /* ── 旧书房风：暖棕底 + 书脊卡片 + 窗边光斑 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#1a1410] text-[#e8dfd3]">
      {/* 光斑（阳光透过窗户） */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/[0.04] blur-3xl" />
      <div className="absolute top-20 right-20 h-80 w-80 rounded-full bg-orange-400/[0.03] blur-3xl" />
      <div className="absolute bottom-40 left-1/3 h-64 w-64 rounded-full bg-amber-300/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {dbError ? <DbErrorBanner /> : null}

        {/* ── 页眉：书房门牌 ── */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-amber-700/15 bg-amber-900/5 px-8 py-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/70">Library</p>
            <h1 className="mt-2 font-serif text-4xl font-light tracking-wide italic">我的书房</h1>
            <p className="mt-2 font-mono text-sm text-amber-700/50">书不需要读完才值得被记下来</p>
          </div>
          <div className="flex gap-4 font-mono text-xs text-amber-700/60">
            <span>🟢 已读完</span>
            <span>🟠 在读</span>
            <span>🔵 想读</span>
          </div>
        </header>

        {/* ── 书脊卡片 ── */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {source.map((item) => {
            const palette = statusPalette[item.status ?? ""] ?? statusPalette["想读"];
            const Content = (
              <div className="group flex h-56 cursor-pointer rounded-xl transition hover:-translate-y-1">
                {/* 书脊 */}
                <div className="flex w-6 shrink-0 items-center justify-center rounded-l-lg transition group-hover:w-7" style={{ backgroundColor: palette.spine }}>
                  <span className="font-serif text-[10px] text-white/70" style={{ writingMode: "vertical-rl" }}>
                    {item.title.slice(0, 8)}
                  </span>
                </div>
                {/* 书页 */}
                <div className="flex flex-1 flex-col justify-between rounded-r-xl border border-amber-700/10 p-5 transition group-hover:border-amber-600/20" style={{ backgroundColor: palette.bg }}>
                  <div>
                    <h2 className="font-serif text-lg font-medium leading-snug">{item.title}</h2>
                    <p className="mt-2 line-clamp-3 font-mono text-xs leading-6 text-amber-600/50">{item.detail}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-amber-700/20 px-2.5 py-0.5 font-mono text-[10px] text-amber-600/70">{palette.label}</span>
                    <span className="font-mono text-[10px] text-amber-700/40">→</span>
                  </div>
                </div>
              </div>
            );

            return item.href ? (
              <Link key={item.href} href={item.href}>{Content}</Link>
            ) : (
              <div key={item.title}>{Content}</div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
