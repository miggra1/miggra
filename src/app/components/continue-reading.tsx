import Link from "next/link";

export type ContinueItem = {
  href: string;
  title: string;
  note?: string;
};

export function ContinueReading({
  prev,
  next,
  related = [],
  listHref,
  listLabel,
}: {
  prev?: ContinueItem | null;
  next?: ContinueItem | null;
  related?: ContinueItem[];
  listHref: string;
  listLabel: string;
}) {
  return (
    <section className="mt-8 space-y-4">
      {(prev || next) && (
        <nav className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link href={prev.href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition hover:bg-[var(--card-strong)] group">
              <p className="text-xs text-[var(--subtle)]">上一篇</p>
              <p className="mt-1 text-sm font-medium line-clamp-1 group-hover:text-[var(--accent)] transition">{prev.title}</p>
              {prev.note ? <p className="mt-1 text-xs text-[var(--subtle)] line-clamp-1">{prev.note}</p> : null}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={next.href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-right transition hover:bg-[var(--card-strong)] group">
              <p className="text-xs text-[var(--subtle)]">下一篇</p>
              <p className="mt-1 text-sm font-medium line-clamp-1 group-hover:text-[var(--accent)] transition">{next.title}</p>
              {next.note ? <p className="mt-1 text-xs text-[var(--subtle)] line-clamp-1">{next.note}</p> : null}
            </Link>
          ) : <div />}
        </nav>
      )}

      {related.length > 0 && (
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">继续逛逛</p>
            <Link href={listHref} className="text-sm text-[var(--subtle)] transition hover:text-[var(--fg)]">{listLabel}</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-[var(--border)] bg-black/10 p-4 transition hover:bg-black/20">
                <p className="font-medium text-[var(--fg)]">{item.title}</p>
                {item.note ? <p className="mt-1 text-sm text-[var(--subtle)] line-clamp-1">{item.note}</p> : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
