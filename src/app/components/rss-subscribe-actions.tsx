"use client";

import { useState } from "react";

export function RssSubscribeActions() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyRssUrl = async () => {
    try {
      const url = new URL("/rss", window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <a href="/rss" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">
        打开 RSS 源
      </a>
      <button
        type="button"
        onClick={copyRssUrl}
        className="text-left text-xs text-[var(--muted)] transition hover:text-[var(--fg)]"
      >
        {status === "copied" ? "已复制订阅链接" : status === "error" ? "复制失败，请打开 RSS 源" : "复制订阅链接"}
      </button>
    </div>
  );
}
