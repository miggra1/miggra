"use client";

import { useState, useRef, useCallback } from "react";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** 是否启用图片上传（依赖 /api/upload 接口） */
  enableImageUpload?: boolean;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "写点什么...",
  rows = 20,
  enableImageUpload = true,
}: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
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
          // 恢复光标位置
          requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = ta.selectionEnd = start + md.length;
          });
        } else {
          onChange(value + "\n" + md);
        }
      } catch {
        // 图片上传失败时静默处理 — 稍后阶段完成 API 路由后即可工作
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
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`rounded-full px-3 py-1 transition ${
            tab === "edit"
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-full px-3 py-1 transition ${
            tab === "preview"
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          预览
        </button>
        {uploading && (
          <span className="ml-auto text-[11px] text-[var(--muted)] animate-pulse">
            ↑ 上传中...
          </span>
        )}
        {enableImageUpload && (
          <span className="ml-auto text-[10px] text-[var(--subtle)]">
            支持拖拽/粘贴图片
          </span>
        )}
      </div>

      {/* Content area */}
      {tab === "edit" ? (
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
      ) : (
        <div
          className="min-h-[200px] rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/50 p-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {value.trim() ? (
            <MarkdownRenderer>{value}</MarkdownRenderer>
          ) : (
            <p className="text-[var(--subtle)] text-sm">暂无内容</p>
          )}
        </div>
      )}
    </div>
  );
}
