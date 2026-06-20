import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ContentEditor } from "../../content-editor";

export default async function EditReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, section: "READING" } });
  if (!item) notFound();
  return <div className="px-8 py-10"><ContentEditor mode="edit" section="READING" sectionLabel="书单" initial={{ id: item.id, title: item.title, detail: item.detail, meta: item.meta ?? "", status: item.status ?? "", order: item.order, active: item.active }} /></div>;
}
