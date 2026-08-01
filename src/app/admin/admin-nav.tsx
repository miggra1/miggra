"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "总览", symbol: "⌂" },
  { href: "/admin/notes", label: "碎碎念", symbol: "✎" },
  { href: "/admin/now", label: "此刻", symbol: "◷" },
  { href: "/admin/inspirations", label: "灵感", symbol: "✦" },
  { href: "/admin/photos", label: "影像", symbol: "▧" },
  { href: "/admin/reading", label: "阅读", symbol: "▣" },
  { href: "/admin/wish", label: "愿望", symbol: "◇" },
  { href: "/admin/timeline", label: "时间线", symbol: "⌁" },
  { href: "/admin/guestbook", label: "留言", symbol: "○" },
  { href: "/admin/pages", label: "页面", symbol: "□" },
  { href: "/admin/modules", label: "模块", symbol: "⊞" },
];

function isCurrent(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="studio-sidebar">
        <Link href="/admin" className="studio-brand"><span className="studio-brand-mark"><i /><i /></span><span><b>MIGGRA</b><small>创作空间</small></span></Link>
        <nav className="studio-nav" aria-label="创作空间导航">
          <p>Workspace</p>
          {nav.slice(0, 8).map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><span>{item.symbol}</span>{item.label}</Link>)}
          <p>Manage</p>
          {nav.slice(8).map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><span>{item.symbol}</span>{item.label}</Link>)}
        </nav>
        <div className="studio-sidebar-foot">
          <Link href="/">← 返回前台</Link>
          <form action="/api/auth/logout" method="POST"><button type="submit">退出</button></form>
        </div>
      </aside>

      <nav className="studio-mobile-nav" aria-label="移动端创作导航">
        {nav.slice(0, 6).map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><span>{item.symbol}</span>{item.label}</Link>)}
      </nav>
    </>
  );
}
