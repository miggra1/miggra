"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WriteButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // 先检查是否已登录
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      if (data.authenticated) {
        router.push("/admin/notes/new");
        return;
      }
    } catch { /* 网络错误，直接弹出密码框 */ }
    setShowModal(true);
  };

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "密码错误");
        return;
      }
      router.push("/admin/notes/new");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:scale-[1.02] hover:opacity-90"
      >
        写点东西
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* modal */}
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-[var(--subtle)] mb-1">进入创作空间</p>
            <h2 className="text-xl font-semibold mb-4">输入密码</h2>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              type="password"
              placeholder="管理员密码"
              autoFocus
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none placeholder:text-[var(--subtle)] focus:border-[var(--accent)] transition"
            />

            {error && (
              <p className="mt-3 text-xs text-red-400">{error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setPassword(""); setError(""); }}
                className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition"
              >
                取消
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "验证中…" : "进入"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
