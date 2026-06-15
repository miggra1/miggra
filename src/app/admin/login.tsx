"use client";

import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "登录失败");
      return;
    }

    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 text-[var(--fg)]">
      <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Admin Login</p>
        <h1 className="mt-3 text-3xl font-semibold">进入后台</h1>
        <p className="mt-3 text-[var(--muted)]">请输入管理员密码后进入管理面板。</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="管理员密码"
          className="mt-6 w-full rounded-2xl border border-[var(--border)] bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-[var(--subtle)]"
        />
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
        >
          登录
        </button>
        <p className="mt-4 text-xs text-[var(--subtle)]">
          默认密码来自环境变量 `ADMIN_PASSWORD`，未配置时默认为 `123456`。
        </p>
      </div>
    </main>
  );
}
