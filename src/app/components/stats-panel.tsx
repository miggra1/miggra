import Link from "next/link";
import type { ReactNode } from "react";

type StatsPanelProps = {
  title: string;
  subtitle?: string;
  items: Array<{ label: string; value: string | number; hint?: string }>;
  footerHref?: string;
  footerLabel?: string;
};

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/35">{label}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      {hint ? <div className="mt-2 text-xs text-white/45">{hint}</div> : null}
    </div>
  );
}

export function StatsPanel({ title, subtitle, items, footerHref, footerLabel }: StatsPanelProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Stats</p>
          <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-white/55">{subtitle}</p> : null}
        </div>
        {footerHref && footerLabel ? (
          <Link href={footerHref} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
            {footerLabel}
          </Link>
        ) : null}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </div>
    </section>
  );
}
