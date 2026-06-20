"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ContentSection = "NOW" | "WISH" | "READING" | "INSPIRATION";

type Props = {
  mode: "new" | "edit";
  section: ContentSection;
  sectionLabel: string;
  initial?: { id: string; title: string; detail: string; meta: string; status: string; order: number; active: boolean };
};

export function ContentEditor({ mode, section, sectionLabel, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [meta, setMeta] = useState(initial?.meta ?? "");
  const [status, setStatus] = useState(initial?.status ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const save = () => {
    if (!title.trim() || !detail.trim()) { setError("标题和内容不能为空"); return; }
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/content/${initial!.id}` : "/api/content", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, title, detail, meta: meta || undefined, status: status || undefined, order, active }),
      });
      if (!r.ok) { setError("保存失败"); return; }
      router.push(`/admin/${section.toLowerCase()}`);
      router.refresh();
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">{sectionLabel}</p>
          <h1 className="text-2xl font-medium mt-1">{mode === "new" ? `新建${sectionLabel}` : `编辑${sectionLabel}`}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 text-sm text-[var(--fg-secondary)] rounded-full border border-[var(--border)] transition hover:bg-[var(--card)]">取消</button>
          <button onClick={save} disabled={isPending} className="px-5 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-full transition hover:opacity-90 disabled:opacity-40">保存</button>
        </div>
      </div>

      {error && <p className="mb-6 text-sm text-[var(--rose)]">{error}</p>}

      <div className="space-y-8">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" autoFocus
          className="w-full text-3xl font-medium bg-transparent border-none outline-none placeholder:text-[var(--subtle)]" />

        <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="内容..." rows={16}
          className="w-full text-[15px] leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-[var(--subtle)]" />

        <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border)]">
          <input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="副标题"
            className="w-40 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none" />
          <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="状态"
            className="w-32 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none" />
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="排序"
            className="w-20 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none" />
          <label className="flex items-center gap-2 text-sm text-[var(--fg-secondary)]">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> 启用
          </label>
        </div>
      </div>
    </div>
  );
}
