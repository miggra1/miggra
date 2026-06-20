import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";
import { TopBar } from "./components/top-bar";
import { SiteFooter } from "./components/site-footer";
import { CursorGlow } from "./components/cursor-glow";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Miggra — 安静但有光的地方",
    template: "%s | Miggra",
  },
  description: "一个安静但有光的地方。记录碎碎念、灵感、书单和生活。",
  keywords: ["个人网站", "碎碎念", "博客", "Now", "书单", "愿望清单", "创作空间"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Miggra — 安静但有光的地方",
    description: "把日常、想法和情绪，放进一个很安静但很有光的地方。",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('miggra-theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.style.colorScheme = theme;
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider>
          <CursorGlow />
          <TopBar />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
