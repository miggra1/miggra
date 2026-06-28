"use client";

import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "密码错误");
      return;
    }

    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,120,196,0.10),transparent_28%)] opacity-60" />

      <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl backdrop-blur-xl animate-in">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--subtle)] mb-2">后台入口</p>
        <h1 className="text-xl font-semibold mb-1">需要密码</h1>
        <p className="text-sm text-[var(--muted)] mb-6">请输入管理员密码以进入后台。</p>

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
          type="password"
          placeholder="管理员密码"
          autoFocus
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none placeholder:text-[var(--subtle)] focus:border-[var(--accent)] transition"
        />

        {error && (
          <p className="mt-3 text-xs text-red-400">{error}</p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          className="mt-5 w-full rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
        >
          进入后台
        </button>

        <div className="mt-4 flex items-center justify-between text-xs text-[var(--subtle)]">
          <a href="/" className="hover:text-[var(--fg)] transition">← 回前台</a>
          <span>Miggra</span>
        </div>
      </div>
    </div>
  );
}
