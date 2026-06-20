"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GuestbookForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setStatus(null);
    const r = await fetch("/api/guestbook", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    if (!r.ok) { const d = await r.json().catch(() => null) as any; setStatus(d?.error ?? "提交失败"); return; }
    setName(""); setMessage(""); setStatus("已发布"); router.refresh();
  };

  return (
    <div className="card-apple p-6">
      <p className="text-xs text-[var(--subtle)] uppercase tracking-widest mb-4">写下留言</p>
      <div className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的名字（可以不留）"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none placeholder:text-[var(--subtle)]" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="想说的话..." rows={3}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none resize-none placeholder:text-[var(--subtle)]" />
        <div className="flex items-center justify-between">
          <button onClick={submit} className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-full transition hover:opacity-90">发布</button>
          {status && <p className="text-[13px] text-[var(--fg-secondary)]">{status}</p>}
        </div>
      </div>
    </div>
  );
}
