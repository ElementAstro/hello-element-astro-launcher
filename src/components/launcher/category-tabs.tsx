import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMATION_DURATION } from "./animation-constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Category, ChangeHandler } from "./types";
import { useRef, useEffect, useMemo } from "react";
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
  // 删除未使用的状态变量 - 我们可以直接根据 currentTab 计算活动索引
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const categories = useMemo(
    () =>
      [
        { value: "all", label: "全部" },
        { value: "deepspace", label: "深空" },
        { value: "planets", label: "行星" },
        { value: "guiding", label: "引导" },
        { value: "analysis", label: "分析" },
        { value: "drivers", label: "驱动" },
        { value: "vendor", label: "厂商" },
        { value: "utilities", label: "工具" },
      ] as Array<{ value: Category; label: string }>,
    []
  );

  const handleTabChange = (value: string) => {
    if (isLoading) return;
    onTabChange(value as Category);
  };

  // 当标签更改时滚动到视图
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tabElement = activeTabRef.current;
      const container = tabsRef.current;

      const tabRect = tabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 计算滚动位置
      if (tabRect.left < containerRect.left) {
        container.scrollLeft += tabRect.left - containerRect.left - 16;
      } else if (tabRect.right > containerRect.right) {
        container.scrollLeft += tabRect.right - containerRect.right + 16;
      }
    }
  }, [currentTab]);

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex-1 overflow-hidden"
    >
      <div className="border-b relative">
        <ScrollArea className="w-full">
          <div ref={tabsRef} className="px-4 overflow-x-auto no-scrollbar">
            <TabsList className="h-14 w-full justify-start">
              {categories.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={cn(
                    "relative transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                  disabled={isLoading}
                  ref={currentTab === value ? activeTabRef : undefined}
                >
                  <span>{label}</span>
                  {currentTab === value && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* 加载指示器 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/70"
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
