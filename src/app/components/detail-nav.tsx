import Link from "next/link";

export function DetailNav({
  prevHref,
  nextHref,
}: {
  prevHref?: string;
  nextHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--subtle)]">
      <Link href="/notes" className="transition hover:text-[var(--fg)]">
        返回列表
      </Link>
      <div className="flex gap-3">
        {prevHref ? (
          <Link href={prevHref} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">
            上一条
          </Link>
        ) : null}
        {nextHref ? (
          <Link href={nextHref} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 transition hover:bg-[var(--card-strong)]">
            下一条
          </Link>
        ) : null}
      </div>
    </div>
  );
}
