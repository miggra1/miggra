import Link from "next/link";

export function RelatedItems({ title, items }: { title: string; items: Array<{ href: string; title: string; note?: string }> }) {
  if (!items.length) return null;

  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 transition hover:bg-black/30">
            <div className="font-medium text-[var(--fg)]">{item.title}</div>
            {item.note ? <div className="mt-1 text-sm text-[var(--subtle)]">{item.note}</div> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
