"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MarkdownEditor } from "@/app/components/markdown-editor";

type ContentSection = "NOW" | "WISH" | "READING" | "INSPIRATION";

type Props = {
  mode: "new" | "edit";
  section: ContentSection;
  sectionLabel: string;
  accentColor?: string;
  initial?: { id: string; title: string; detail: string; meta: string; status: string; order: number; active: boolean };
};

export function ContentEditor({ mode, section, sectionLabel, accentColor = "var(--accent)", initial }: Props) {
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
      const routeMap: Record<string, string> = { NOW: "now", WISH: "wish", READING: "reading", INSPIRATION: "inspirations" };
      router.push(`/admin/${routeMap[section]}`);
      router.refresh();
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in px-6 py-10">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition">← 返回列表</button>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn text-sm">取消</button>
          <button onClick={save} disabled={isPending} className="btn btn-primary text-sm">保存</button>
        </div>
      </div>

      {error && <div className="mb-8 px-4 py-3 rounded-lg text-sm border border-[var(--rose)]/20 bg-[var(--rose)]/5 text-[var(--rose)]">{error}</div>}

      <div className="space-y-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" autoFocus
          className="w-full text-4xl font-semibold bg-transparent border-none outline-none placeholder:text-[var(--subtle)] tracking-tight" />

        <MarkdownEditor
          value={detail}
          onChange={setDetail}
          placeholder="内容...（支持 Markdown 语法）"
          rows={16}
        />

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border)]">
          <input value={meta} onChange={(e) => setMeta(e.target.value)} className="input w-32 text-sm" placeholder="副标题" />
          <input value={status} onChange={(e) => setStatus(e.target.value)} className="input w-28 text-sm" placeholder="状态" />
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="input w-20 text-sm" placeholder="排序" />
          <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> 启用
          </label>
          <span className="text-[11px] text-[var(--subtle)] ml-auto">{detail.length} 字 · 约 {Math.max(1, Math.ceil(detail.length / 400))} 分钟阅读</span>
        </div>
      </div>
    </div>
  );
}
