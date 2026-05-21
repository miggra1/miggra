import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-6 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/35">404</p>
        <h1 className="mt-3 text-3xl font-semibold">页面没有找到</h1>
        <p className="mt-4 leading-8 text-white/65">你访问的内容可能已经被移动、删除，或者根本还没有创建。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90">
            回到首页
          </Link>
          <Link href="/notes" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:bg-white/10">
            去碎碎念
          </Link>
        </div>
      </div>
    </main>
  );
}
