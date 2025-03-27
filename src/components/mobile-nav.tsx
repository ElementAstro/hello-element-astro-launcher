"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Box, Download, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background border-t z-10">
      <Link href="/" className="flex-1">
        <MobileNavItem icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} />
      </Link>

      <Link href="/launcher" className="flex-1">
        <MobileNavItem icon={<Box className="h-5 w-5" />} label="Launcher" active={pathname === "/launcher"} />
      </Link>

      <Link href="/download" className="flex-1">
        <MobileNavItem icon={<Download className="h-5 w-5" />} label="Download" active={pathname === "/download"} />
      </Link>

      <Link href="/settings" className="flex-1">
        <MobileNavItem icon={<Settings className="h-5 w-5" />} label="Settings" active={pathname === "/settings"} />
      </Link>
    </div>
  )
}

function MobileNavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-2 text-xs text-muted-foreground",
        active && "text-primary",
      )}
    >
      <div className={cn("p-1 rounded-md", active && "bg-primary/10")}>{icon}</div>
      <span className="mt-1">{label}</span>
    </div>
  )
}

