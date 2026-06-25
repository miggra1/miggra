"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MarkdownEditor } from "@/app/components/markdown-editor";

type Props = {
  mode: "new" | "edit";
  initial?: { id: string; slug: string; title: string; content: string; status: string };
};

export function PagesEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // 新建模式下自动生成 slug
    if (mode === "new" && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60));
    }
  };

  const save = () => {
    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("标题、slug 和内容不能为空");
      return;
    }
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/pages/${initial!.id}` : "/api/pages", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, status }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({ error: "保存失败" }));
        setError((d as { error: string }).error);
        return;
      }
      router.push("/admin/pages");
      router.refresh();
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in px-6 py-10">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition flex items-center gap-1">
          ← 返回列表
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn text-sm">取消</button>
          <button onClick={save} disabled={isPending} className="btn btn-primary text-sm">保存</button>
        </div>
      </div>

      {error && (
        <div className="mb-8 px-4 py-3 rounded-lg text-sm border border-[var(--rose)]/20 bg-[var(--rose)]/5 text-[var(--rose)]">{error}</div>
      )}

      <div className="space-y-6">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="页面标题"
          autoFocus
          className="w-full text-4xl font-semibold bg-transparent border-none outline-none placeholder:text-[var(--subtle)] tracking-tight"
        />

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="slug（如 about、links）"
          className="w-full text-sm bg-transparent border-b border-[var(--border)] pb-2 outline-none placeholder:text-[var(--subtle)] text-[var(--muted)] font-mono focus:border-[var(--accent)] transition"
        />

        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="页面内容...（支持 Markdown 语法）"
          rows={20}
        />

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border)]">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="input text-sm">
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">发布</option>
          </select>
          <span className="text-[11px] text-[var(--subtle)] ml-auto">
            访问路径：<code className="font-mono text-[var(--accent)]">/pages/{slug || "..."}</code>
          </span>
        </div>
      </div>
    </div>
  );
}
