"use client";

import { useMemo, useState } from "react";

type InspirationItem = {
  title: string;
  detail: string;
  meta?: string;
  status?: string;
  href?: string;
  pinned?: boolean;
};

export function InspirationsClient({ items }: { items: InspirationItem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");

  const tags = useMemo(() => Array.from(new Set(items.map((item) => item.meta ?? "灵感"))), [items]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return items.filter((item) => {
      const meta = item.meta ?? "灵感";
      const matchesQuery =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.detail.toLowerCase().includes(keyword) ||
        meta.toLowerCase().includes(keyword);
      const matchesTag = tag === "ALL" || meta === tag;
      return matchesQuery && matchesTag;
    });
  }, [items, query, tag]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索灵感、便签、关键词..."
            className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none"
          >
            <option value="ALL">全部</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <div
              key={(item as any).id ?? `${item.title}-${index}`}
              className={`rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:bg-[var(--card-strong)] ${index % 5 === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.meta ?? "灵感"}</div>
                  <h2 className="mt-3 text-xl font-medium">{item.title}</h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {item.pinned ? <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--subtle)]">置顶</span> : null}
                  {item.status ? <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--subtle)]">{item.status}</span> : null}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-[var(--muted)]">{item.detail}</p>
              {item.href ? (
                <a href={item.href} className="mt-5 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm transition hover:bg-[var(--card-strong)]">
                  查看详情
                </a>
              ) : null}
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
          没有找到符合条件的灵感，试试换个关键词或标签。
        </div>
      )}
    </div>
  );
}
