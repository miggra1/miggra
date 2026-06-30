"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  name: string;
  message: string;
  reply: string | null;
  repliedAt: string | null;
  status: "PENDING" | "PUBLISHED" | "HIDDEN";
  createdAt: string;
};

export function GuestbookAdminClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    const response = await fetch("/api/admin/guestbook");
    const data = (await response.json()) as { entries: Entry[] };
    setEntries(data.entries);
    setReplyDrafts(Object.fromEntries(data.entries.map((entry) => [entry.id, entry.reply ?? ""])));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh().catch(() => setError("加载留言失败，请稍后重试。"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateEntry = async (payload: { id: string; status?: Entry["status"]; reply?: string }) => {
    if (isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/guestbook", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "更新留言失败。");
      }

      await refresh();
    } catch {
      setError("更新留言失败，请重试。");
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = (id: string, status: Entry["status"]) => updateEntry({ id, status });
  const saveReply = (id: string) => updateEntry({ id, reply: replyDrafts[id] ?? "" });

  return (
    <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Guestbook</p>
          <h2 className="mt-2 text-2xl font-semibold">留言审核</h2>
        </div>
      </div>
      {error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
      <div className="mt-5 grid gap-4">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">{entry.name}</h3>
                <p className="mt-1 text-xs text-[var(--subtle)]">{new Date(entry.createdAt).toLocaleString("zh-CN")}</p>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--subtle)]">{entry.status}</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-[var(--muted)]">{entry.message}</p>
            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">站长回复</span>
                {entry.repliedAt ? <span className="text-[11px] text-[var(--muted)]">{new Date(entry.repliedAt).toLocaleString("zh-CN")}</span> : null}
              </div>
              <textarea
                value={replyDrafts[entry.id] ?? ""}
                onChange={(event) => setReplyDrafts((drafts) => ({ ...drafts, [entry.id]: event.target.value }))}
                rows={3}
                placeholder="写一段公开显示的回复…"
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--subtle)]"
              />
              <button type="button" disabled={isSaving} onClick={() => saveReply(entry.id)} className="mt-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                保存回复
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={isSaving} onClick={() => changeStatus(entry.id, "PUBLISHED")} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] disabled:cursor-not-allowed disabled:opacity-50">
                发布
              </button>
              <button type="button" disabled={isSaving} onClick={() => changeStatus(entry.id, "PENDING")} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                设为待审
              </button>
              <button type="button" disabled={isSaving} onClick={() => changeStatus(entry.id, "HIDDEN")} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                隐藏
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
