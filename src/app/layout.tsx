import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";
import { TopBar } from "./components/top-bar";
import { SiteFooter } from "./components/site-footer";
import { SearchDialog } from "./components/search-dialog";
import { BackToTop } from "./components/back-to-top";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Miggra · 创作空间", template: "%s · Miggra" },
  description: "一个留给自己，也欢迎偶尔路过的创作空间。",
  openGraph: { title: "Miggra · 创作空间", description: "把灵感，放到会生长的地方。", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('miggra-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}}catch(_){}})();` }} />
      </head>
      <body className="bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider>
          <SearchDialog />
          <TopBar />
          {children}
          <SiteFooter />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
