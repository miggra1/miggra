"use client";

import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "归档" },
  { href: "/now", label: "Now" },
  { href: "/wish", label: "愿望" },
  { href: "/reading", label: "书单" },
];

export function TopBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
        <Link href="/" prefetch={false} className="text-sm font-medium tracking-[0.2em] text-white/80">
          MIGGRA
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={false} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
              {link.label}
            </Link>
          ))}
          <Link href="/admin" prefetch={false} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
            后台
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
