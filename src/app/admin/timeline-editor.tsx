"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MarkdownEditor } from "@/app/components/markdown-editor";

type Props = {
  mode: "new" | "edit";
  initial?: { id: string; year: string; kind: string; title: string; detail: string; order: number; active: boolean };
};

export function TimelineEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [year, setYear] = useState(initial?.year ?? "2026");
  const [kind, setKind] = useState(initial?.kind ?? "PERSONAL");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/admin/timeline/${initial!.id}` : "/api/admin/timeline", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, kind, title, detail, order, active }),
      });
      if (r.ok) { router.push("/admin/timeline"); router.refresh(); }
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Timeline</p>
          <h1 className="text-2xl font-medium mt-1">{mode === "new" ? "新建节点" : "编辑节点"}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 text-sm text-[var(--fg-secondary)] rounded-full border border-[var(--border)] transition hover:bg-[var(--card)]">取消</button>
          <button onClick={save} disabled={isPending} className="px-5 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-full transition hover:opacity-90 disabled:opacity-40">保存</button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex gap-4">
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="年份" className="w-32 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-lg font-medium outline-none" />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-lg outline-none">
            <option value="PERSONAL">人生节点</option>
            <option value="SITE">站点节点</option>
          </select>
        </div>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" autoFocus
          className="w-full text-3xl font-medium bg-transparent border-none outline-none placeholder:text-[var(--subtle)]" />

        <MarkdownEditor
          value={detail}
          onChange={setDetail}
          placeholder="详细描述..."
          rows={14}
        />

        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-20 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none" />
          <label className="flex items-center gap-2 text-sm text-[var(--fg-secondary)]">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> 启用
          </label>
        </div>
      </div>
    </div>
  );
}
