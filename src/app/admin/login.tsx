"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) { setError("请输入密码"); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "密码错误");
        return;
      }
      window.location.replace("/admin");
    } catch {
      setError("无法连接登录服务，请刷新页面后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="studio-login">
      <section className="studio-login-frame">
        <div className="studio-login-visual"><img src="/uploads/starry-night.jpg" alt="夜色中的山与星空" /><div><p>Private creative space</p><h1>让每一次落笔，<br />都有自己的光。</h1></div></div>
        <div className="studio-login-form">
          <Link href="/" className="studio-login-brand"><span className="studio-brand-mark"><i /><i /></span><b>MIGGRA</b></Link>
          <div className="studio-login-copy"><p>Welcome back</p><h2>进入创作空间</h2><span>这是你的私人工作室。输入密码，继续未完成的作品。</span></div>
          <label htmlFor="admin-password">访问密码</label>
          <input id="admin-password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleLogin(); }} type="password" placeholder="输入管理员密码" autoFocus />
          {error ? <p className="studio-login-error">{error}</p> : null}
          <button type="button" onClick={handleLogin} disabled={loading}>{loading ? "验证中…" : "进入空间"}<span>↗</span></button>
          {process.env.NODE_ENV !== "production" ? <a href="/api/auth/login" className="studio-login-dev">本地开发直接进入 <span>→</span></a> : null}
          <p className="studio-login-hint">本地开发请使用 <code>.env.local</code> 中的 <code>ADMIN_PASSWORD</code>。</p>
          <Link href="/" className="studio-login-back">← 返回前台</Link>
        </div>
      </section>
    </main>
  );
}
