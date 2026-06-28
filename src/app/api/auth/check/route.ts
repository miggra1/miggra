import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const token = store.get("miggra_admin")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";
  const authenticated = token === adminPassword;
  return NextResponse.json({ authenticated });
}
