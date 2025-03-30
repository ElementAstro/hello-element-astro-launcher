"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SystemControlModal } from "@/components/system-control-modal";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  // 检测窗口大小以实现更好的布局调整
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 初始化窗口大小
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // 针对不同屏幕大小优化内容区域宽度
  const contentMaxWidth =
    windowWidth >= 1920
      ? "max-w-[1600px]"
      : windowWidth >= 1440
      ? "max-w-[1200px]"
      : "";

  return (
    <div className="flex h-screen">
      <MainNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={cn("flex-1 mx-auto w-full overflow-auto", contentMaxWidth)}
        >
          {children}
        </div>
      </div>
      <MobileNav />
      <SystemControlModal />
    </div>
  );
}
