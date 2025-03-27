"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Download, Layers, Box, Cpu, PenToolIcon as Tool, Settings, Power } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

export function MainNav() {
  const pathname = usePathname()
  const { setSystemModalOpen } = useAppStore()

  return (
    <div className="hidden md:flex flex-col items-center w-16 py-4 border-r bg-muted/30">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className="mb-6">
              <NavItem icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/launcher">
              <NavItem icon={<Box className="h-5 w-5" />} label="Launcher" active={pathname === "/launcher"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Launcher</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/download">
              <NavItem icon={<Download className="h-5 w-5" />} label="Download" active={pathname === "/download"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Download</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/environment">
              <NavItem icon={<Layers className="h-5 w-5" />} label="Environment" active={pathname === "/environment"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Environment</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/blocks">
              <NavItem icon={<Cpu className="h-5 w-5" />} label="Blocks" active={pathname === "/blocks"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Blocks</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/proxy">
              <NavItem icon={<Box className="h-5 w-5" />} label="Proxy" active={pathname === "/proxy"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Proxy</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/tools">
              <NavItem icon={<Tool className="h-5 w-5" />} label="Tools" active={pathname === "/tools"} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Tools</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings">
                <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" active={pathname === "/settings"} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center justify-center w-full p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                <div className="p-2 rounded-md">
                  <ThemeToggle />
                </div>
                <span className="mt-1">Theme</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-full p-0" onClick={() => setSystemModalOpen(true)}>
                <NavItem icon={<Power className="h-5 w-5" />} label="System" active={false} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">System Control</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
        active && "text-primary",
      )}
    >
      <div className={cn("p-2 rounded-md", active && "bg-primary/10")}>{icon}</div>
      <span className="mt-1">{label}</span>
    </div>
  )
}

