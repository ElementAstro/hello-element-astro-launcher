"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  size?: "default" | "sm" | "lg";
  isExpanded?: boolean;
}

export function ThemeToggle({
  size = "default",
  isExpanded = false,
}: ThemeToggleProps) {
  const { setTheme } = useTheme();

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-[1.2rem] w-[1.2rem]";
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const buttonClass = isExpanded
    ? "flex items-center justify-between gap-2 px-2"
    : "p-0";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn(buttonSize, buttonClass)}>
          <Sun
            className={cn(
              iconSize,
              "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            )}
          />
          <Moon
            className={cn(
              "absolute",
              iconSize,
              "rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            )}
          />
          {isExpanded && <span className="text-xs">主题</span>}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
