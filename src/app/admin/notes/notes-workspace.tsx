"use client";

import { useMemo, useState, useTransition } from "react";
import type { Note, NoteStatus } from "@prisma/client";

type FormState = {
  id?: string;
  title: string;
  text: string;
  tag: string;
  status: NoteStatus;
  pinned: boolean;
};

const emptyForm = (): FormState => ({ title: "", text: "", tag: "随想", status: "PUBLISHED", pinned: false });

export function NotesWorkspace({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState("");
  const [filterTag, setFilterTag] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | NoteStatus>("ALL");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const tags = useMemo(() => Array.from(new Set(notes.map((n) => n.tag))), [notes]);

  const filtered = useMemo(() => {
    const kw = query.trim().toLowerCase();
    return notes.filter((n) => {
      const mq = !kw || n.title.toLowerCase().includes(kw) || n.text.toLowerCase().includes(kw) || n.tag.toLowerCase().includes(kw);
      const mt = filterTag === "ALL" || n.tag === filterTag;
      const ms = filterStatus === "ALL" || n.status === filterStatus;
      return mq && mt && ms;
    });
  }, [notes, query, filterTag, filterStatus]);

  const refresh = async () => {
    const r = await fetch("/api/notes");
    setNotes(((await r.json()) as { notes: Note[] }).notes);
  };

  const save = async () => {
    if (!editing) return;
    startTransition(async () => {
      const r = await fetch(editing.id ? `/api/notes/${editing.id}` : "/api/notes", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editing.title, text: editing.text, tag: editing.tag, status: editing.status, pinned: editing.pinned }),
      });
      if (!r.ok) return;
      await refresh();
      setEditing(null); setCreating(false);
    });
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除？")) return;
    startTransition(async () => {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      await refresh();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      {/* 列表 */}
      <section className="space-y-3">
        <div className="flex flex-wrap gap-3 mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索..." className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-sm outline-none placeholder:text-zinc-700" />
          <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 font-mono text-xs text-zinc-400 outline-none">
            <option value="ALL">全部标签</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 font-mono text-xs text-zinc-400 outline-none">
            <option value="ALL">全部</option>
            <option value="PUBLISHED">已发布</option>
            <option value="DRAFT">草稿</option>
          </select>
        </div>

        <button
          onClick={() => { setEditing(emptyForm()); setCreating(true); }}
          className="w-full rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-4 font-mono text-xs text-zinc-600 transition hover:border-zinc-600 hover:text-zinc-400"
        >
          + 新建一条碎碎念
        </button>

        {filtered.map((note) => (
          <article key={note.id} className="group rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 transition hover:border-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {note.pinned && <span className="font-mono text-[10px] text-rose-400">📌</span>}
                  <span className="font-mono text-[10px] text-zinc-600">{note.tag}</span>
                  <span className={`font-mono text-[10px] ${note.status === "PUBLISHED" ? "text-emerald-500" : "text-amber-500"}`}>{note.status}</span>
                </div>
                <h3 className="font-serif text-base">{note.title}</h3>
                <p className="mt-1 line-clamp-2 font-mono text-xs leading-relaxed text-zinc-500">{note.text}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing({ id: note.id, title: note.title, text: note.text, tag: note.tag, status: note.status, pinned: note.pinned })} className="rounded-lg border border-white/[0.06] px-3 py-1.5 font-mono text-[10px] text-zinc-400 transition hover:bg-white/[0.04] hover:text-zinc-200">编辑</button>
              <button onClick={() => remove(note.id)} className="rounded-lg border border-red-400/10 px-3 py-1.5 font-mono text-[10px] text-red-400/60 transition hover:bg-red-400/5">删除</button>
            </div>
          </article>
        ))}
      </section>

      {/* 编辑器 */}
      <aside className="lg:sticky lg:top-8 h-fit rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">{editing?.id ? "编辑" : creating ? "新建" : "← 选一条开始写"}</p>
        <div className="mt-4 space-y-4">
          <input value={editing?.title ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm()), title: e.target.value }))} placeholder="标题" className="w-full bg-transparent border-b border-white/[0.06] pb-2 font-serif text-lg outline-none placeholder:text-zinc-800" />
          <textarea value={editing?.text ?? ""} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm()), text: e.target.value }))} placeholder="写下你想说的..." rows={12} className="w-full bg-transparent font-mono text-sm leading-7 text-zinc-300 outline-none placeholder:text-zinc-800 resize-none" />
          <div className="flex gap-3">
            <input value={editing?.tag ?? "随想"} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm()), tag: e.target.value }))} placeholder="标签" className="w-28 rounded-lg border border-white/[0.06] bg-transparent px-3 py-1.5 font-mono text-xs outline-none" />
            <select value={editing?.status ?? "PUBLISHED"} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm()), status: e.target.value as NoteStatus }))} className="rounded-lg border border-white/[0.06] bg-transparent px-3 py-1.5 font-mono text-xs outline-none">
              <option value="PUBLISHED">发布</option>
              <option value="DRAFT">草稿</option>
            </select>
            <label className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <input type="checkbox" checked={editing?.pinned ?? false} onChange={(e) => setEditing((p) => ({ ...(p ?? emptyForm()), pinned: e.target.checked }))} />
              置顶
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={!editing || isPending} className="rounded-full bg-amber-600 px-6 py-2 font-serif text-sm text-white transition hover:bg-amber-500 disabled:opacity-40">保存</button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-full border border-white/[0.06] px-5 py-2 font-mono text-xs text-zinc-500 transition hover:text-zinc-300">取消</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
