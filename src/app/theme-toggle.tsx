"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent-glow)] hover:text-[var(--fg)]"
      aria-label="切换主题"
    >
      {theme === "dark" ? "亮" : "暗"}
    </button>
  );
}
