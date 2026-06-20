export function DbErrorBanner() {
  return (
    <div
      role="alert"
      className="relative z-50 border-b border-[var(--accent-glow)] bg-[var(--accent-glow)]/20 px-6 py-3 text-center text-sm text-[var(--accent)]"
    >
      数据库暂时离线，页面以本地模式展示。稍后会自动恢复。
    </div>
  );
}
