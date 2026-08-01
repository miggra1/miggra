export function HomePageSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm text-[var(--subtle)]">加载中…</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((k) => <div key={k} className="h-40 animate-pulse rounded-xl bg-[var(--card)]" />)}
        </div>
      </section>
    </main>
  );
}
