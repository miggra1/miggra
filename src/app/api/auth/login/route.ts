import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSession, isPasswordValid } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Attempt = {
  count: number;
  firstFailedAt: number;
  lockedUntil?: number;
};

const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCK_MS = 10 * 60 * 1000;

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  return `${ip}:${ua.slice(0, 120)}`;
}

function isLocked(key: string) {
  const attempt = attempts.get(key);
  if (!attempt?.lockedUntil) return false;
  if (attempt.lockedUntil <= Date.now()) {
    attempts.delete(key);
    return false;
  }
  return true;
}

function recordFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  const attempt: Attempt = current && now - current.firstFailedAt <= WINDOW_MS
    ? { ...current, count: current.count + 1 }
    : { count: 1, firstFailedAt: now };

  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.lockedUntil = now + LOCK_MS;
  }
  attempts.set(key, attempt);
}

export async function POST(request: Request) {
  const key = getClientKey(request);
  if (isLocked(key)) {
    return NextResponse.json({ error: "尝试次数过多，请稍后再试。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.password !== "string") {
    return NextResponse.json({ error: "请输入密码。" }, { status: 400 });
  }

  let ok = false;
  try {
    ok = isPasswordValid(body.password);
  } catch {
    return NextResponse.json({ error: "后台登录配置不完整。" }, { status: 500 });
  }

  if (!ok) {
    recordFailure(key);
    return NextResponse.json({ error: "密码错误。" }, { status: 401 });
  }

  attempts.delete(key);

  let session = "";
  try {
    session = createAdminSession();
  } catch {
    return NextResponse.json({ error: "后台登录配置不完整。" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
