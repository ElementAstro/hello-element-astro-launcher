"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Download,
  Layers,
  Box,
  PenToolIcon as Tool,
  Settings,
  Power,
  Users,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MainNav() {
  const pathname = usePathname();
  const { setSystemModalOpen } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // 宽屏自动展开导航功能
  useEffect(() => {
    const handleResize = () => {
      // 宽屏幕自动展开导航栏
      if (typeof window !== "undefined" && window.innerWidth >= 1920) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    if (typeof window !== "undefined") {
      handleResize(); // 初始化时检查窗口宽度
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="hidden md:flex flex-col items-center border-r bg-muted/30 shadow-md" // 添加 shadow-md
      animate={{ width: isExpanded ? "15rem" : "4rem" }} // 增加展开宽度，折叠宽度也略微增加
      transition={{ duration: 0.35, ease: "easeInOut" }} // 调整动画
    >
      <div className="flex justify-center w-full p-2"> {/* 增加 p-2 */}
        <Button
          variant="ghost"
          size="icon" // 改为 icon 尺寸
          onClick={toggleExpand}
          className="p-1 h-7 w-7" // 调整尺寸和内边距
        >
          <motion.span
            initial={false}
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="text-lg" // 增大图标
          >
            «
          </motion.span>
        </Button>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className="mb-2 w-full"> {/* 增加 mb-2 */}
              <NavItem
                icon={<Home className="h-5 w-5" />} // 增大图标
                label="Home"
                active={pathname === "/"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}> {/* 调整 Tooltip 位置 */}
            Home
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/launcher" className="mb-1 w-full"> {/* 调整 mb-1 */}
              <NavItem
                icon={<Box className="h-5 w-5" />} // 增大图标
                label="Launcher"
                active={pathname === "/launcher"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Launcher
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/download" className="mb-1 w-full">
              <NavItem
                icon={<Download className="h-5 w-5" />} // 增大图标
                label="Download"
                active={pathname === "/download"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Download
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/environment" className="mb-1 w-full">
              <NavItem
                icon={<Layers className="h-5 w-5" />} // 增大图标
                label="Environment"
                active={pathname === "/environment"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Environment
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/proxy" className="mb-1 w-full">
              <NavItem
                icon={<Globe className="h-5 w-5" />} // 增大图标
                label="Proxy"
                active={pathname === "/proxy"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Proxy
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/tools" className="mb-1 w-full">
              <NavItem
                icon={<Tool className="h-5 w-5" />} // 增大图标
                label="Tools"
                active={pathname === "/tools"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Tools
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/agents" className="mb-1 w-full">
              <NavItem
                icon={<Users className="h-5 w-5" />} // 墛大图标
                label="Agents"
                active={pathname === "/agents"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
            Agents
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 占位空间，将底部项推到导航栏底部 */}
      <div className="flex-1"></div>

      <div className="mt-auto p-2"> {/* 增加 p-2 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings" className="w-full block mb-1"> {/* 墛加 mb-1 */}
                <NavItem
                  icon={<Settings className="h-5 w-5" />} // 墛大图标
                  label="Settings"
                  active={pathname === "/settings"}
                  showText={isExpanded}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 w-full mt-1 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-start", // 调整样式
                  isExpanded ? "px-2" : "justify-center w-9 px-0" // 展开时有内边距，折叠时居中固定宽度
                )}
                onClick={() => setSystemModalOpen(true)}
              >
                <Power className="h-5 w-5" /> {/* 墛大图标 */}
                {isExpanded && (
                  <span className="ml-2 text-sm"> {/* 调整间距和字体 */}
                    System
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : "ml-1"}>
              System
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className={cn("mt-2 flex", isExpanded ? "justify-start pl-1" : "justify-center")}> {/* 调整间距和对齐 */}
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}

// 导航项接口定义
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showText: boolean;
}

// 导航项组件
function NavItem({ icon, label, active, showText }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex items-center p-1.5 mx-1.5 my-1 rounded-lg transition-colors hover:bg-accent group relative", // 调整内边距、外边距和圆角
        active && "bg-accent text-accent-foreground shadow-sm" // 活动时增加阴影
      )}
    >
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "rounded-md transition-colors",
            active
              ? "text-accent-foreground"
              : "text-muted-foreground group-hover:text-accent-foreground"
          )}
        >
          {icon}
        </div>
      </div>
      <AnimatePresence>
        {showText && (
          <motion.span
            initial={{ opacity: 0, width: 0, x: -10 }} // 调整初始动画
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: -10 }} // 调整退出动画
            className="ml-2 text-sm font-medium overflow-hidden whitespace-nowrap" // 调整间距、字体大小和字重
            transition={{ duration: 0.25, ease: "circOut" }} // 调整动画
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && (
        <motion.div
          className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full" // 调整指示器样式和位置
          layoutId="navIndicator"
          transition={{
            type: "spring",
            stiffness: 400, // 增加硬度
            damping: 35,   // 墛加阻尼
          }}
        />
      )}
    </div>
  );
}
