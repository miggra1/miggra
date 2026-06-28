"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

type Props = {
  children: string;
  /** 用于卡片预览模式，去掉图片、代码块等重型元素 */
  preview?: boolean;
  className?: string;
};

export function MarkdownRenderer({ children, preview = false, className }: Props) {
  const cn = preview ? "markdown-content-preview" : "markdown-content";
  return (
    <div className={`${cn}${className ? " " + className : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
