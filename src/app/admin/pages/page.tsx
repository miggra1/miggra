import { listPagesSafe } from "@/lib/pages";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const { pages } = await listPagesSafe();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">Pages</p>
          <h1 className="mt-2 text-2xl font-semibold">自定义页面</h1>
        </div>
        <Link href="/admin/pages/new" className="btn btn-primary text-sm">新建页面</Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <p className="text-[var(--muted)]">还没有自定义页面，点击"新建页面"开始创建。</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-4">
              <div className="flex items-center gap-4">
                <span
                  className={`h-2 w-2 rounded-full ${page.status === "PUBLISHED" ? "bg-[var(--green)]" : "bg-[var(--amber)]"}`}
                />
                <div>
                  <Link href={`/admin/pages/${page.id}`} className="font-medium hover:text-[var(--accent)] transition">
                    {page.title}
                  </Link>
                  <code className="ml-3 text-xs text-[var(--subtle)] font-mono">/pages/{page.slug}</code>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
                  {page.status === "PUBLISHED" ? "已发布" : "草稿"}
                </span>
                <time className="hidden sm:inline">{new Date(page.updatedAt).toLocaleDateString("zh-CN")}</time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
