import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TimelineEditor } from "../../timeline-editor";

export default async function EditTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.timelineMilestone.findUnique({ where: { id } });
  if (!item) notFound();
  return <div className="px-8 py-10"><TimelineEditor mode="edit" initial={{ id: item.id, year: item.year, kind: item.kind, title: item.title, detail: item.detail, order: item.order, active: item.active }} /></div>;
}
