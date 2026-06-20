"use client";

import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "碎碎念" },
  { href: "/now", label: "Now" },
  { href: "/wish", label: "愿望" },
  { href: "/reading", label: "书单" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-sm font-medium tracking-tight">Miggra</Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-[13px] text-[var(--fg-secondary)] rounded-md transition hover:text-[var(--fg)] hover:bg-[var(--card)]">
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="px-3 py-1.5 text-[13px] text-[var(--subtle)] rounded-md transition hover:text-[var(--fg)]">后台</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
