"use client";

import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export function TopBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="text-sm font-medium tracking-[0.2em] text-white/80">
          MIGGRA
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/notes" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
            归档
          </Link>
          <Link href="/admin" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
            后台
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
