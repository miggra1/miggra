import type { Metadata } from "next";
import Link from "next/link";
import { FeaturePageShell } from "../components/feature-page-shell";
import { fallbackNowItems } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Now",
  description: "记录我最近在做什么、在学什么和在想什么。",
};

export default async function NowPage() {
  const { items, dbError } = await listContentItemsSafe("NOW");
  const source = items.length
    ? items.map((item) => ({
        title: item.title,
        detail: item.detail,
        meta: item.meta ?? "Current",
        href: `/now/${item.id}`,
      }))
    : fallbackNowItems.map((item, index) => ({ title: `状态 ${index + 1}`, detail: item, meta: "Current", href: "/now" }));

  return (
    /* ── 仪表盘风：深色终端面板 + 网格点阵 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0c] text-[#d4d4d8]">
      {/* 网格点阵背景 */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {/* 顶部渐变 */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {dbError ? <DbErrorBanner /> : null}

        {/* ── 仪表盘标题栏 ── */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80 animate-pulse" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">System Status</p>
              <h1 className="font-mono text-xl font-semibold tracking-tight">~/now <span className="text-blue-400">▸</span> live</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-400">● ONLINE</span>
            <span className="text-zinc-700">uptime: ∞</span>
          </div>
        </header>

        {/* ── 状态卡片 ── */}
        <section className="grid gap-4 md:grid-cols-2">
          {source.map((item, i) => {
            const accentColors = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"];
            const accent = accentColors[i % accentColors.length];
            const Content = (
              <div className="group rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 backdrop-blur transition hover:border-white/[0.08] hover:bg-white/[0.025]">
                <div className="flex items-start gap-3">
                  {/* 左侧色条 + 脉冲灯 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-1 rounded-full" style={{ backgroundColor: accent }} />
                    <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-mono text-sm font-medium text-zinc-200">{item.title}</h2>
                      <span className="shrink-0 font-mono text-[10px] uppercase text-zinc-600">{item.meta}</span>
                    </div>
                    <p className="mt-2 font-mono text-xs leading-6 text-zinc-400">{item.detail}</p>
                  </div>
                </div>
              </div>
            );

            return item.href ? (
              <Link key={item.href} href={item.href} className="block cursor-pointer">
                {Content}
              </Link>
            ) : (
              <div key={`${item.title}-${i}`}>{Content}</div>
            );
          })}
        </section>

        {/* ── 底部命令提示 ── */}
        <footer className="mt-10 font-mono text-xs text-zinc-700">
          <span className="text-blue-400">miggra@now</span>:<span className="text-zinc-600">~</span>$ echo &quot;这就是此刻。&quot;
        </footer>
      </div>
    </main>
  );
}
