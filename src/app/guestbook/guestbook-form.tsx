"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SubmittedPreview = {
  name: string;
  message: string;
};

export function GuestbookForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<SubmittedPreview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (submitting) return;
    setStatus(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message }) });
      if (!r.ok) {
        const d = await r.json().catch(() => null) as { error?: string } | null;
        setStatus(d?.error ?? "提交失败");
        return;
      }
      setPreview({ name: name || "匿名", message });
      setName("");
      setMessage("");
      setStatus("已提交，审核通过后会显示出来。");
      router.refresh();
    } catch {
      setStatus("网络有点慢，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="rounded-[1.5rem] border border-amber-300/30 bg-amber-300/8 p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">待审核</p>
            <button
              onClick={() => setPreview(null)}
              className="text-xs text-[var(--subtle)] hover:text-[var(--fg)] transition"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-base font-semibold">{preview.name}</h3>
            <span className="text-xs text-[var(--subtle)]">刚刚</span>
          </div>
          <p className="whitespace-pre-wrap leading-7 text-[var(--muted)] text-sm">{preview.message}</p>
          <p className="mt-3 text-xs text-[var(--subtle)]">站长审核通过后会展示在下方列表 ✨</p>
        </div>
      )}

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)] mb-4">写下留言</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的名字（可以不留）"
          className="w-full rounded-full border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] mb-3" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="想说点什么..."
          rows={4} className="w-full rounded-[1.5rem] border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] resize-none mb-3" />
        <div className="flex items-center gap-4">
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "提交中..." : "提交留言"}
          </button>
          {status && <p className={`text-sm ${status.startsWith("已提交") ? "text-emerald-400" : "text-red-400"}`}>{status}</p>}
        </div>
      </div>
    </div>
  );
}
