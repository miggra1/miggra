"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

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
          className="flex-1 max-w-sm rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)]" />
        <select value={tag} onChange={(e) => setTag(e.target.value)}
          className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)] outline-none">
          <option value="ALL">全部</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item, i) => {
          const key = item.id ?? `${item.title}-${i}`;
          const content = (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.meta ?? "灵感"}</p>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <div className="mt-3 line-clamp-3">
              <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
            </div>
              {item.pinned && <span className="inline-block mt-3 rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]">置顶</span>}
            </div>
          );
          return item.href ? <Link key={key} href={item.href}>{content}</Link> : <div key={key}>{content}</div>;
        })}
      </div>
    </div>
  );
}
