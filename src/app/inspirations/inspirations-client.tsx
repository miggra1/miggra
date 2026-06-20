"use client";

import { useMemo, useState } from "react";

type InspirationItem = {
  title: string;
  detail: string;
  meta?: string;
  status?: string;
  href?: string;
  pinned?: boolean;
  id?: string;
};

const noteColors = [
  { bg: "#fef9c3", border: "#eab308", shadow: "rgba(234,179,8,0.3)" },
  { bg: "#fce7f3", border: "#ec4899", shadow: "rgba(236,72,153,0.3)" },
  { bg: "#dbeafe", border: "#3b82f6", shadow: "rgba(59,130,246,0.3)" },
  { bg: "#d1fae5", border: "#22c55e", shadow: "rgba(34,197,94,0.3)" },
];

export function InspirationsClient({ items }: { items: InspirationItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");

  const tags = useMemo(() => Array.from(new Set(items.map((item) => item.meta ?? "灵感"))), [items]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return items.filter((item) => {
      const meta = item.meta ?? "灵感";
      const matchesQuery = !keyword || item.title.toLowerCase().includes(keyword) || item.detail.toLowerCase().includes(keyword) || meta.toLowerCase().includes(keyword);
      const matchesTag = tag === "ALL" || meta === tag;
      return matchesQuery && matchesTag;
    });
  }, [items, query, tag]);

  return (
    <div className="space-y-6">
      {/* 搜索栏 — 橡皮筋 + 图钉 */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border-2 border-amber-700/20 bg-amber-50/60 px-5 py-3 backdrop-blur">
        <span className="text-lg">📌</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索便签上的关键词..."
          className="flex-1 bg-transparent font-mono text-sm text-amber-900 placeholder-amber-500/50 outline-none"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-amber-300/50 bg-amber-50 font-mono text-xs text-amber-800 outline-none px-3 py-1.5"
        >
          <option value="ALL">全部</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* 便签墙 — 每张微微旋转 + 图钉 */}
      {filtered.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => {
            const color = noteColors[index % noteColors.length];
            const rotation = (index % 5 - 2) * 0.8;

            const content = (
              <div
                className="relative rounded-md border-2 p-5 shadow-lg transition hover:scale-[1.03] hover:shadow-xl"
                style={{
                  backgroundColor: color.bg,
                  borderColor: color.border,
                  boxShadow: `4px 6px 20px ${color.shadow}`,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {/* 图钉 */}
                <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-md ring-1 ring-red-300" />
                </div>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-amber-700/60">{item.meta ?? "灵感"}</p>
                <h2 className="mt-2 font-serif text-base font-semibold leading-snug text-amber-950">{item.title}</h2>
                <p className="mt-2 font-mono text-xs leading-6 text-amber-800/70">{item.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.pinned ? <span className="rounded-full border border-amber-400/50 bg-amber-100 px-2 py-0.5 font-mono text-[10px] text-amber-700">📌 置顶</span> : null}
                  {item.status ? <span className="rounded-full border border-amber-400/30 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-600">{item.status}</span> : null}
                </div>
              </div>
            );

            return item.href ? (
              <a key={(item as any).id ?? `${item.title}-${index}`} href={item.href} className="block">{content}</a>
            ) : (
              <div key={(item as any).id ?? `${item.title}-${index}`}>{content}</div>
            );
          })}
        </section>
      ) : (
        <div className="rounded-xl border-2 border-amber-700/15 bg-amber-50/40 p-10 text-center font-mono text-sm text-amber-700/50">
          这块软木板还空着，钉一张便签上去吧。
        </div>
      )}
    </div>
  );
}
