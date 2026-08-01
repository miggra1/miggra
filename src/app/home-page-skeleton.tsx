export function HomePageSkeleton() {
  return (
    <main className="workspace">
      <div className="workspace-inner">
        <div className="workspace-kicker"><span>Personal studio / Miggra</span><span>正在整理今天的空间</span></div>
        <section className="workspace-heading">
          <div className="h-40 max-w-3xl animate-pulse rounded-2xl bg-[var(--card)]" />
          <div className="h-20 animate-pulse rounded-xl bg-[var(--card)]" />
        </section>
        <section className="workspace-grid">
          <div className="workspace-main">
            <div className="h-52 animate-pulse rounded-[18px] bg-[var(--card)]" />
            <div className="h-72 animate-pulse rounded-[18px] bg-[var(--card)]" />
            <div className="h-60 animate-pulse rounded-[18px] bg-[var(--card)]" />
          </div>
          <div className="workspace-side">
            <div className="h-44 animate-pulse rounded-[18px] bg-[var(--card)]" />
            <div className="h-56 animate-pulse rounded-[18px] bg-[var(--card)]" />
            <div className="h-56 animate-pulse rounded-[18px] bg-[var(--card)]" />
          </div>
        </section>
      </div>
    </main>
  );
}
