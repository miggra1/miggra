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
    <div className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
        <Link href="/" prefetch={false} className="text-sm font-medium tracking-[0.2em] text-[var(--fg)]">
          MIGGRA
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={false} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm transition hover:bg-[var(--card-strong)]">
              {link.label}
            </Link>
          ))}
          <Link href="/admin" prefetch={false} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm transition hover:bg-[var(--card-strong)]">
            后台
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
