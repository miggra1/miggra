import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "miggra_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

const DEFAULT_DEV_PASSWORD = "123456";

type AdminSessionPayload = {
  sub: "admin";
  iat: number;
  exp: number;
  v: 1;
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (isProduction()) {
    if (!password) throw new Error("ADMIN_PASSWORD is required in production.");
  }
  return password ?? DEFAULT_DEV_PASSWORD;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (isProduction()) {
    if (!secret) throw new Error("ADMIN_SESSION_SECRET is required in production.");
    if (secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters in production.");
  }
  return secret ?? `dev-session-secret:${getAdminPassword()}`;
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function isPasswordValid(input: string) {
  const password = getAdminPassword();
  return safeEqual(input, password);
}

export function createAdminSession() {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: "admin",
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE,
    v: 1,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSession(value: string | undefined) {
  if (!value) return false;
  const [encodedPayload, signature, extra] = value.split(".");
  if (!encodedPayload || !signature || extra) return false;

  const expected = signPayload(encodedPayload);
  if (!safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as Partial<AdminSessionPayload>;
    const now = Math.floor(Date.now() / 1000);
    return payload.sub === "admin" && payload.v === 1 && typeof payload.iat === "number" && typeof payload.exp === "number" && payload.iat <= now && payload.exp > now;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}
