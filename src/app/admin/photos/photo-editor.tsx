"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type PhotoEditorProps = {
  mode: "new" | "edit";
  photo?: {
    id: string;
    url: string;
    caption: string;
    album: string;
    takenAt: string;
    location: string;
    tags: string;
    featured: boolean;
    active: boolean;
    order: number;
  };
};

export function PhotoEditor({ mode, photo }: PhotoEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [caption, setCaption] = useState(photo?.caption ?? "");
  const [album, setAlbum] = useState(photo?.album ?? "");
  const [takenAt, setTakenAt] = useState(photo?.takenAt ?? "");
  const [location, setLocation] = useState(photo?.location ?? "");
  const [tags, setTags] = useState(photo?.tags ?? "");
  const [featured, setFeatured] = useState(photo?.featured ?? false);
  const [active, setActive] = useState(photo?.active ?? true);
  const [order, setOrder] = useState(photo?.order ?? 0);
  const [error, setError] = useState("");

  const save = () => {
    if (!photo?.id) return;
    setError("");
    startTransition(async () => {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, album, takenAt, location, tags, featured, active, order }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "保存失败");
        return;
      }

      router.push("/admin/photos");
      router.refresh();
    });
  };

  return (
    <div className="px-6 py-10 max-w-3xl animate-in">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#a855f7]">Photos</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">{mode === "edit" ? "编辑照片" : "照片信息"}</h1>
        </div>
        <button onClick={() => router.back()} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition">← 返回</button>
      </div>

      {photo?.url ? (
        <div className="mb-6 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
          <img src={photo.url} alt={caption} className="w-full max-h-[420px] object-contain" />
        </div>
      ) : null}

      {error ? <p className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

      <div className="grid gap-4">
        <input value={caption} onChange={(event) => setCaption(event.target.value)} className="input" placeholder="照片描述" />
        <div className="grid gap-4 md:grid-cols-2">
          <input value={album} onChange={(event) => setAlbum(event.target.value)} className="input" placeholder="相册，例如：旅行、日常" />
          <input type="date" value={takenAt} onChange={(event) => setTakenAt(event.target.value)} className="input" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={location} onChange={(event) => setLocation(event.target.value)} className="input" placeholder="地点" />
          <input value={tags} onChange={(event) => setTags(event.target.value)} className="input" placeholder="标签，用逗号分隔" />
        </div>
        <input type="number" value={order} onChange={(event) => setOrder(Number(event.target.value))} className="input" placeholder="排序" />
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> 精选
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> 前台显示
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={isPending || !photo?.id} className="btn btn-primary">{isPending ? "保存中..." : "保存修改"}</button>
          <button onClick={() => router.back()} className="btn">取消</button>
        </div>
      </div>
    </div>
  );
}
