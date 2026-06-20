import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] px-6 py-12 text-[var(--muted)] backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">缓慢生长</p>
          <p className="mt-3 max-w-xl leading-8 text-[var(--muted)]">
            这里会一直慢慢更新。不赶时间，不留遗憾。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/now" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]">此刻</Link>
          <Link href="/wish" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]">愿望</Link>
          <Link href="/reading" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]">书单</Link>
        </div>
      </div>
    </footer>
  );
}
