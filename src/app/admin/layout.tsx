import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "./login";
import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "总览" },
  { href: "/admin/notes", label: "碎碎念" },
  { href: "/admin/now", label: "Now" },
  { href: "/admin/wish", label: "愿望" },
  { href: "/admin/reading", label: "书单" },
  { href: "/admin/inspirations", label: "灵感" },
  { href: "/admin/timeline", label: "时间线" },
  { href: "/admin/guestbook", label: "留言" },
  { href: "/admin/modules", label: "模块" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) return <AdminLogin />;

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <aside className="hidden w-44 shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] md:flex flex-col">
        <Link href="/admin" className="px-5 py-4 text-xs font-medium tracking-widest text-[var(--fg-secondary)]">
          MIGGRA
        </Link>
        <nav className="flex-1 px-3 space-y-px">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}
              className="block rounded-lg px-3 py-2 text-[13px] text-[var(--fg-secondary)] transition hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >{item.label}</Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[var(--border)]">
          <Link href="/" className="text-xs text-[var(--subtle)] hover:text-[var(--fg)]">← 前台</Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl md:hidden flex overflow-x-auto px-3 py-2 gap-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 px-3 py-2 text-[11px] text-[var(--fg-secondary)]">{item.label}</Link>
        ))}
      </div>

      <main className="flex-1 pb-14 md:pb-0">{children}</main>
    </div>
  );
}
