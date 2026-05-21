"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type TimelineKind = "PERSONAL" | "SITE";

type TimelineMilestone = {
  id?: string;
  year: string;
  kind: TimelineKind;
  title: string;
  detail: string;
  order: number;
  active: boolean;
};

const kinds: { value: TimelineKind; label: string }[] = [
  { value: "PERSONAL", label: "人生节点" },
  { value: "SITE", label: "站点节点" },
];

export function TimelineMilestonesClient({ initialItems }: { initialItems: TimelineMilestone[] }) {
  const [items, setItems] = useState(initialItems);
  const [kind, setKind] = useState<"ALL" | TimelineKind>("ALL");
  const [editing, setEditing] = useState<TimelineMilestone | null>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const filtered = useMemo(() => items.filter((item) => kind === "ALL" || item.kind === kind), [items, kind]);

  const refresh = async () => {
    const response = await fetch("/api/admin/timeline");
    if (!response.ok) return;
    const data = (await response.json()) as { items: TimelineMilestone[] };
    setItems(data.items);
  };

  const save = async () => {
    if (!editing) return;
    setStatus(null);
    startTransition(async () => {
      const response = await fetch(editing.id ? `/api/admin/timeline/${editing.id}` : "/api/admin/timeline", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      setStatus(response.ok ? "时间线已保存。" : "保存失败。");
      if (response.ok) {
        await refresh();
        setEditing(null);
      }
    });
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除这个节点吗？")) return;
    await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
    await refresh();
    if (editing?.id === id) setEditing(null);
  };

  const move = async (id: string, direction: -1 | 1) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const siblings = items.filter((item) => item.kind === current.kind).sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((item) => item.id === id);
    const target = siblings[index + direction];
    if (!target) return;
    await fetch("/api/admin/timeline/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, targetId: target.id }),
    });
    await refresh();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Timeline Admin</p>
              <h2 className="mt-2 text-2xl font-semibold">时间线节点管理</h2>
            </div>
            <div className="flex gap-3">
              <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">
                <option value="ALL">全部节点</option>
                {kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <button type="button" onClick={() => setEditing({ year: "2026", kind: "PERSONAL", title: "", detail: "", order: 0, active: true })} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)]">新建节点</button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map((item) => (
            <article key={item.id ?? `${item.year}-${item.title}`} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.year} · {item.kind === "PERSONAL" ? "人生节点" : "站点节点"}</div>
                  <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.id ? <button type="button" onClick={() => move(item.id as string, -1)} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">上移</button> : null}
                  {item.id ? <button type="button" onClick={() => move(item.id as string, 1)} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">下移</button> : null}
                  <button type="button" onClick={() => setEditing(item)} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">编辑</button>
                  {item.id ? <button type="button" onClick={() => remove(item.id as string)} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">删除</button> : null}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-[var(--muted)]">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Editor</p>
        <h2 className="text-2xl font-semibold">{editing?.id ? "编辑节点" : "新建节点"}</h2>
        {status ? <p className="text-sm text-[var(--subtle)]">{status}</p> : null}
        <select value={editing?.kind ?? "PERSONAL"} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { year: "2026", title: "", detail: "", order: 0, active: true }), kind: e.target.value as TimelineKind }))} className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm">
          {kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <input value={editing?.year ?? "2026"} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { kind: "PERSONAL", title: "", detail: "", order: 0, active: true }), year: e.target.value }))} placeholder="年份" className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm" />
        <input value={editing?.title ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { year: "2026", kind: "PERSONAL", detail: "", order: 0, active: true }), title: e.target.value }))} placeholder="标题" className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm" />
        <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { year: "2026", kind: "PERSONAL", title: "", detail: "", active: true }), order: Number(e.target.value) }))} placeholder="排序" className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm" />
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]"><input type="checkbox" checked={editing?.active ?? true} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { year: "2026", kind: "PERSONAL", title: "", detail: "", order: 0 }), active: e.target.checked }))} />启用</label>
        <textarea value={editing?.detail ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? { year: "2026", kind: "PERSONAL", title: "", order: 0, active: true }), detail: e.target.value }))} placeholder="详细描述" rows={10} className="w-full rounded-3xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm" />
        <div className="flex gap-3">
          <button type="button" onClick={save} disabled={isPending} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] disabled:opacity-50">保存</button>
          <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm">取消</button>
        </div>
      </aside>
    </div>
  );
}
