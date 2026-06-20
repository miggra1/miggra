import { prisma } from "@/lib/prisma";
import { TimelineMilestonesClient } from "../timeline-milestones-client";

export default async function AdminTimelinePage() {
  const timelineItems = await prisma.timelineMilestone.findMany({
    orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-[#2a2520] text-[#e0d8ce]">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
      <div className="relative px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500/60">Archive</p>
          <h1 className="mt-2 font-serif text-3xl font-light italic">时间档案馆 ◷</h1>
          <p className="mt-1 font-mono text-xs text-stone-500">记录人生和站点的每个节点</p>
        </header>
        <TimelineMilestonesClient initialItems={timelineItems.map((item: any) => ({
          id: String(item.id),
          year: String(item.year),
          kind: item.kind,
          title: String(item.title),
          detail: String(item.detail),
          order: Number(item.order),
          active: Boolean(item.active),
        }))} />
      </div>
    </div>
  );
}
