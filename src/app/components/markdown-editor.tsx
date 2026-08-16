"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  enableImageUpload?: boolean;
};

type EditorFont = string;

type FontOption = {
  value: EditorFont;
  label: string;
  family: string;
};

type FontGroup = {
  label: string;
  options: FontOption[];
};

const FONT_STORAGE_KEY = "miggra-editor-font";
const SIZE_STORAGE_KEY = "miggra-editor-font-size";
const FONT_GROUPS: FontGroup[] = [
  {
    label: "基础与阅读",
    options: [
      { value: "system", label: "系统默认", family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      { value: "sans", label: "现代黑体", family: "'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif" },
      { value: "serif", label: "宋体阅读", family: "'Noto Serif SC', 'Songti SC', SimSun, serif" },
      { value: "mono", label: "等宽字体", family: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace" },
      { value: "microsoft-yahei", label: "微软雅黑", family: "'Microsoft YaHei', 'PingFang SC', sans-serif" },
      { value: "pingfang", label: "苹方", family: "'PingFang SC', 'Microsoft YaHei', sans-serif" },
      { value: "source-han-sans", label: "思源黑体", family: "'Source Han Sans SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif" },
      { value: "source-han-serif", label: "思源宋体", family: "'Source Han Serif SC', 'Noto Serif CJK SC', SimSun, serif" },
    ],
  },
  {
    label: "中文经典",
    options: [
      { value: "simsun", label: "宋体", family: "SimSun, 'Songti SC', serif" },
      { value: "nsimsun", label: "新宋体", family: "NSimSun, SimSun, serif" },
      { value: "simhei", label: "黑体", family: "SimHei, 'Microsoft YaHei', sans-serif" },
      { value: "kaiti", label: "楷体", family: "KaiTi, STKaiti, serif" },
      { value: "fangsong", label: "仿宋", family: "FangSong, STFangsong, serif" },
      { value: "dengxian", label: "等线", family: "DengXian, 'Microsoft YaHei', sans-serif" },
      { value: "youyuan", label: "幼圆", family: "YouYuan, 'Microsoft YaHei', sans-serif" },
      { value: "lishu", label: "隶书", family: "LiSu, STLiti, serif" },
      { value: "st-song", label: "华文宋体", family: "STSong, SimSun, serif" },
      { value: "st-zhongsong", label: "华文中宋", family: "STZhongsong, STSong, serif" },
      { value: "st-fangsong", label: "华文仿宋", family: "STFangsong, FangSong, serif" },
      { value: "st-kaiti", label: "华文楷体", family: "STKaiti, KaiTi, serif" },
      { value: "st-xihei", label: "华文细黑", family: "STXihei, 'Microsoft YaHei', sans-serif" },
    ],
  },
  {
    label: "中文艺术字",
    options: [
      { value: "st-xingkai", label: "华文行楷", family: "STXingkai, KaiTi, cursive" },
      { value: "st-liti", label: "华文隶书", family: "STLiti, LiSu, serif" },
      { value: "st-hupo", label: "华文琥珀", family: "STHupo, YouYuan, fantasy" },
      { value: "st-caiyun", label: "华文彩云", family: "STCaiyun, YouYuan, fantasy" },
      { value: "st-xinwei", label: "华文新魏", family: "STXinwei, KaiTi, serif" },
      { value: "fz-shuti", label: "方正舒体", family: "FZShuTi, STXingkai, cursive" },
      { value: "fz-yaoti", label: "方正姚体", family: "FZYaoTi, STZhongsong, serif" },
      { value: "hanyi-xingkai", label: "汉仪行楷", family: "'HYXingKaiJ', STXingkai, KaiTi, cursive" },
      { value: "hanyi-shuangxian", label: "汉仪双线体", family: "'HYShuangXianJ', STHupo, fantasy" },
      { value: "hanyi-caiyun", label: "汉仪彩云体", family: "'HYCaiYunJ', STCaiyun, fantasy" },
      { value: "hanyi-yanling", label: "汉仪雁翎体", family: "'HYYanLingJ', STXinwei, serif" },
      { value: "hanyi-lingxin", label: "汉仪菱心体", family: "'HYLingXinJ', YouYuan, fantasy" },
    ],
  },
  {
    label: "现代设计",
    options: [
      { value: "segoe-ui", label: "Segoe UI", family: "'Segoe UI', system-ui, sans-serif" },
      { value: "helvetica", label: "Helvetica Neue", family: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
      { value: "avenir", label: "Avenir Next", family: "'Avenir Next', Avenir, 'Segoe UI', sans-serif" },
      { value: "futura", label: "Futura", family: "Futura, 'Century Gothic', Arial, sans-serif" },
      { value: "century-gothic", label: "Century Gothic", family: "'Century Gothic', Futura, Arial, sans-serif" },
      { value: "gill-sans", label: "Gill Sans", family: "'Gill Sans', 'Segoe UI', sans-serif" },
      { value: "trebuchet", label: "Trebuchet MS", family: "'Trebuchet MS', Arial, sans-serif" },
      { value: "franklin", label: "Franklin Gothic", family: "'Franklin Gothic Medium', Arial, sans-serif" },
      { value: "verdana", label: "Verdana", family: "Verdana, Geneva, sans-serif" },
      { value: "tahoma", label: "Tahoma", family: "Tahoma, Verdana, sans-serif" },
      { value: "calibri", label: "Calibri", family: "Calibri, 'Segoe UI', sans-serif" },
      { value: "arial", label: "Arial", family: "Arial, Helvetica, sans-serif" },
    ],
  },
  {
    label: "经典衬线",
    options: [
      { value: "georgia", label: "Georgia", family: "Georgia, 'Times New Roman', serif" },
      { value: "times", label: "Times New Roman", family: "'Times New Roman', Times, serif" },
      { value: "baskerville", label: "Baskerville", family: "Baskerville, Georgia, serif" },
      { value: "garamond", label: "Garamond", family: "Garamond, Georgia, serif" },
      { value: "palatino", label: "Palatino", family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
      { value: "didot", label: "Didot", family: "Didot, Bodoni, Georgia, serif" },
      { value: "bodoni", label: "Bodoni MT", family: "'Bodoni MT', Didot, Georgia, serif" },
      { value: "cambria", label: "Cambria", family: "Cambria, Georgia, serif" },
      { value: "constantia", label: "Constantia", family: "Constantia, Cambria, serif" },
      { value: "book-antiqua", label: "Book Antiqua", family: "'Book Antiqua', Palatino, serif" },
    ],
  },
  {
    label: "手写与艺术",
    options: [
      { value: "segoe-print", label: "Segoe Print", family: "'Segoe Print', 'Comic Sans MS', cursive" },
      { value: "segoe-script", label: "Segoe Script", family: "'Segoe Script', 'Brush Script MT', cursive" },
      { value: "brush-script", label: "Brush Script", family: "'Brush Script MT', 'Segoe Script', cursive" },
      { value: "lucida-hand", label: "Lucida Handwriting", family: "'Lucida Handwriting', cursive" },
      { value: "bradley-hand", label: "Bradley Hand", family: "'Bradley Hand', 'Segoe Print', cursive" },
      { value: "snell-roundhand", label: "Snell Roundhand", family: "'Snell Roundhand', 'Segoe Script', cursive" },
      { value: "copperplate", label: "Copperplate", family: "Copperplate, 'Copperplate Gothic Light', fantasy" },
      { value: "papyrus", label: "Papyrus", family: "Papyrus, fantasy" },
    ],
  },
  {
    label: "等宽创作",
    options: [
      { value: "cascadia-code", label: "Cascadia Code", family: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace" },
      { value: "consolas", label: "Consolas", family: "Consolas, 'Cascadia Mono', monospace" },
      { value: "jetbrains-mono", label: "JetBrains Mono", family: "'JetBrains Mono', Consolas, monospace" },
      { value: "sf-mono", label: "SF Mono", family: "'SFMono-Regular', Menlo, Monaco, monospace" },
      { value: "menlo", label: "Menlo", family: "Menlo, Monaco, Consolas, monospace" },
      { value: "monaco", label: "Monaco", family: "Monaco, Menlo, Consolas, monospace" },
      { value: "courier-new", label: "Courier New", family: "'Courier New', Courier, monospace" },
      { value: "lucida-console", label: "Lucida Console", family: "'Lucida Console', Monaco, monospace" },
    ],
  },
];
const FONT_OPTIONS = FONT_GROUPS.flatMap((group) => group.options);
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
        <div className="markdown-editor-type-heading">
          <span>写作样式</span>
          <small>{FONT_OPTIONS.length} 款字体</small>
        </div>
        <span className="markdown-editor-font-preview" style={{ fontFamily: selectedFont.family }} aria-hidden="true">
          字 Aa
        </span>
        <label>
          <span>字体类型</span>
          <select
            value={editorFont}
            onChange={(event) => changeFont(event.target.value)}
            style={{ fontFamily: selectedFont.family }}
            title="字体效果取决于当前设备已安装的字体，缺失时会自动使用相近字体"
          >
            {FONT_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value} style={{ fontFamily: option.family }}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
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
        style={{ fontFamily: selectedFont.family, fontSize: `${editorFontSize / 16}rem` }}
      />
      {uploading && (
        <p className="mt-1 text-[11px] text-[var(--muted)] animate-pulse">
          ↑ 上传中...
        </p>
      )}
    </div>
  );
}
