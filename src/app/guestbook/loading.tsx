export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--bg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <div className="h-4 w-20 rounded bg-[var(--card)] animate-pulse" />
          <div className="mt-3 h-9 w-48 rounded bg-[var(--card)] animate-pulse" />
          <div className="mt-3 h-4 w-40 rounded bg-[var(--card)] animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="h-4 w-16 rounded-full bg-[var(--bg-hover)] animate-pulse" />
              <div className="mt-3 h-5 w-3/4 rounded bg-[var(--bg-hover)] animate-pulse" />
              <div className="mt-2 h-4 w-full rounded bg-[var(--bg-hover)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
