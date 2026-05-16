import { cookies } from "next/headers";

export const ADMIN_COOKIE = "miggra_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "123456";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === getAdminPassword();
}
