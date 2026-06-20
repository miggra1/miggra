import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "./login";
import Link from "next/link";
import type { ReactNode } from "react";

const navSections = [
  { href: "/admin", label: "总览", icon: "◈", exact: true },
  { href: "/admin/notes", label: "碎碎念", icon: "✎" },
  { href: "/admin/now", label: "Now", icon: "▸" },
  { href: "/admin/wish", label: "愿望", icon: "✦" },
  { href: "/admin/reading", label: "书单", icon: "▣" },
  { href: "/admin/inspirations", label: "灵感", icon: "◆" },
  { href: "/admin/timeline", label: "时间线", icon: "◷" },
  { href: "/admin/guestbook", label: "留言", icon: "✉" },
  { href: "/admin/modules", label: "模块", icon: "⚙" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) return <AdminLogin />;

  return (
    <div className="flex min-h-screen bg-[#0e0e10] text-[#d4d4d8]">
      {/* 侧栏 */}
      <aside className="hidden w-52 shrink-0 border-r border-white/[0.05] bg-white/[0.015] md:block">
        <div className="flex h-full flex-col">
          <Link href="/admin" className="block border-b border-white/[0.05] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-400 hover:text-white transition">
            Miggra Admin
          </Link>
          <nav className="flex-1 space-y-0.5 px-3 py-4">
            {navSections.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-zinc-200"
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/[0.05] px-5 py-4">
            <Link href="/" className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 transition">
              ← 回到前台
            </Link>
          </div>
        </div>
      </aside>

      {/* 移动端导航 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-1 overflow-x-auto border-t border-white/[0.05] bg-[#0e0e10]/95 px-2 py-2 backdrop-blur md:hidden">
        {navSections.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] text-zinc-400 transition hover:text-white"
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 主内容 */}
      <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">{children}</main>
    </div>
  );
}
