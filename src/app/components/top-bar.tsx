"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/notes", label: "笔记" },
  { href: "/photos", label: "图像" },
  { href: "/inspirations", label: "灵感" },
  { href: "/reading", label: "阅读" },
  { href: "/timeline", label: "时间线" },
  { href: "/about", label: "关于" },
];

export function TopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="topbar-brand" aria-label="Miggra 创作空间">
          <span className="topbar-mark" aria-hidden="true">M</span>
          <span className="topbar-brand-name">MIGGRA</span>
          <span className="topbar-brand-sub">创作空间</span>
        </Link>

        <nav className="topbar-nav" aria-label="主导航">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <SearchTrigger />
          <ThemeToggle />
          <button
            type="button"
            className="topbar-action topbar-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "关闭导航" : "打开导航"}
          >
            {menuOpen ? "关闭" : "菜单"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="topbar-mobile-menu-panel" aria-label="移动端主导航">
          <div className="topbar-mobile-menu-grid">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/guestbook" onClick={() => setMenuOpen(false)}>留言板</Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)}>管理</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("miggra:search"))}
      className="topbar-action"
      title="搜索（⌘K）"
    >
      <span aria-hidden="true">⌕</span>
      <span className="hidden sm:inline">搜索</span>
      <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--subtle)] lg:inline">⌘K</kbd>
    </button>
  );
}
