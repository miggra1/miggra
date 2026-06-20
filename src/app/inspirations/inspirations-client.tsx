"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Item = { title: string; detail: string; meta?: string; status?: string; href?: string; pinned?: boolean; id?: string; };

export function InspirationsClient({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");
  const tags = useMemo(() => Array.from(new Set(items.map((i) => i.meta ?? "灵感"))), [items]);

  const filtered = useMemo(() => {
    const kw = query.trim().toLowerCase();
    return items.filter((i) => {
      const mq = !kw || i.title.toLowerCase().includes(kw) || i.detail.toLowerCase().includes(kw);
      const mt = tag === "ALL" || (i.meta ?? "灵感") === tag;
      return mq && mt;
    });
  }, [items, query, tag]);

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索灵感..."
          className="flex-1 max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--subtle)]" />
        <select value={tag} onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--fg-secondary)] outline-none">
          <option value="ALL">全部</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => {
          const key = item.id ?? `${item.title}-${i}`;
          const content = (
            <div className="card-apple p-5 h-full flex flex-col">
              <p className="text-[11px] text-[var(--subtle)] uppercase tracking-widest mb-2">{item.meta ?? "灵感"}</p>
              <h2 className="text-[17px] font-medium">{item.title}</h2>
              <p className="text-[13px] text-[var(--fg-secondary)] mt-2 leading-relaxed flex-1">{item.detail}</p>
              {item.pinned && <span className="mt-3 text-[11px] text-[var(--rose)]">置顶</span>}
            </div>
          );
          return item.href ? <Link key={key} href={item.href}>{content}</Link> : <div key={key}>{content}</div>;
        })}
      </div>
    </div>
  );
}
