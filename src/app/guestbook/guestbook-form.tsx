"use client";

import { useState } from "react";

export function GuestbookForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const submit = async () => {
    setStatus(null);
    const response = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(data?.error ?? "提交失败");
      return;
    }

    setName("");
    setMessage("");
    setStatus("已发布，谢谢你的留言。");
    window.location.reload();
  };

  return (
    <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Leave a note</p>
      <h2 className="mt-2 text-2xl font-semibold">写下你的留言</h2>
      <div className="mt-5 grid gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="昵称（可选）" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="写点什么吧..." rows={5} className="rounded-3xl border border-[var(--border)] bg-transparent px-4 py-3" />
        <button onClick={submit} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-fg)]">
          发布留言
        </button>
        {status ? <p className="text-sm text-[var(--subtle)]">{status}</p> : null}
      </div>
    </section>
  );
}
