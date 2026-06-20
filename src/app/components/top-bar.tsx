"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "碎碎念" },
  { href: "/now", label: "此刻" },
  { href: "/wish", label: "愿望" },
  { href: "/reading", label: "书单" },
];

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 border-b transition-all duration-500 ${
        scrolled
          ? "border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-2xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
        <Link href="/" prefetch={false} className="text-sm font-medium tracking-[0.25em] text-[var(--fg)]">
          MIGGRA
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="rounded-full border border-transparent px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--border)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            prefetch={false}
            className="rounded-full border border-transparent px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--border)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
          >
            后台
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
