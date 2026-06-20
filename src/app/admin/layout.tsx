import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "./login";
import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "总览", color: "#6b7280" },
  { href: "/admin/notes", label: "碎碎念", color: "#3b82f6" },
  { href: "/admin/now", label: "Now", color: "#22c55e" },
  { href: "/admin/wish", label: "愿望", color: "#8b5cf6" },
  { href: "/admin/reading", label: "书单", color: "#f59e0b" },
  { href: "/admin/inspirations", label: "灵感", color: "#ec4899" },
  { href: "/admin/timeline", label: "时间线", color: "#06b6d4" },
  { href: "/admin/guestbook", label: "留言", color: "#f97316" },
  { href: "/admin/modules", label: "模块", color: "#6b7280" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) return <AdminLogin />;

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <aside className="hidden w-48 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] md:flex flex-col">
        <Link href="/admin" className="px-5 py-4 text-xs font-semibold tracking-widest text-[var(--fg-secondary)] hover:text-[var(--fg)] transition">
          MIGGRA
        </Link>
        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-[var(--fg-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]"
            >
              <span className="h-1.5 w-1.5 rounded-full shrink-0 transition group-hover:scale-125" style={{ backgroundColor: item.color }} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[var(--border)]">
          <Link href="/" className="text-xs text-[var(--subtle)] hover:text-[var(--fg)] transition">← 回前台</Link>
        </div>
      </aside>

      {/* Mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl md:hidden flex overflow-x-auto px-2 py-2 gap-0.5">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] text-[var(--fg-secondary)]">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </Link>
        ))}
      </div>

      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
