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
    setStatus("谢谢你的留言，已经留在簿子上了 ✨");
    router.refresh();
  };

  return (
    <section className="rounded-2xl border-2 border-amber-200/60 bg-white/80 p-6 shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-600/60">Sign the book</p>
      <h2 className="mt-2 font-serif text-2xl font-medium">写下你的留言</h2>

      <div className="mt-5 grid gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的名字（可以不留）"
          className="rounded-xl border-2 border-amber-200/50 bg-amber-50/50 px-4 py-3 font-mono text-sm text-amber-900 placeholder-amber-400/70 outline-none transition focus:border-amber-400/60"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="想说的话..."
          rows={4}
          className="rounded-2xl border-2 border-amber-200/50 bg-amber-50/50 px-4 py-3 font-mono text-sm text-amber-900 placeholder-amber-400/70 outline-none transition focus:border-amber-400/60"
        />
        <button
          onClick={submit}
          className="rounded-full bg-amber-600 px-6 py-3 font-serif text-sm text-white transition hover:bg-amber-700 active:scale-[0.98]"
        >
          留在簿子上
        </button>
        {status ? <p className="font-mono text-xs text-amber-600">{status}</p> : null}
      </div>
    </section>
  );
}
