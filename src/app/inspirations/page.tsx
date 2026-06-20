import type { Metadata } from "next";
import { fallbackInspirations } from "@/lib/site-data";
import { listContentItemsSafe } from "@/lib/content";
import { InspirationsClient } from "./inspirations-client";
import { DbErrorBanner } from "../components/db-error-banner";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "灵感收集",
  description: "收集点子、备忘和灵感碎片。",
};

export default async function InspirationsPage() {
  const { items, dbError } = await listContentItemsSafe("INSPIRATION");
  const source = items.length
    ? items.map((item, index) => ({
        title: item.title,
        detail: item.detail,
        meta: item.meta ?? (index % 2 === 0 ? "灵感" : "便签"),
        status: item.status ?? undefined,
        href: `/inspirations/${item.id}`,
      }))
    : fallbackInspirations.map((item, index) => ({
        title: item.title,
        detail: item.detail,
        meta: index % 2 === 0 ? item.meta : "便签",
        pinned: index === 0,
      }));

  return (
    /* ── 软木板风：暖棕软木纹理 + 彩色便利贴 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#c4a87c] text-[#3d3027]">
      {/* 软木板纹理 */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.1) 2px, rgba(139,90,43,0.1) 3px), repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139,90,43,0.06) 4px, rgba(139,90,43,0.06) 5px)" }} />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(139,90,43,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139,90,43,0.4) 0%, transparent 50%)" }} />

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {dbError ? <DbErrorBanner /> : null}

        {/* 软木板标题标签 */}
        <header className="mb-8 inline-block -rotate-1 rounded-lg border-2 border-amber-700/30 bg-yellow-100/90 px-8 py-4 shadow-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-700">Corkboard</p>
          <h1 className="font-serif text-3xl font-medium italic text-amber-900">灵感便签墙</h1>
          <p className="mt-1 font-mono text-xs text-amber-600">📌 想到什么，随手钉上来</p>
        </header>

        <InspirationsClient items={source} />
      </div>
    </main>
  );
}
