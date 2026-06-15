"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ModuleItem = {
  id: string;
  key: string;
  title: string;
  enabled: boolean;
  order: number;
};

const defaultHrefMap: Record<string, string> = {
  now: "/now",
  wish: "/wish",
  reading: "/reading",
  inspirations: "/inspirations",
  timeline: "/timeline",
  guestbook: "/guestbook",
};

export function HomepageModulesClient({ initialModules }: { initialModules: ModuleItem[] }) {
  const [modules, setModules] = useState(initialModules);
  const [status, setStatus] = useState<string | null>(null);

  const previewModules = useMemo(
    () => modules.filter((module) => module.enabled).sort((a, b) => a.order - b.order),
    [modules],
  );

  const save = async () => {
    setStatus(null);
    const response = await fetch("/api/homepage-modules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modules }),
    });

    setStatus(response.ok ? "首页模块已保存。" : "保存失败，请重试。");
  };

  const update = (id: string, patch: Partial<ModuleItem>) => {
    setModules((prev) =>
      prev.map((module) => (module.id === id ? { ...module, ...patch } : module)),
    );
  };

  const move = (id: string, direction: -1 | 1) => {
    setModules((prev) => {
      const index = prev.findIndex((module) => module.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((module, idx) => ({ ...module, order: idx + 1 }));
    });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Homepage</p>
            <h2 className="mt-2 text-2xl font-semibold">首页模块</h2>
          </div>
          <button type="button" onClick={save} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)]">
            保存首页模块
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {status ? <p className="text-sm text-[var(--subtle)]">{status}</p> : null}
          {modules.map((module) => (
            <div key={module.id} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
              <input value={module.title} onChange={(e) => update(module.id, { title: e.target.value })} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(module.id, -1)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
                  上移
                </button>
                <button type="button" onClick={() => move(module.id, 1)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
                  下移
                </button>
              </div>
              <input type="number" value={module.order} onChange={(e) => update(module.id, { order: Number(e.target.value) })} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 md:w-28" />
              <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <input type="checkbox" checked={module.enabled} onChange={(e) => update(module.id, { enabled: e.target.checked })} /> 启用
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Preview</p>
        <h3 className="mt-2 text-2xl font-semibold">首页预览</h3>
        <div className="mt-5 grid gap-3">
          {previewModules.map((module) => {
            const href = defaultHrefMap[module.key] ?? `/${module.key}`;
            return (
              <Link key={module.id} href={href} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">{module.key}</div>
                <div className="mt-3 text-lg font-medium">{module.title}</div>
                <div className="mt-2 text-sm text-[var(--muted)]">{href}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
