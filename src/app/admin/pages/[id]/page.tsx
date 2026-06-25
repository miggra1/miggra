import { notFound } from "next/navigation";
import { getPageById } from "@/lib/pages";
import { PagesEditor } from "../../pages-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  return (
    <PagesEditor
      mode="edit"
      initial={{
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        status: page.status,
      }}
    />
  );
}
