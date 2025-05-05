import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMATION_DURATION } from "./animation-constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Category, ChangeHandler } from "./types";
import { CATEGORIES } from "./constants";
import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import * as launcherApi from "./launcher-api";

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
  const [categories, setCategories] = useState<
    Array<{ value: Category; label: string }>
  >([
    { value: "all", label: "全部" }, // "全部" 分类总是会有
  ]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // 从API获取分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const apiCategories = await launcherApi.getCategories();

        // 过滤并处理API返回的分类，只保留已定义的分类
        const processedCategories = apiCategories
          .filter((cat) =>
            CATEGORIES.includes(cat.id.toLowerCase() as Category)
          )
          .map((cat) => ({
            value: cat.id.toLowerCase() as Category,
            label: cat.name,
          }));

        // 确保"全部"分类总在第一位
        setCategories([
          { value: "all", label: "全部" },
          ...processedCategories,
        ]);
      } catch (error) {
        console.error("获取软件分类失败:", error);
        // 如果API调用失败，退回到默认分类
        setCategories([
          { value: "all", label: "全部" },
          { value: "deepspace", label: "深空" },
          { value: "planets", label: "行星" },
          { value: "guiding", label: "引导" },
          { value: "analysis", label: "分析" },
          { value: "drivers", label: "驱动" },
          { value: "vendor", label: "厂商" },
          { value: "utilities", label: "工具" },
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // 只在组件挂载时获取一次分类

  const handleTabChange = useCallback(
    (value: string) => {
      if (isLoading || isLoadingCategories) return;
      onTabChange(value as Category);
    },
    [isLoading, isLoadingCategories, onTabChange]
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

  // 确保当前选中的分类存在于列表中
  useEffect(() => {
    if (
      categories.length > 0 &&
      !categories.some((cat) => cat.value === currentTab)
    ) {
      // 如果当前选中的分类不在列表中，则默认选择"全部"
      onTabChange("all");
    }
  }, [categories, currentTab, onTabChange]);

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
                    (isLoading || isLoadingCategories) &&
                      "opacity-70 cursor-not-allowed",
                    currentTab === value
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  disabled={isLoading || isLoadingCategories}
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
        {(isLoading || isLoadingCategories) && (
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
