"use client";

import { useState, useEffect } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="返回顶部"
      className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl shadow-lg flex items-center justify-center transition hover:bg-[var(--card-strong)] hover:border-[var(--border-strong)] animate-in"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--fg-secondary)]">
        <path d="M8 3L3 8l1.5 1.5L7 7v6h2V7l2.5 2.5L13 8z" fill="currentColor" />
      </svg>
    </button>
  );
}
