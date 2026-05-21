import { wishItems } from "@/lib/site-data";

export const revalidate = 60;
export const runtime = "nodejs";

export default function WishPage() {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Wish list</p>
          <h1 className="mt-3 text-3xl font-semibold">愿望清单</h1>
          <p className="mt-3 text-white/65">一些想完成、想体验、想拥有的事情。它们会慢慢被更新掉。</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {wishItems.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium">{item.title}</h2>
                {item.status ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{item.status}</span> : null}
              </div>
              <p className="mt-4 leading-8 text-white/70">{item.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
