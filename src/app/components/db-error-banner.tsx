export function DbErrorBanner() {
  return (
    <div
      role="alert"
      className="relative z-50 border-b border-amber-400/30 bg-amber-500/15 px-6 py-3 text-center text-sm text-amber-100"
    >
      数据库暂不可用，页面以离线模式展示。请检查 Vercel 环境变量{" "}
      <code className="rounded bg-black/30 px-1.5 py-0.5">DATABASE_URL</code> 或稍后重试。
    </div>
  );
}
