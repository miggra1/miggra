"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { NoteStatus } from "@prisma/client";

type Props = {
  mode: "new" | "edit";
  initial?: { id: string; title: string; text: string; tag: string; status: NoteStatus; pinned: boolean };
};

export function NotesEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "随想");
  const [status, setStatus] = useState<NoteStatus>(initial?.status ?? "PUBLISHED");
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const save = () => {
    if (!title.trim() || !text.trim()) { setError("标题和内容不能为空"); return; }
    startTransition(async () => {
      const r = await fetch(mode === "edit" ? `/api/notes/${initial!.id}` : "/api/notes", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, tag, status, pinned }),
      });
      if (!r.ok) { setError("保存失败"); return; }
      router.push("/admin/notes");
      router.refresh();
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">碎碎念</p>
          <h1 className="text-2xl font-medium mt-1">{mode === "new" ? "写点什么" : "编辑"}</h1>
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

        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="写下你想说的..." rows={18}
          className="w-full text-[15px] leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-[var(--subtle)]" />

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border)]">
          <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="标签" className="w-28 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none" />
          <select value={status} onChange={(e) => setStatus(e.target.value as NoteStatus)} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none">
            <option value="PUBLISHED">发布</option>
            <option value="DRAFT">草稿</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-[var(--fg-secondary)]">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> 置顶
          </label>
        </div>
      </div>
    </div>
  );
}
