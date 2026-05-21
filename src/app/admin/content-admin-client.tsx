"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type ContentSection = "NOW" | "WISH" | "READING" | "INSPIRATION" | "TIMELINE";

type ContentItem = {
  id: string;
  section: ContentSection;
  title: string;
  detail: string;
  meta: string | null;
  status: string | null;
  order: number;
  active: boolean;
  createdAt: string;
};

type ContentAdminClientProps = {
  initialItems: ContentItem[];
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

const sections: { value: ContentSection; label: string }[] = [
  { value: "NOW", label: "Now" },
  { value: "WISH", label: "愿望清单" },
  { value: "READING", label: "书单" },
  { value: "INSPIRATION", label: "灵感" },
  { value: "TIMELINE", label: "时间线" },
];

const emptyForm = (): FormState => ({ section: "NOW", title: "", detail: "", meta: "", status: "", order: 0, active: true });

export function ContentAdminClient({ initialItems }: ContentAdminClientProps) {
  const [items, setItems] = useState(initialItems);
  const [section, setSection] = useState<"ALL" | ContentSection>("ALL");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => items.filter((item) => section === "ALL" || item.section === section), [items, section]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const refresh = async () => {
    const next: ContentItem[] = [];
    for (const sec of sections) {
      const response = await fetch(`/api/content?section=${sec.value}`);
      if (!response.ok) continue;
      const data = (await response.json()) as { items: ContentItem[] };
      next.push(...data.items);
    }
    setItems(next);
  };

  const handleEdit = (item: ContentItem) => setEditing({ ...item, meta: item.meta ?? "", status: item.status ?? "" });
  const handleCreate = () => setEditing(emptyForm());

  const save = async () => {
    if (!editing) return;
    startTransition(async () => {
      const payload = { ...editing, meta: editing.meta || undefined, status: editing.status || undefined };
      const response = await fetch(editing.id ? `/api/content/${editing.id}` : "/api/content", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return;
      await refresh();
      setEditing(null);
    });
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除这条内容吗？")) return;
    startTransition(async () => {
      const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (!response.ok) return;
      await refresh();
      if (editing?.id === id) setEditing(null);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/35">Content Admin</p>
              <h2 className="mt-2 text-2xl font-semibold">生活内容管理</h2>
            </div>
            <div className="flex gap-3">
              <select value={section} onChange={(e) => setSection(e.target.value as typeof section)} className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm">
                <option value="ALL">全部模块</option>
                {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={handleCreate} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black">新建内容</button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/35">{item.section}</div>
                  <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">编辑</button>
                  <button onClick={() => remove(item.id)} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">删除</button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-white/65">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/35">Editor</p>
        <h2 className="text-2xl font-semibold">{editing?.id ? "编辑内容" : "新建内容"}</h2>
        <select value={editing?.section ?? "NOW"} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), section: e.target.value as ContentSection }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
          {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input value={editing?.title ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), title: e.target.value }))} placeholder="标题" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
        <input value={editing?.meta ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), meta: e.target.value }))} placeholder="副标题 / meta" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
        <input value={editing?.status ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), status: e.target.value }))} placeholder="状态" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
        <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), order: Number(e.target.value) }))} placeholder="排序" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"><input type="checkbox" checked={editing?.active ?? true} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), active: e.target.checked }))} />启用</label>
        <textarea value={editing?.detail ?? ""} onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), detail: e.target.value }))} placeholder="内容" rows={10} className="w-full rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
        <div className="flex gap-3">
          <button onClick={save} disabled={isPending} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50">保存</button>
          <button onClick={() => setEditing(null)} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm">取消</button>
        </div>
      </aside>
    </div>
  );
}
