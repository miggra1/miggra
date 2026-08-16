"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioIcon } from "./studio-icon";

const primaryNav = [
  { href: "/admin", label: "首页", icon: "home" as const },
  { href: "/admin/inspirations", label: "灵感库", icon: "sparkle" as const },
  { href: "/admin/notes", label: "作品集", icon: "folder" as const },
  { href: "/admin/photos", label: "影像库", icon: "image" as const },
  { href: "/admin/pages", label: "独立页面", icon: "file" as const },
  { href: "/admin/reading", label: "阅读收藏", icon: "book" as const },
];

const secondaryNav = [
  { href: "/admin/now", label: "此刻", icon: "clock" as const },
  { href: "/admin/wish", label: "愿望清单", icon: "heart" as const },
  { href: "/admin/timeline", label: "时间线", icon: "timeline" as const },
];

const mobileNav = [...primaryNav, ...secondaryNav];

function isCurrent(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="studio-sidebar">
        <Link href="/admin" className="studio-brand"><b>创作空间</b><small>记录灵感，构建属于你的数字宇宙。</small></Link>
        <nav className="studio-nav" aria-label="创作空间导航">
          <div className="studio-nav-group">
            {primaryNav.map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><StudioIcon name={item.icon} size={19} /><span>{item.label}</span></Link>)}
          </div>
          <p>创作管理</p>
          <div className="studio-nav-group studio-nav-group--secondary">
            {secondaryNav.map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><StudioIcon name={item.icon} size={19} /><span>{item.label}</span></Link>)}
          </div>
        </nav>
        <div className="studio-sidebar-foot">
          <Link href="/admin/modules"><StudioIcon name="settings" size={19} /><span>首页模块</span></Link>
          <Link href="/admin/guestbook"><StudioIcon name="message" size={19} /><span>留言与反馈</span></Link>
          <div className="studio-session-actions">
            <Link href="/"><StudioIcon name="external" size={15} />返回前台</Link>
            <form action="/api/auth/logout" method="POST"><button type="submit"><StudioIcon name="logout" size={15} />退出</button></form>
          </div>
        </div>
      </aside>

      <nav className="studio-mobile-nav" aria-label="移动端创作导航">
        {mobileNav.slice(0, 6).map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><StudioIcon name={item.icon} size={17} /><span>{item.label}</span></Link>)}
      </nav>
    </>
  );
}
