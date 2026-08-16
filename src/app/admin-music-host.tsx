"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NeteaseMusicPlayer } from "./admin/netease-music-player";

export function AdminMusicHost() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAdminRoute || isAuthenticated) return;
    const controller = new AbortController();
    fetch("/api/auth/check", { cache: "no-store", signal: controller.signal })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => {
        if (data.authenticated) setIsAuthenticated(true);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [isAdminRoute, isAuthenticated]);

  if (!isAdminRoute || !isAuthenticated) return null;
  return <NeteaseMusicPlayer />;
}
