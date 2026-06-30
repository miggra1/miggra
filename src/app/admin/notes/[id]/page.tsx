import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NotesEditor } from "../../notes-editor";

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) notFound();

  return (
    <div className="px-8 py-10">
      <NotesEditor mode="edit" initial={{ id: note.id, title: note.title, text: note.text, tag: note.tag, status: note.status, pinned: note.pinned, coverImage: note.coverImage, scheduledAt: note.scheduledAt?.toISOString() ?? null }} />
    </div>
  );
}
