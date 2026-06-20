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
    const r = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message }) });
    if (!r.ok) { const d = await r.json().catch(() => null) as any; setStatus(d?.error ?? "提交失败"); return; }
    setName(""); setMessage(""); setStatus("谢谢你的留言 ✨"); router.refresh();
  };

  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)] mb-4">写下留言</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的名字（可以不留）"
        className="w-full rounded-full border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] mb-3" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="想说点什么..."
        rows={4} className="w-full rounded-[1.5rem] border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[var(--subtle)] resize-none mb-3" />
      <div className="flex items-center gap-4">
        <button onClick={submit} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90">发布留言</button>
        {status && <p className="text-sm text-[var(--muted)]">{status}</p>}
      </div>
    </div>
  );
}
