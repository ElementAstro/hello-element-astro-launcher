import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMATION_DURATION } from "./animation-constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Category, ChangeHandler } from "./types";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  currentTab: Category;
  onTabChange: ChangeHandler<Category>;
  isLoading?: boolean;
}

export function CategoryTabs({
  currentTab,
  onTabChange,
  isLoading = false,
}: CategoryTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const categories = useMemo<Array<{ value: Category; label: string }>>(
    () => [
      { value: "all", label: "全部" },
      { value: "deepspace", label: "深空" },
      { value: "planets", label: "行星" },
      { value: "guiding", label: "引导" },
      { value: "analysis", label: "分析" },
      { value: "drivers", label: "驱动" },
      { value: "vendor", label: "厂商" },
      { value: "utilities", label: "工具" },
    ],
    []
  );

  const handleTabChange = useCallback(
    (value: string) => {
      if (isLoading) return;
      onTabChange(value as Category);
    },
    [isLoading, onTabChange]
  );

  // 当标签更改时滚动到视图 - 使用更高效的方案
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      // 使用requestAnimationFrame确保DOM已更新
      requestAnimationFrame(() => {
        if (!activeTabRef.current || !tabsRef.current) return;

        const tabElement = activeTabRef.current;

        // 使用scrollIntoView方法使活动标签居中显示
        tabElement.scrollIntoView({
          inline: "center",
          behavior: "smooth",
        });
      });
    }
  }, [currentTab]);

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex-1 overflow-hidden"
    >
      <div className="border-b relative">
        <ScrollArea className="w-full" type="scroll">
          <div
            ref={tabsRef}
            className="px-2 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: "none" }} // Firefox
          >
            <TabsList className="h-12 w-full justify-start bg-transparent">
              {categories.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={cn(
                    "relative h-9 px-2.5 py-1.5 text-xs sm:text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
                    isLoading && "opacity-70 cursor-not-allowed",
                    currentTab === value
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  disabled={isLoading}
                  ref={currentTab === value ? activeTabRef : undefined}
                >
                  <span className="relative z-10">{label}</span>
                  {currentTab === value && (
                    <motion.span
                      className="absolute inset-0 rounded-md bg-primary/10"
                      layoutId="activeTabBackground"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: ANIMATION_DURATION.normal,
                      }}
                    />
                  )}
                  {currentTab === value && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTabIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: ANIMATION_DURATION.normal,
                      }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>

        {/* 加载指示器 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/40"
          >
            <motion.div
              className="h-full bg-primary"
              animate={{
                x: ["0%", "100%"],
                width: ["10%", "30%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </div>
    </Tabs>
  );
}
