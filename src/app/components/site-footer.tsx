import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium mb-3">Miggra</p>
            <p className="text-xs text-[var(--subtle)] leading-relaxed">安静但有光的地方</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)] mb-3">快速链接</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/notes" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">碎碎念</Link>
              <Link href="/photos" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">照片墙</Link>
              <Link href="/guestbook" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">留言板</Link>
              <Link href="/timeline" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">时间线</Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)] mb-3">订阅</p>
            <div className="flex flex-col gap-2">
              <a href="/rss" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">RSS 订阅</a>
              <a href="/rss.xml" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">复制到阅读器</a>
              <Link href="/admin" className="text-xs text-[var(--subtle)] hover:text-[var(--fg)] transition">站点管理</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--subtle)]">© {new Date().getFullYear()} Miggra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
