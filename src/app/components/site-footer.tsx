import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-6 py-10 text-[var(--muted)] backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Closing note</p>
          <p className="mt-3 max-w-xl leading-8 text-[var(--muted)]">
            这里会继续记录想法、生活和作品。把它当作一个慢慢生长的数字空间。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/now" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">Now</Link>
          <Link href="/wish" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">愿望</Link>
          <Link href="/reading" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">书单</Link>
        </div>
      </div>
    </footer>
  );
}
