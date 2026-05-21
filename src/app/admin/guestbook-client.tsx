"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  name: string;
  message: string;
  status: "PENDING" | "PUBLISHED" | "HIDDEN";
  createdAt: string;
};

export function GuestbookAdminClient() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const refresh = async () => {
    const response = await fetch("/api/admin/guestbook");
    const data = (await response.json()) as { entries: Entry[] };
    setEntries(data.entries);
  };

  useEffect(() => {
    refresh();
  }, []);

  const changeStatus = async (id: string, status: Entry["status"]) => {
    await fetch("/api/admin/guestbook", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await refresh();
  };

  return (
    <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Guestbook</p>
          <h2 className="mt-2 text-2xl font-semibold">留言审核</h2>
        </div>
      </div>
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
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => changeStatus(entry.id, "PUBLISHED")} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)]">
                发布
              </button>
              <button onClick={() => changeStatus(entry.id, "PENDING")} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">
                设为待审
              </button>
              <button onClick={() => changeStatus(entry.id, "HIDDEN")} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">
                隐藏
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
