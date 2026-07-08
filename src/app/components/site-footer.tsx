import Link from "next/link";
import { RssSubscribeActions } from "./rss-subscribe-actions";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="mb-3 text-sm font-medium">Miggra</p>
            <p className="text-xs leading-relaxed text-[var(--subtle)]">安静但有光的地方</p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">快速链接</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/notes" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">碎碎念</Link>
              <Link href="/photos" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">照片墙</Link>
              <Link href="/now" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">Now</Link>
              <Link href="/wish" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">愿望</Link>
              <Link href="/reading" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">书单</Link>
              <Link href="/inspirations" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">灵感</Link>
              <Link href="/life" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">生活切片</Link>
              <Link href="/about" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">关于</Link>
              <Link href="/guestbook" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">留言板</Link>
              <Link href="/timeline" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">时间线</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">订阅</p>
            <RssSubscribeActions />
            <Link href="/admin" className="mt-3 inline-block text-xs text-[var(--subtle)] transition hover:text-[var(--fg)]">站点管理</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center">
          <p className="text-xs text-[var(--subtle)]">© {new Date().getFullYear()} Miggra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
