import { PagesEditor } from "../../pages-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function NewPage() {
  return <PagesEditor mode="new" />;
}
