"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { sectionIdentity } from "@/lib/section-identity";

type Item = {
  title: string;
  detail: string;
  meta?: string;
  status?: string;
  href?: string;
  pinned?: boolean;
  id?: string;
};

const tone = sectionIdentity.inspiration;

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
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索灵感..."
          className={`w-full rounded-full border bg-[var(--card)] px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] sm:max-w-sm ${tone.borderClass} focus:border-pink-300/45`}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={`rounded-full border bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)] outline-none ${tone.borderClass}`}
        >
          <option value="ALL">全部</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item, i) => {
          const key = item.id ?? `${item.title}-${i}`;
          const content = (
            <div className={`rounded-[1.5rem] border bg-[var(--card)] p-6 card-interactive animate-in ${tone.borderClass} ${tone.hoverClass}`} style={{ animationDelay: `${i * 50}ms` }}>
              <p className={`text-xs uppercase tracking-[0.2em] ${tone.eyebrowClass}`}>{item.meta ?? "灵感"}</p>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <div className="mt-3 line-clamp-3">
                <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
              </div>
              {item.pinned ? <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-sm ${tone.badgeClass}`}>置顶</span> : null}
            </div>
          );
          return item.href ? <Link key={key} href={item.href}>{content}</Link> : <div key={key}>{content}</div>;
        })}
      </div>
    </div>
  );
}
