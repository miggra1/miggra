import Link from "next/link";

export function DetailNav({
  prevHref,
  nextHref,
}: {
  prevHref?: string;
  nextHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/45">
      <Link href="/notes" className="transition hover:text-white">
        返回列表
      </Link>
      <div className="flex gap-3">
        {prevHref ? (
          <Link href={prevHref} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
            上一条
          </Link>
        ) : null}
        {nextHref ? (
          <Link href={nextHref} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
            下一条
          </Link>
        ) : null}
      </div>
    </div>
  );
}
