"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label="切换主题"
      className="ml-1 px-2 py-1.5 text-[13px] text-[var(--subtle)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)]">
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
