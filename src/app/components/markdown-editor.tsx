"use client";

import { useState, useRef, useCallback } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  enableImageUpload?: boolean;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "写点什么...",
  rows = 20,
  enableImageUpload = true,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!enableImageUpload) return;
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("上传失败");
        const data = (await res.json()) as { url: string };
        const md = `![](${data.url})`;
        const ta = textareaRef.current;
        if (ta) {
          const start = ta.selectionStart;
          const end = ta.selectionEnd;
          const before = value.slice(0, start);
          const after = value.slice(end);
          const newValue = before + md + after;
          onChange(newValue);
          requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = ta.selectionEnd = start + md.length;
          });
        } else {
          onChange(value + "\n" + md);
        }
      } catch {
        // 图片上传失败静默处理
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, enableImageUpload],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) uploadImage(file);
          return;
        }
      }
    },
    [uploadImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      if (file.type.startsWith("image/")) {
        uploadImage(file);
      }
    },
    [uploadImage],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder={placeholder}
        rows={rows}
        className="w-full text-[16px] leading-[1.8] bg-transparent border border-[var(--border)] rounded-xl p-4 outline-none resize-none placeholder:text-[var(--subtle)] focus:border-[var(--border-strong)] transition"
      />
      {uploading && (
        <p className="mt-1 text-[11px] text-[var(--muted)] animate-pulse">
          ↑ 上传中...
        </p>
      )}
    </div>
  );
}
