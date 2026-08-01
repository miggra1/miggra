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
  const explicitSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicitSecret) {
    if (!isProduction() || explicitSecret.length >= 32) {
      return explicitSecret;
    }

    // Keep older deployments usable when a short session secret was saved.
    // Combining it with the required admin password avoids using that short
    // value as the HMAC key directly.
    return crypto
      .createHash("sha256")
      .update("miggra-admin-session:legacy-secret:v1\0")
      .update(explicitSecret)
      .update("\0")
      .update(getAdminPassword())
      .digest("hex");
  }

  const deploymentSecretSource = process.env.DATABASE_URL?.trim() || process.env.CRON_SECRET?.trim();
  if (deploymentSecretSource) {
    return crypto
      .createHash("sha256")
      .update("miggra-admin-session:v1\0")
      .update(deploymentSecretSource)
      .digest("hex");
  }

  const passwordFallback = getAdminPassword();
  return crypto
    .createHash("sha256")
    .update(isProduction() ? "miggra-admin-session:password-fallback:v1\0" : "dev-session-secret:v1\0")
    .update(passwordFallback)
    .digest("hex");
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
