"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import type { NoteStatus } from "@prisma/client";
import { MarkdownEditor } from "@/app/components/markdown-editor";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

const DRAFT_KEY = "miggra-draft";

type DraftData = {
  title: string;
  text: string;
  tag: string;
  status: string;
  savedAt: number;
};

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
  const [showPreview, setShowPreview] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 草稿恢复检查（仅 new 模式） ──
  useEffect(() => {
    if (mode !== "new") return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      if (draft.title || draft.text) {
        setDraftAvailable(true);
      }
    } catch { /* ignore */ }
  }, [mode]);

  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      setTitle(draft.title ?? "");
      setText(draft.text ?? "");
      setTag(draft.tag ?? "随想");
      if (draft.status) setStatus(draft.status as NoteStatus);
      setDraftAvailable(false);
      setDraftRestored(true);
    } catch { /* ignore */ }
  };

  const dismissDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftAvailable(false);
  };

  // ── 自动保存草稿（仅 new 模式） ──
  const saveDraft = useCallback(() => {
    if (mode !== "new") return;
    const draft: DraftData = { title, text, tag, status, savedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [mode, title, text, tag, status]);

  useEffect(() => {
    if (mode !== "new") return;
    if (!title && !text) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveDraft, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [title, text, tag, status, mode, saveDraft]);

  // 保存成功后清除草稿
  const clearDraft = () => {
    if (mode === "new") localStorage.removeItem(DRAFT_KEY);
  };

  const save = () => {
    if (!title.trim() || !text.trim()) { setError("标题和内容不能为空"); return; }
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/notes/${initial!.id}` : "/api/notes", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, tag, status, pinned, coverImage: coverImage || undefined, scheduledAt: scheduledAt || undefined }),
      });
      if (!r.ok) { setError("保存失败"); return; }
      clearDraft();
      router.push("/admin/notes"); router.refresh();
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition flex items-center gap-1">
          ← 返回列表
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition ${
              showPreview
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {showPreview ? "隐藏预览" : "分栏预览"}
          </button>
          <button onClick={() => router.back()} className="btn text-sm">取消</button>
          <button onClick={save} disabled={isPending} className="btn btn-primary text-sm">{mode === "new" ? "发布" : "保存"}</button>
        </div>
      </div>

      {/* 草稿恢复提示 */}
      {draftAvailable && !draftRestored && (
        <div className="mb-6 px-5 py-4 rounded-xl border border-amber-300/30 bg-amber-300/8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">检测到未保存的草稿</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">上次自动保存于几分钟前，要恢复吗？</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={dismissDraft} className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] transition">丢弃</button>
            <button onClick={restoreDraft} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] transition hover:opacity-90">恢复</button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 px-4 py-3 rounded-lg text-sm border border-[var(--rose)]/20 bg-[var(--rose)]/5 text-[var(--rose)]">{error}</div>
      )}

      {/* Writing area */}
      <div className={`${showPreview ? "grid grid-cols-2 gap-6" : ""}`}>
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
            placeholder="写点什么..."
            rows={showPreview ? 28 : 20}
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

        {/* 实时预览面板 */}
        {showPreview && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 overflow-y-auto max-h-[calc(100vh-12rem)] sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">预览</p>
              <span className="text-[10px] text-[var(--muted)]">Markdown 实时渲染</span>
            </div>
            {title && (
              <h1 className="text-2xl font-semibold mb-1">{title}</h1>
            )}
            {tag && (
              <span className="inline-block text-xs text-[var(--subtle)] rounded-full border border-[var(--border)] px-2 py-0.5 mb-4">{tag}</span>
            )}
            {text ? (
              <MarkdownRenderer>{text}</MarkdownRenderer>
            ) : (
              <p className="text-sm text-[var(--muted)]">输入内容后这里会实时显示渲染效果。</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
