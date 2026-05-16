"use client";

import { useMemo, useState, useTransition } from "react";
import type { Note, NoteStatus } from "@prisma/client";

type AdminClientProps = {
  initialNotes: Note[];
};

type FormState = {
  id?: string;
  title: string;
  text: string;
  tag: string;
  status: NoteStatus;
  pinned: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  text: "",
  tag: "随想",
  status: "PUBLISHED",
  pinned: false,
});

export function AdminClient({ initialNotes }: AdminClientProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState("");
  const [filterTag, setFilterTag] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | NoteStatus>("ALL");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const tags = useMemo(() => Array.from(new Set(notes.map((note) => note.tag))), [notes]);

  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesQuery =
        !keyword ||
        note.title.toLowerCase().includes(keyword) ||
        note.text.toLowerCase().includes(keyword) ||
        note.tag.toLowerCase().includes(keyword);
      const matchesTag = filterTag === "ALL" || note.tag === filterTag;
      const matchesStatus = filterStatus === "ALL" || note.status === filterStatus;
      return matchesQuery && matchesTag && matchesStatus;
    });
  }, [notes, query, filterTag, filterStatus]);

  const refreshNotes = async () => {
    const response = await fetch("/api/notes");
    const data = (await response.json()) as { notes: Note[] };
    setNotes(data.notes);
  };

  const handleCreate = () => {
    setEditing(emptyForm());
    setCreating(true);
  };

  const handleEdit = (note: Note) => {
    setEditing({
      id: note.id,
      title: note.title,
      text: note.text,
      tag: note.tag,
      status: note.status,
      pinned: note.pinned,
    });
    setCreating(false);
  };

  const handleSave = async () => {
    if (!editing) return;

    startTransition(async () => {
      const payload = {
        title: editing.title,
        text: editing.text,
        tag: editing.tag,
        status: editing.status,
        pinned: editing.pinned,
      };

      const response = await fetch(editing.id ? `/api/notes/${editing.id}` : "/api/notes", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) return;

      await refreshNotes();
      setEditing(null);
      setCreating(false);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这条碎碎念吗？")) return;

    startTransition(async () => {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!response.ok) return;
      await refreshNotes();
      if (editing?.id === id) {
        setEditing(null);
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/35">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold">内容管理</h2>
            </div>
            <button
              onClick={handleCreate}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              新建碎碎念
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题、内容、标签"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35"
            />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">全部标签</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "ALL" | NoteStatus)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">全部状态</option>
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className={`rounded-[1.5rem] border bg-white/5 p-6 ${note.pinned ? "border-amber-300/30" : "border-white/10"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-medium">{note.title}</h3>
                  <p className="mt-1 text-xs text-white/45">{new Date(note.createdAt).toLocaleString("zh-CN")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.pinned ? <span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs text-amber-100">置顶</span> : null}
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{note.tag}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{note.status}</span>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-white/65">{note.text}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleEdit(note)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Editor</p>
          <h2 className="mt-2 text-2xl font-semibold">{editing?.id ? "编辑碎碎念" : creating ? "新建碎碎念" : "选择一条内容开始编辑"}</h2>
          <div className="mt-5 space-y-4">
            <input
              value={editing?.title ?? ""}
              onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), title: e.target.value }))}
              placeholder="标题"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35"
            />
            <input
              value={editing?.tag ?? ""}
              onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), tag: e.target.value }))}
              placeholder="标签"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35"
            />
            <select
              value={editing?.status ?? "PUBLISHED"}
              onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), status: e.target.value as NoteStatus }))}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            >
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/75">
              <input
                type="checkbox"
                checked={editing?.pinned ?? false}
                onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), pinned: e.target.checked }))}
              />
              置顶这条碎碎念
            </label>
            <textarea
              value={editing?.text ?? ""}
              onChange={(e) => setEditing((prev) => ({ ...(prev ?? emptyForm()), text: e.target.value }))}
              placeholder="内容"
              rows={10}
              className="w-full rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={!editing || isPending}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              保存
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setCreating(false);
              }}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:bg-white/10"
            >
              取消
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
