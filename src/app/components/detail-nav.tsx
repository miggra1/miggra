import Link from "next/link";

export function DetailNav({ prevHref, nextHref }: { prevHref?: string; nextHref?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px] text-[var(--subtle)]">
      {prevHref ? <Link href={prevHref} className="hover:text-[var(--fg)] transition">← 上一条</Link> : <span />}
      {nextHref ? <Link href={nextHref} className="hover:text-[var(--fg)] transition">下一条 →</Link> : <span />}
    </div>
  );
}
