"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "碎念" },
  { href: "/now", label: "Now" },
  { href: "/wish", label: "愿望" },
  { href: "/reading", label: "书单" },
  { href: "/inspirations", label: "灵感" },
  { href: "/photos", label: "照片" },
  { href: "/timeline", label: "时间线" },
  { href: "/guestbook", label: "留言" },
  { href: "/about", label: "关于" },
];

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full max-w-[100vw] overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]/88 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-10">
        <Link href="/" className="shrink-0 text-sm font-medium tracking-tight">Miggra</Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm leading-none text-[var(--fg-secondary)] transition hover:bg-[var(--card)] hover:text-[var(--fg)]">
              {link.label}
            </Link>
          ))}
          <SearchTrigger />
          <ThemeToggle />
        </nav>

        <nav className="flex shrink-0 items-center gap-1 lg:hidden">
          <SearchTrigger />
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[15px] text-[var(--fg-secondary)] transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"
            aria-label="菜单"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </nav>
      </div>

      {menuOpen ? (
        <nav className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 shadow-2xl shadow-black/20 lg:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--fg-secondary)] transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function SearchTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("miggra:search"))}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[13px] text-[var(--subtle)] transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)] lg:h-auto lg:w-auto lg:gap-1.5 lg:rounded-md lg:border-0 lg:bg-transparent lg:px-3 lg:py-1.5 lg:hover:bg-[var(--card)]"
      title="搜索 (⌘K)"
    >
      <span className="lg:hidden">⌕</span>
      <span className="hidden lg:inline">搜索</span>
      <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--subtle)] xl:inline">
        ⌘K
      </kbd>
    </button>
  );
}
