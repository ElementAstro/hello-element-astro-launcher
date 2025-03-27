"use client";

import type React from "react";

import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SystemControlModal } from "@/components/system-control-modal";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <MainNav />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      <MobileNav />
      <SystemControlModal />
    </div>
  );
}
