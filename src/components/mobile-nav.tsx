"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, Download, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavHidden, setIsNavHidden] = useState(false);

  // 滚动隐藏导航栏逻辑，提高内容可视区域
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsNavHidden(true);
      } else {
        setIsNavHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background/80 backdrop-blur-sm border-t z-10 shadow-t-lg" // 增加背景模糊和阴影
      initial={{ y: 0 }}
      animate={{ y: isNavHidden ? 80 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }} // 调整动画
    >
      <Link href="/" className="flex-1">
        <MobileNavItem
          icon={<Home className="h-6 w-6" />} // 增大图标
          label="Home"
          active={pathname === "/"}
        />
      </Link>

      <Link href="/launcher" className="flex-1">
        <MobileNavItem
          icon={<Box className="h-6 w-6" />} // 增大图标
          label="Launcher"
          active={pathname === "/launcher"}
        />
      </Link>

      <Link href="/download" className="flex-1">
        <MobileNavItem
          icon={<Download className="h-6 w-6" />} // 增大图标
          label="Download"
          active={pathname === "/download"}
        />
      </Link>

      <Link href="/settings" className="flex-1">
        <MobileNavItem
          icon={<Settings className="h-6 w-6" />} // 墛大图标
          label="Settings"
          active={pathname === "/settings"}
        />
      </Link>
    </motion.div>
  );
}

function MobileNavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-2 text-xs text-muted-foreground touch-action-manipulation transition-all duration-200 ease-out", // 调整内边距和过渡
        active ? "text-primary scale-105" : "hover:text-foreground hover:scale-105" // 活动和悬停效果
      )}
    >
      <motion.div
        className={cn(
          "p-2 rounded-xl transition-all duration-200 ease-out", // 调整内边距、圆角和过渡
          active ? "bg-primary/15 shadow-md" : "group-hover:bg-accent/80"
        )}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <span className={cn("mt-1 font-semibold", active && "text-primary")}>{label}</span> {/* 调整字体和活动颜色 */}
    </div>
  );
}
