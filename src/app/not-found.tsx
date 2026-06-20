import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 text-[var(--fg)]">
      <div className="max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center backdrop-blur-xl animate-fade-up">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">迷路了</p>
        <h1 className="mt-3 text-3xl font-semibold">这一页还不存在</h1>
        <p className="mt-4 leading-8 text-[var(--muted)]">可能还没写，可能已经被挪走了。就像生活里很多事一样。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90">
            回到首页
          </Link>
          <Link href="/notes" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm transition hover:bg-[var(--card-strong)]">
            翻翻碎碎念
          </Link>
        </div>
      </div>
    </main>
  );
}
