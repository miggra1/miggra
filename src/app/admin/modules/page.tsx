import { prisma } from "@/lib/prisma";
import { HomepageModulesClient } from "../homepage-modules-client";

export default async function AdminModulesPage() {
  const modules = await prisma.homepageModule.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }).catch(() => []);

  return (
    <div className="px-8 py-10 max-w-4xl animate-in">
      <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Modules</p>
      <h1 className="text-[28px] font-medium mt-1 mb-8">首页模块</h1>
      <HomepageModulesClient initialModules={modules.map((m: any) => ({ id: String(m.id), key: String(m.key), title: String(m.title), enabled: Boolean(m.enabled), order: Number(m.order) }))} />
    </div>
  );
}
