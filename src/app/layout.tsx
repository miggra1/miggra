import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";
import { TopBar } from "./components/top-bar";
import { SiteFooter } from "./components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Miggra", template: "%s — Miggra" },
  description: "安静但有光的地方。",
  openGraph: { title: "Miggra", description: "把日常、想法和情绪，放进一个很安静但很有光的地方。", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('miggra-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}}catch(_){}})();` }} />
      </head>
      <body className="bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider>
          <TopBar />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
