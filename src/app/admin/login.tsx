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
    <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/35">Admin Login</p>
        <h1 className="mt-3 text-3xl font-semibold">进入后台</h1>
        <p className="mt-3 text-white/65">请输入管理员密码后进入管理面板。</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="管理员密码"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35"
        />
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          登录
        </button>
        <p className="mt-4 text-xs text-white/40">
          默认密码来自环境变量 `ADMIN_PASSWORD`，未配置时默认为 `123456`。
        </p>
      </div>
    </main>
  );
}
