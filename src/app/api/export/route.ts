import { NextResponse } from "next/server";
import { listNotes } from "@/lib/notes";

export const runtime = "nodejs";

export async function GET() {
  const notes = await listNotes();
  const published = notes.filter((note) => note.status === "PUBLISHED");

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      notes: published,
    },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="miggra-export.json"',
      },
    },
  );
}
