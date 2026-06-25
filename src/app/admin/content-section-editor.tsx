"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type ContentSection = "NOW" | "WISH" | "READING" | "INSPIRATION" | "TIMELINE";

type ContentItem = {
  id: string;
  section: ContentSection;
  title: string;
  detail: string;
  meta: string;
  status: string;
  order: number;
  active: boolean;
  createdAt: string;
};

type FormState = {
  id?: string;
  section: ContentSection;
  title: string;
  detail: string;
  meta: string;
  status: string;
  order: number;
  active: boolean;
};

const emptyForm = (section: ContentSection): FormState => ({ section, title: "", detail: "", meta: "", status: "", order: 0, active: true });

export function ContentSectionEditor({ section, initialItems }: { section: ContentSection; initialItems: ContentItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { setItems(initialItems); }, [initialItems]);

  const refresh = async () => {
    const r = await fetch(`/api/content?section=${section}`);
    if (!r.ok) return;
    setItems(((await r.json()) as { items: ContentItem[] }).items);
  };

  const save = async () => {
    if (!editing) return;
    startTransition(async () => {
      const r = await fetch(editing.id ? `/api/content/${editing.id}` : "/api/content", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!r.ok) return;
      await refresh();
      setEditing(null);
    });
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除？")) return;
    startTransition(async () => {
      await fetch(`/api/content/${id}`, { method: "DELETE" });
      await refresh();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-3">
        <button onClick={() => setEditing(emptyForm(section))} className="w-full rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-4 font-mono text-xs transition hover:border-zinc-600 hover:text-white/60">
          + 新建条目
        </button>
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 transition hover:border-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full border border-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-zinc-500">{item.status || "—"}</span>
                  <span className={`font-mono text-[10px] ${item.active ? "text-emerald-500" : "text-zinc-600"}`}>{item.active ? "启用" : "停用"}</span>
                </div>
                <h3 className="font-serif text-base">{item.title}</h3>
                <p className="mt-1 line-clamp-2 font-mono text-xs text-zinc-500">{item.detail}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing({ ...item, meta: item.meta ?? "", status: item.status ?? "" })} className="rounded-lg border border-white/[0.06] px-3 py-1.5 font-mono text-[10px] text-zinc-400 transition hover:bg-white/[0.04]">编辑</button>
              <button onClick={() => remove(item.id)} className="rounded-lg border border-red-400/10 px-3 py-1.5 font-mono text-[10px] text-red-400/60 transition hover:bg-red-400/5">删除</button>
            </div>
          </article>
        ))}
      </section>

      <aside className="lg:sticky lg:top-8 h-fit rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">{editing?.id ? "编辑条目" : "新建条目"}</p>
        <input value={editing?.title ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), title: e.target.value }))} placeholder="标题" className="w-full bg-transparent border-b border-white/[0.06] pb-2 font-serif text-lg outline-none" />
        <textarea value={editing?.detail ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), detail: e.target.value }))} placeholder="内容（支持 Markdown）" rows={8} className="w-full bg-transparent font-mono text-sm leading-7 text-zinc-300 outline-none resize-none" />
        <div className="grid grid-cols-2 gap-3">
          <input value={editing?.meta ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), meta: e.target.value }))} placeholder="副标题" className="rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 font-mono text-xs outline-none" />
          <input value={editing?.status ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), status: e.target.value }))} placeholder="状态" className="rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 font-mono text-xs outline-none" />
          <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), order: Number(e.target.value) }))} placeholder="排序" className="rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 font-mono text-xs outline-none" />
          <label className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <input type="checkbox" checked={editing?.active ?? true} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm(section)), active: e.target.checked }))} />
            启用
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={isPending} className="rounded-full bg-emerald-600 px-6 py-2 font-serif text-sm text-white transition hover:bg-emerald-500 disabled:opacity-40">保存</button>
          <button onClick={() => setEditing(null)} className="rounded-full border border-white/[0.06] px-5 py-2 font-mono text-xs text-zinc-500">取消</button>
        </div>
      </aside>
    </div>
  );
}
