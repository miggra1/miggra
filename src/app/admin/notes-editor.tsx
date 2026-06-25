"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { NoteStatus } from "@prisma/client";
import { MarkdownEditor } from "@/app/components/markdown-editor";

type Props = {
  mode: "new" | "edit";
  initial?: { id: string; title: string; text: string; tag: string; status: NoteStatus; pinned: boolean; coverImage?: string | null; scheduledAt?: string | null };
};

export function NotesEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "随想");
  const [status, setStatus] = useState<NoteStatus>(initial?.status ?? "PUBLISHED");
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [scheduledAt, setScheduledAt] = useState(initial?.scheduledAt ? initial.scheduledAt.slice(0, 16) : "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const save = () => {
    if (!title.trim() || !text.trim()) { setError("标题和内容不能为空"); return; }
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/notes/${initial!.id}` : "/api/notes", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, tag, status, pinned, coverImage: coverImage || undefined, scheduledAt: scheduledAt || undefined }),
      });
      if (!r.ok) { setError("保存失败"); return; }
      router.push("/admin/notes"); router.refresh();
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition flex items-center gap-1">
          ← 返回列表
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn text-sm">取消</button>
          <button onClick={save} disabled={isPending} className="btn btn-primary text-sm">{mode === "new" ? "发布" : "保存"}</button>
        </div>
      </div>

      {error && (
        <div className="mb-8 px-4 py-3 rounded-lg text-sm border border-[var(--rose)]/20 bg-[var(--rose)]/5 text-[var(--rose)]">{error}</div>
      )}

      {/* Writing area */}
      <div className="space-y-6">
        <input
          value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题..."
          autoFocus
          className="w-full text-4xl font-semibold bg-transparent border-none outline-none placeholder:text-[var(--subtle)] tracking-tight"
        />

        <input
          value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
          placeholder="封面图 URL（可选，支持粘贴上传链接）"
          className="w-full text-sm bg-transparent border-b border-[var(--border)] pb-2 outline-none placeholder:text-[var(--subtle)] text-[var(--muted)] focus:border-[var(--accent)] transition"
        />

        <MarkdownEditor
          value={text}
          onChange={setText}
          placeholder="写点什么...（支持 Markdown 语法）"
          rows={20}
        />

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border)]">
          <input value={tag} onChange={(e) => setTag(e.target.value)}
            className="input w-28 text-sm" placeholder="标签" />
          <select value={status} onChange={(e) => setStatus(e.target.value as NoteStatus)}
            className="input text-sm">
            <option value="PUBLISHED">发布</option>
            <option value="SCHEDULED">定时发布</option>
            <option value="DRAFT">草稿</option>
          </select>
          {status === "SCHEDULED" && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="input text-sm"
            />
          )}
          <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer select-none">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-[var(--accent)]" />
            置顶
          </label>
          <span className="text-[11px] text-[var(--subtle)] ml-auto">{text.length} 字 · 约 {Math.max(1, Math.ceil(text.length / 400))} 分钟阅读</span>
        </div>
      </div>
    </div>
  );
}
