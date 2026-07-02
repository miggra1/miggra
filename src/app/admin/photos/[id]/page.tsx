import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PhotoEditor } from "../photo-editor";

export default async function EditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) notFound();

  return (
    <PhotoEditor
      mode="edit"
      photo={{
        id: photo.id,
        url: photo.url,
        caption: photo.caption ?? "",
        album: photo.album ?? "",
        takenAt: photo.takenAt ? photo.takenAt.toISOString().slice(0, 10) : "",
        location: photo.location ?? "",
        tags: photo.tags ?? "",
        featured: photo.featured,
        active: photo.active,
        order: photo.order,
      }}
    />
  );
}
