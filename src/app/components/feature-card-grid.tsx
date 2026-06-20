import Link from "next/link";
import type { ReactNode } from "react";

export type FeatureCardItem = {
  title: string;
  detail: string;
  status?: string;
  meta?: string;
  leading?: ReactNode;
  href?: string;
};

type FeatureCardGridProps = {
  items: FeatureCardItem[];
  columns?: 2 | 3;
};

export function FeatureCardGrid({ items, columns = 3 }: FeatureCardGridProps) {
  return (
    <section className={columns === 2 ? "grid gap-4 md:grid-cols-2" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
      {items.map((item) => {
        const content = (
          <article className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
            {item.meta ? <div className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.meta}</div> : null}
            <div className="mt-3 flex items-start justify-between gap-4">
              <h2 className="text-xl font-medium">{item.title}</h2>
              {item.status ? <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">{item.status}</span> : null}
            </div>
            <p className="mt-4 leading-8 text-[var(--muted)]">{item.detail}</p>
          </article>
        );

        const key = (item as any).id ?? item.href ?? `${item.title}-${items.indexOf(item)}`;

        return item.href ? (
          <Link key={key} href={item.href} className="block cursor-pointer">
            {content}
          </Link>
        ) : (
          <div key={key}>{content}</div>
        );
      })}
    </section>
  );
}
