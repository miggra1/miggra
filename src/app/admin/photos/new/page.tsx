"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewPhotoPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (file: File) => {
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUrl("");
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", pendingFile);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("上传失败");
      const data = (await res.json()) as { url: string };
      setUrl(data.url);
      setPendingFile(null);
    } catch {
      alert("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!url) return;
    setSaving(true);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption: caption.trim() || undefined }),
      });
      if (!res.ok) throw new Error("保存失败");
      router.push("/admin/photos");
      router.refresh();
    } catch {
      alert("保存失败");
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-10 max-w-2xl animate-in">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-[#a855f7]">Photos</p>
        <h1 className="text-[28px] font-semibold mt-1 tracking-tight">上传照片</h1>
      </div>

      <div className="space-y-6">
        {/* Upload area */}
        {!url ? (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelected(f); }}
            onDragOver={(e) => e.preventDefault()}
            className="relative border-2 border-dashed border-[var(--border)] rounded-2xl p-10 text-center cursor-pointer hover:border-[var(--border-strong)] transition"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); }}
            />
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="预览" className="max-h-72 mx-auto rounded-xl object-contain" />
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={uploading}
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                >
                  {uploading ? "上传中..." : "确认上传"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-3">📷</p>
                <p className="text-sm text-[var(--fg-secondary)]">点击选择或拖拽图片到这里</p>
                <p className="text-[11px] text-[var(--muted)] mt-1">支持 JPG / PNG / GIF / WebP</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
              <img src={url} alt="" className="w-full h-64 object-cover" />
            </div>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="照片描述（可选）"
              className="w-full bg-transparent border-b border-[var(--border)] pb-2 text-[15px] outline-none placeholder:text-[var(--subtle)] focus:border-[var(--border-strong)] transition"
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "保存中..." : "保存到照片墙"}
              </button>
              <button
                type="button"
                className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition"
                onClick={() => { setUrl(""); setPreviewUrl(null); setPendingFile(null); }}
              >
                重选
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
