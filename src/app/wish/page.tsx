import type { Metadata } from "next";
import Link from "next/link";
import { fallbackWishItems } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "愿望清单",
  description: "记录我想完成、想体验和想拥有的事。",
};

export default async function WishPage() {
  const { items, dbError } = await listContentItemsSafe("WISH");
  const source = items.length
    ? items.map((item) => ({ title: item.title, detail: item.detail, status: item.status ?? undefined, meta: item.meta ?? "Goal", href: `/wish/${item.id}` as const }))
    : fallbackWishItems.map((item) => ({ title: item.title, detail: item.detail, status: item.status, meta: "Goal", href: undefined as string | undefined }));

  const statusStars: Record<string, string> = { "进行中": "✨", "待开始": "💫", "长期": "🌙", "想法中": "⭐", "已完成": "🌟" };

  return (
    /* ── 星空风：深蓝紫渐变 + 星星点阵 ── */
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#12102a] to-[#1a1040] text-[#e8e0f0]">
      {/* 星星背景 */}
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 40% 15%, rgba(200,180,255,0.7), transparent), radial-gradient(1px 1px at 55% 70%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 70% 30%, rgba(180,200,255,0.6), transparent), radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 15% 80%, rgba(220,200,255,0.5), transparent), radial-gradient(1.5px 1.5px at 60% 85%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 90% 10%, rgba(200,180,255,0.7), transparent), radial-gradient(1px 1px at 35% 60%, rgba(255,255,255,0.4), transparent)", backgroundSize: "100% 100%" }} />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {dbError ? <DbErrorBanner /> : null}

        {/* ── 页眉：夜空标题 ── */}
        <header className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-violet-300/60">Wish Upon a Star</p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-wide text-violet-100">愿望清单</h1>
          <p className="mt-3 font-mono text-sm text-violet-300/50">把想做的事、想去的地方，轻轻放进夜空里</p>
        </header>

        {/* ── 星空卡片 ── */}
        <section className="grid gap-5 md:grid-cols-2">
          {source.map((item, i) => {
            const glows = ["rgba(180,160,255,0.12)", "rgba(140,180,255,0.12)", "rgba(255,180,220,0.12)", "rgba(160,220,255,0.12)"];
            const glow = glows[i % glows.length];
            const star = statusStars[item.status ?? ""] ?? "⭐";

            const Content = (
              <div className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition hover:border-white/[0.12] hover:-translate-y-1" style={{ boxShadow: `0 20px 60px ${glow}` }}>
                {/* 顶部星星 */}
                <div className="absolute -top-3 right-6 text-2xl">{star}</div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400/60">{item.meta}</p>
                <h2 className="mt-2 font-serif text-xl font-light tracking-wide">{item.title}</h2>
                <p className="mt-3 font-mono text-sm leading-7 text-violet-300/50">{item.detail}</p>
                {item.status ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/5 px-4 py-1.5 font-mono text-xs text-violet-300/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                    {item.status}
                  </div>
                ) : null}
              </div>
            );

            return item.href ? (
              <Link key={item.href} href={item.href} className="block cursor-pointer">{Content}</Link>
            ) : (
              <div key={`${item.title}-${i}`}>{Content}</div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
