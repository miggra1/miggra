import type { ReactNode } from "react";

type FeaturePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function FeaturePageShell({ eyebrow, title, description, children, footer }: FeaturePageShellProps) {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-white/65">{description}</p>
        </header>

        {children}
        {footer ? <div>{footer}</div> : null}
      </div>
    </main>
  );
}
