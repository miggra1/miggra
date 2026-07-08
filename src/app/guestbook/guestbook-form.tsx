"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SubmittedPreview = {
  name: string;
  message: string;
  thanks: string;
};

const thankYouMessages = [
  "谢谢你把这一小句留在这里。",
  "收到啦，这个脚印会被好好放着。",
  "这句问候已经悄悄抵达。",
  "路过的人也会让这里变亮一点。",
];

function randomThanks() {
  return thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
}

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
      const r = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => null) as { error?: string } | null;
        setStatus(d?.error ?? "提交失败");
        return;
      }
      const thanks = randomThanks();
      setPreview({ name: name || "匿名", message, thanks });
      setName("");
      setMessage("");
      setStatus("你的脚印已经放进待审核盒子。");
      router.refresh();
    } catch {
      setStatus("网络有点慢，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="rounded-[1.5rem] border border-amber-300/30 bg-amber-300/10 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-100/80">待审核盒子</p>
            <button
              onClick={() => setPreview(null)}
              className="rounded-full border border-amber-300/20 px-2 py-1 text-xs text-amber-100/70 transition hover:bg-amber-300/10 hover:text-amber-50"
            >
              收起
            </button>
          </div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold">{preview.name}</h3>
            <span className="text-xs text-[var(--subtle)]">刚刚</span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{preview.message}</p>
          <p className="mt-4 rounded-2xl border border-amber-300/20 bg-black/10 px-4 py-3 text-sm text-amber-100">{preview.thanks}</p>
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">写下留言</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的名字（可以不留）"
          className="mb-3 w-full rounded-full border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] focus:border-amber-300/35"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="想说点什么..."
          rows={4}
          className="mb-3 w-full resize-none rounded-[1.5rem] border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] focus:border-amber-300/35"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "提交中..." : "提交留言"}
          </button>
          {status ? <p className={`text-sm ${status.startsWith("你的脚印") ? "text-emerald-400" : "text-red-400"}`}>{status}</p> : null}
        </div>
      </div>
    </div>
  );
}
