"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  type: "note" | "content" | "page" | "guestbook";
  id: string;
  title: string;
  snippet: string;
  tag?: string;
  section?: string;
  sectionLabel?: string;
  slug?: string;
  createdAt: string;
};

const sectionPaths: Record<string, string> = {
  NOW: "now",
  WISH: "wish",
  READING: "reading",
  INSPIRATION: "inspirations",
  TIMELINE: "timeline",
};

function getHref(r: SearchResult): string {
  switch (r.type) {
    case "note": return `/notes/${r.id}`;
    case "content": return `/${sectionPaths[r.section ?? ""] ?? "now"}/${r.id}`;
    case "page": return `/pages/${r.slug ?? r.id}`;
    case "guestbook": return `/guestbook`;
  }
}

function typeLabel(r: SearchResult): string {
  switch (r.type) {
    case "note": return r.tag ?? "碎碎念";
    case "content": return r.sectionLabel ?? "内容";
    case "page": return "页面";
    case "guestbook": return "留言";
  }
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const customHandler = () => setOpen((prev) => !prev);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("miggra:search", customHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("miggra:search", customHandler);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!controller.signal.aborted) {
          setResults(data.results ?? []);
          setSelectedIndex(0);
        }
      } catch {
        // aborted or network error
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const navigate = useCallback(
    (r: SearchResult) => {
      setOpen(false);
      router.push(getHref(r));
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in" />

      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <span className="text-[var(--subtle)] text-sm">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索碎碎念、书单、灵感…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--subtle)]"
          />
          <kbd className="text-[10px] text-[var(--subtle)] border border-[var(--border)] rounded px-2 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <p className="px-4 py-6 text-center text-sm text-[var(--muted)] animate-pulse">
              搜索中…
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">
              没有找到 &ldquo;{query}&rdquo; 相关的内容
            </p>
          )}

          {!query && (
            <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">
              输入关键词搜索全站内容
            </p>
          )}

          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => navigate(r)}
              className={`w-full text-left px-4 py-3 border-b border-[var(--border)] last:border-b-0 transition hover:bg-[var(--card)] ${
                i === selectedIndex ? "bg-[var(--card)]" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--accent)] rounded-full border border-[var(--border)] px-2 py-0.5">
                  {typeLabel(r)}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {new Date(r.createdAt).toISOString().slice(0, 10)}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium truncate">{r.title}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)] line-clamp-2">
                {r.snippet}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
