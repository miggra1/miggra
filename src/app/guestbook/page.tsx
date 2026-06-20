import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GuestbookForm } from "./guestbook-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "公开留言板",
  description: "留下一个简短的问候、感想或者路过的脚印。",
};

export default async function GuestbookPage() {
  const entries = await prisma.guestbookEntry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const ribbonColors = ["#e57c8a", "#c9a96e", "#7fa998", "#8fa3b8", "#c48ba3", "#a8c48b"];

  return (
    /* ── 温暖访客簿风：木纹暖色 + 丝带装饰 ── */
    <main className="relative min-h-screen overflow-hidden bg-[#f5efe6] text-[#3d3027]">
      {/* 木纹纹理 */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,90,43,0.4) 3px, rgba(139,90,43,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(139,90,43,0.2) 8px, rgba(139,90,43,0.2) 9px)" }} />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* ── 页眉：迎宾牌 ── */}
        <header className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/60">Welcome</p>
          <h1 className="mt-2 font-serif text-4xl font-light italic tracking-wide">访客留言簿</h1>
          <p className="mt-3 font-mono text-sm text-amber-600/50">路过的人，留下一句话再走吧</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <GuestbookForm />

          {/* ── 留言卡片 ── */}
          <section className="grid gap-4">
            {entries.length ? entries.map((entry, i) => (
              <article
                key={entry.id}
                className="relative rounded-2xl border-2 border-amber-200/60 bg-white/80 p-5 shadow-sm transition hover:shadow-md"
              >
                {/* 丝带装饰 */}
                <div className="absolute -left-1 top-3 bottom-3 w-1.5 rounded-full" style={{ backgroundColor: ribbonColors[i % ribbonColors.length] }} />
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-base font-medium">{entry.name}</h2>
                  <time className="font-mono text-[10px] text-stone-400">{new Date(entry.createdAt).toLocaleString("zh-CN")}</time>
                </div>
                <p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-7 text-stone-500">{entry.message}</p>
              </article>
            )) : (
              <article className="rounded-2xl border-2 border-dashed border-amber-200/40 bg-amber-50/40 p-8 text-center font-mono text-sm text-amber-600/50">
                这本留言簿还空着 ✍️<br />来做第一个留下脚印的人吧
              </article>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
