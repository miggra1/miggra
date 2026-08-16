"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  enableImageUpload?: boolean;
};

type EditorFont = "system" | "serif" | "sans" | "mono";

const FONT_STORAGE_KEY = "miggra-editor-font";
const SIZE_STORAGE_KEY = "miggra-editor-font-size";
const FONT_OPTIONS: Array<{ value: EditorFont; label: string; family: string }> = [
  { value: "system", label: "系统字体", family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { value: "serif", label: "宋体阅读", family: "'Noto Serif SC', 'Songti SC', SimSun, serif" },
  { value: "sans", label: "现代黑体", family: "'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif" },
  { value: "mono", label: "等宽字体", family: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace" },
];
const FONT_SIZES = [14, 16, 18, 20, 22];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "写点什么...",
  rows = 20,
  enableImageUpload = true,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [editorFont, setEditorFont] = useState<EditorFont>("system");
  const [editorFontSize, setEditorFontSize] = useState(16);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const savedFont = window.localStorage.getItem(FONT_STORAGE_KEY) as EditorFont | null;
        const savedSize = Number(window.localStorage.getItem(SIZE_STORAGE_KEY));
        if (savedFont && FONT_OPTIONS.some((option) => option.value === savedFont)) setEditorFont(savedFont);
        if (FONT_SIZES.includes(savedSize)) setEditorFontSize(savedSize);
      } catch {
        // Writing preferences are optional when storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  function changeFont(value: EditorFont) {
    setEditorFont(value);
    try { window.localStorage.setItem(FONT_STORAGE_KEY, value); } catch { /* ignore */ }
  }

  function changeFontSize(value: number) {
    setEditorFontSize(value);
    try { window.localStorage.setItem(SIZE_STORAGE_KEY, String(value)); } catch { /* ignore */ }
  }

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

  const selectedFont = FONT_OPTIONS.find((option) => option.value === editorFont) ?? FONT_OPTIONS[0];

  return (
    <div className="markdown-editor-shell">
      <div className="markdown-editor-type-controls" role="group" aria-label="写作字体设置">
        <span>写作样式</span>
        <label>
          <span>字体类型</span>
          <select value={editorFont} onChange={(event) => changeFont(event.target.value as EditorFont)}>
            {FONT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>字体大小</span>
          <select value={editorFontSize} onChange={(event) => changeFontSize(Number(event.target.value))}>
            {FONT_SIZES.map((size) => <option key={size} value={size}>{size} px</option>)}
          </select>
        </label>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder={placeholder}
        rows={rows}
        className="markdown-editor-field w-full leading-[1.8] bg-transparent border border-[var(--border)] p-4 outline-none resize-none placeholder:text-[var(--subtle)] focus:border-[var(--border-strong)] transition"
        style={{ fontFamily: selectedFont.family, fontSize: `${editorFontSize}px` }}
      />
      {uploading && (
        <p className="mt-1 text-[11px] text-[var(--muted)] animate-pulse">
          ↑ 上传中...
        </p>
      )}
    </div>
  );
}
