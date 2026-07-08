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
    <section className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_20px_80px_var(--shadow)] backdrop-blur-xl sm:rounded-[1.75rem] md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--subtle)] sm:text-sm sm:tracking-[0.3em]">Life modules</p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">内容与生活模块</h2>
        </div>
        <p className="text-xs leading-6 text-[var(--subtle)] sm:text-sm">这些页面会和日常一起慢慢长出来。</p>
      </div>
      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-[1.2rem] border border-[var(--border)] bg-[var(--card)] p-4 card-interactive sm:rounded-[1.5rem] md:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--subtle)] sm:text-xs sm:tracking-[0.25em]">{item.label}</div>
                <h3 className="mt-2 text-lg font-medium sm:mt-3 sm:text-xl">{item.title}</h3>
              </div>
              {item.count ? <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--subtle)] sm:px-3">{item.count}</span> : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:mt-3 sm:leading-7">{item.description}</p>
            <div className="mt-4 text-sm text-[var(--subtle)] transition group-hover:text-[var(--fg)] sm:mt-5">查看页面 →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
