import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";
import { TopBar } from "./components/top-bar";
import { SiteFooter } from "./components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Miggra Journal",
    template: "%s | Miggra Journal",
  },
  description: "一个现代、艺术化的个人碎碎念网站，支持后端和部署上线。",
  keywords: ["个人网站", "碎碎念", "博客", "MySQL", "Next.js", "Now", "书单", "愿望清单"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Miggra Journal",
    description: "一个现代、艺术化的个人碎碎念网站。",
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
          <TopBar />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
