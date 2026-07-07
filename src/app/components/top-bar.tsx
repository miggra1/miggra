"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "碎碎念" },
  { href: "/now", label: "Now" },
  { href: "/wish", label: "愿望" },
  { href: "/reading", label: "书单" },
  { href: "/inspirations", label: "灵感" },
  { href: "/timeline", label: "时间线" },
  { href: "/photos", label: "照片" },
  { href: "/guestbook", label: "留言" },
];

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-sm font-medium tracking-tight">Miggra</Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-[13px] text-[var(--fg-secondary)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)]">
              {link.label}
            </Link>
          ))}
          <SearchTrigger />
          <Link href="/admin" className="px-3 py-1.5 text-[13px] text-[var(--subtle)] rounded-md transition hover:text-[var(--fg)]">后台</Link>
          <ThemeToggle />
        </nav>

        {/* Mobile */}
        <nav className="flex md:hidden items-center gap-1">
          <SearchTrigger />
          <Link href="/admin" className="px-2 py-1.5 text-[13px] text-[var(--subtle)] rounded-md transition hover:text-[var(--fg)]">后台</Link>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-2 py-1.5 text-[15px] text-[var(--fg-secondary)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)]"
            aria-label="菜单"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-6 py-3">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm text-[var(--fg-secondary)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("miggra:search"))}
      className="px-3 py-1.5 text-[13px] text-[var(--subtle)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)] flex items-center gap-1.5"
      title="搜索 (⌘K)"
    >
      <span>搜索</span>
      <kbd className="text-[10px] text-[var(--subtle)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono leading-none hidden sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
