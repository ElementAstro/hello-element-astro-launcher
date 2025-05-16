"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SystemControlModal } from "@/components/system-control-modal";

export function AppLayout({ children }: { children: React.ReactNode }) {
  // 监听窗口尺寸变化，用于控制移动导航的显示
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始化窗口尺寸
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 在非移动设备上显示主导航 */}
      {!isMobile && <MainNav />}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 w-full h-full overflow-hidden">{children}</div>
      </div>
      {/* 只在移动设备上显示移动导航 */}
      {isMobile && <MobileNav />}
      <SystemControlModal />
    </div>
  );
}
