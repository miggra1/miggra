import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";
import { TopBar } from "./components/top-bar";
import { PublicNav } from "./components/public-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Miggra Journal",
    template: "%s | Miggra Journal",
  },
  description: "一个现代、艺术化的个人碎碎念网站，支持后端和部署上线。",
  keywords: ["个人网站", "碎碎念", "博客", "MySQL", "Next.js"],
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
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          <TopBar />
          <PublicNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
