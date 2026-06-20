import { prisma } from "@/lib/prisma";
import { HomepageModulesClient } from "../homepage-modules-client";

export default async function AdminModulesPage() {
  const homepageModules = await prisma.homepageModule.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#d4d4d8]">
      <div className="px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">Configuration</p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-wide">首页模块 ⚙</h1>
          <p className="mt-1 font-mono text-xs text-zinc-600">拖拽排序、启用/禁用首页展示的模块</p>
        </header>
        <HomepageModulesClient initialModules={homepageModules.map((item: any) => ({
          id: String(item.id),
          key: String(item.key),
          title: String(item.title),
          enabled: Boolean(item.enabled),
          order: Number(item.order),
        }))} />
      </div>
    </div>
  );
}
