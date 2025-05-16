import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMATION_DURATION } from "./animation-constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Category, ChangeHandler } from "./types";
import { CATEGORIES } from "./constants";
import { useRef, useEffect, useState } from "react";
import * as launcherApi from "./launcher-api";
import { useTranslations } from "@/components/i18n";

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
  const { t } = useTranslations();
  const [categories, setCategories] = useState<
    Array<{ value: Category; label: string }>
  >([
    {
      value: "all",
      label: t("launcher.categories.all", { defaultValue: "全部" }),
    }, // "全部" 分类总是会有
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
          {
            value: "all",
            label: t("launcher.categories.all", { defaultValue: "全部" }),
          },
          ...processedCategories,
        ]);
      } catch (error) {
        console.error(
          t("launcher.categories.fetchError", {
            defaultValue: "获取软件分类失败:",
          }),
          error
        );
        // 如果API调用失败，退回到默认分类
        setCategories([
          {
            value: "all",
            label: t("launcher.categories.all", { defaultValue: "全部" }),
          },
          {
            value: "deepspace",
            label: t("launcher.categories.deepspace", { defaultValue: "深空" }),
          },
          {
            value: "planets",
            label: t("launcher.categories.planets", { defaultValue: "行星" }),
          },
          {
            value: "guiding",
            label: t("launcher.categories.guiding", { defaultValue: "引导" }),
          },
          {
            value: "analysis",
            label: t("launcher.categories.analysis", { defaultValue: "分析" }),
          },
          {
            value: "drivers",
            label: t("launcher.categories.drivers", { defaultValue: "驱动" }),
          },
          {
            value: "vendor",
            label: t("launcher.categories.vendor", { defaultValue: "厂商" }),
          },
          {
            value: "utilities",
            label: t("launcher.categories.utilities", { defaultValue: "工具" }),
          },
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [t]); // 当t(翻译函数)改变时重新获取分类
  // 不需要单独的handleTabChange函数，直接在onValueChange中调用

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

  return (    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
      className="border-b py-0.5"
    >
      <ScrollArea className="w-full whitespace-nowrap px-0.5">
        <Tabs
          ref={tabsRef}
          value={currentTab}
          onValueChange={(value) => onTabChange(value as Category)}
          className="w-full"
        >
          <TabsList className="h-6 bg-transparent">
            {categories.map((tab) => (
              <TabsTrigger
                ref={tab.value === currentTab ? activeTabRef : undefined}
                key={tab.value}
                value={tab.value}
                disabled={isLoading || isLoadingCategories}
                className="h-5 text-xs px-2 data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </motion.div>
  );
}
