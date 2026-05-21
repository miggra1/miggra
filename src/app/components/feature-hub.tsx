import Link from "next/link";

export type HubItem = {
  href: string;
  label: string;
  title: string;
  description: string;
  count?: string;
};

type FeatureHubProps = {
  items: HubItem[];
};

export function FeatureHub({ items }: FeatureHubProps) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Life modules</p>
          <h2 className="mt-2 text-2xl font-semibold">内容与生活模块</h2>
        </div>
        <p className="text-sm text-[var(--subtle)]">这些页面会和日常一起慢慢长出来。</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:bg-[var(--card-strong)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">{item.label}</div>
                <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
              </div>
              {item.count ? <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--subtle)]">{item.count}</span> : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
