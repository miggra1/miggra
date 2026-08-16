"use client";

import Link from "next/link";
import { StudioIcon } from "./studio-icon";

export function AdminTopbar() {
  return (
    <header className="studio-topbar">
      <button
        type="button"
        className="studio-search-trigger"
        onClick={() => window.dispatchEvent(new CustomEvent("miggra:search"))}
        aria-label="搜索创作空间"
      >
        <StudioIcon name="search" size={21} />
        <span>搜索你的灵感、作品或工具...</span>
        <kbd>⌘ K</kbd>
      </button>

      <div className="studio-topbar-actions">
        <Link href="/admin/guestbook" className="studio-notification" aria-label="查看留言">
          <StudioIcon name="bell" size={21} />
          <i />
        </Link>
        <Link href="/" className="studio-avatar" aria-label="返回前台" title="返回前台" />
      </div>
    </header>
  );
}
