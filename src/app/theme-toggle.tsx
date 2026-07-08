"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label="切换主题"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[15px] text-[var(--fg-secondary)] transition hover:text-[var(--fg)] hover:bg-[var(--card-strong)] md:ml-1 md:h-auto md:w-auto md:rounded-md md:border-0 md:bg-transparent md:px-2 md:py-1.5 md:hover:bg-[var(--card)]">
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
