export function HomePageSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <p className="text-sm text-white/40">正在加载碎碎念…</p>
        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <section
              key={key}
              className="h-48 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5"
            />
          ))}
        </section>
      </section>
    </main>
  );
}
