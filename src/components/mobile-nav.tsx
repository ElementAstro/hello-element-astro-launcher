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
      className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background border-t z-10"
      initial={{ y: 0 }}
      animate={{ y: isNavHidden ? 80 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/" className="flex-1">
        <MobileNavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          active={pathname === "/"}
        />
      </Link>

      <Link href="/launcher" className="flex-1">
        <MobileNavItem
          icon={<Box className="h-5 w-5" />}
          label="Launcher"
          active={pathname === "/launcher"}
        />
      </Link>

      <Link href="/download" className="flex-1">
        <MobileNavItem
          icon={<Download className="h-5 w-5" />}
          label="Download"
          active={pathname === "/download"}
        />
      </Link>

      <Link href="/settings" className="flex-1">
        <MobileNavItem
          icon={<Settings className="h-5 w-5" />}
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
        "flex flex-col items-center justify-center py-3 text-xs text-muted-foreground touch-action-manipulation",
        active && "text-primary"
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-md transition-all duration-200",
          active && "bg-primary/10"
        )}
      >
        {icon}
      </div>
      <span className="mt-1 font-medium">{label}</span>
    </div>
  );
}
