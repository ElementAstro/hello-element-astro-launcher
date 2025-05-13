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
      className="hidden md:flex flex-col items-center border-r bg-muted/30"
      animate={{ width: isExpanded ? "14rem" : "4rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex justify-center w-full p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="p-1 h-6 w-6"
        >
          <motion.span
            initial={false}
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            «
          </motion.span>
        </Button>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className="mb-6 w-full">
              <NavItem
                icon={<Home className="h-5 w-5" />}
                label="Home"
                active={pathname === "/"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Home
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/launcher" className="w-full">
              <NavItem
                icon={<Box className="h-5 w-5" />}
                label="Launcher"
                active={pathname === "/launcher"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Launcher
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/download" className="w-full">
              <NavItem
                icon={<Download className="h-5 w-5" />}
                label="Download"
                active={pathname === "/download"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Download
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/environment" className="w-full">
              <NavItem
                icon={<Layers className="h-5 w-5" />}
                label="Environment"
                active={pathname === "/environment"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Environment
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/proxy" className="w-full">
              <NavItem
                icon={<Globe className="h-5 w-5" />}
                label="Proxy"
                active={pathname === "/proxy"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Proxy
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/tools" className="w-full">
              <NavItem
                icon={<Tool className="h-5 w-5" />}
                label="Tools"
                active={pathname === "/tools"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Tools
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/agents" className="w-full">
              <NavItem
                icon={<Users className="h-5 w-5" />}
                label="Agents"
                active={pathname === "/agents"}
                showText={isExpanded}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
            Agents
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mt-auto w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings" className="w-full">
                <NavItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                  active={pathname === "/settings"}
                  showText={isExpanded}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center justify-center w-full p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
                  isExpanded && "justify-start px-4"
                )}
              >
                <div className="p-2 rounded-md">
                  <ThemeToggle />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 overflow-hidden"
                    >
                      Theme
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              Theme
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-0"
                onClick={() => setSystemModalOpen(true)}
              >
                <NavItem
                  icon={<Power className="h-5 w-5" />}
                  label="System"
                  active={false}
                  showText={isExpanded}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              System Control
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  active,
  showText = false,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showText?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center w-full p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
        active && "text-primary",
        showText ? "justify-start px-4" : "justify-center"
      )}
    >
      <motion.div
        className={cn("p-2 rounded-md", active && "bg-primary/10")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
      </motion.div>
      {showText && (
        <motion.span
          className="ml-3 text-sm font-medium overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
