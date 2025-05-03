"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";
import { AppLayout } from "@/components/app-layout";
import { containerVariants } from "@/components/launcher/animation-constants";
import {
  SearchBar,
  FilterControls,
  CategoryTabs,
  AutoScrollControls,
  PaginationControls,
  SoftwareItem,
  SoftwareDetailsDialog,
  type Category,
  type ViewMode,
  type SortField,
  type SortDirection,
  type Software,
} from "@/components/launcher";

export default function LauncherPage() {
  const searchParams = useSearchParams();

  // 使用解构赋值获取状态和动作，避免频繁从store对象访问属性
  const {
    software,
    currentTab,
    searchVisible,
    searchQuery,
    currentPage,
    itemsPerPage,
    viewMode,
    sortBy,
    sortDirection,
    autoScroll,
    scrollSpeed,
    filterFeatured,
    filterInstalled,
    selectedSoftware,
    isInstalling,
    installProgress,

    setCurrentTab,
    setSearchVisible,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setViewMode,
    setSortBy,
    setSortDirection,
    setAutoScroll,
    setScrollSpeed,
    setFilterFeatured,
    setFilterInstalled,
    setSelectedSoftware,

    startInstallation,
    updateInstallProgress,
    completeInstallation,
    refreshSystemInfo,
  } = useAppStore();

  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 从URL参数初始化状态
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      const normalizedCategory = category.toLowerCase() as Category;
      if (
        normalizedCategory === "all" ||
        normalizedCategory === "deepspace" ||
        normalizedCategory === "planets" ||
        normalizedCategory === "guiding" ||
        normalizedCategory === "analysis" ||
        normalizedCategory === "drivers" ||
        normalizedCategory === "vendor" ||
        normalizedCategory === "utilities"
      ) {
        setCurrentTab(normalizedCategory);
      }
    }

    const softwareParam = searchParams.get("software");
    if (softwareParam) {
      setSearchQuery(softwareParam);
    }
  }, [searchParams, setCurrentTab, setSearchQuery]);

  // 使用useMemo优化软件筛选和排序
  const filteredSoftware = useMemo(() => {
    return software
      .filter(
        (item) =>
          (currentTab === "all" || item.category === currentTab) &&
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) &&
          (!filterFeatured || item.featured) &&
          (!filterInstalled || item.installed)
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === "downloads") {
          return sortDirection === "asc"
            ? a.downloads - b.downloads
            : b.downloads - a.downloads;
        } else {
          return sortDirection === "asc"
            ? new Date(a.lastUpdated).getTime() -
                new Date(b.lastUpdated).getTime()
            : new Date(b.lastUpdated).getTime() -
                new Date(a.lastUpdated).getTime();
        }
      });
  }, [
    software,
    currentTab,
    searchQuery,
    filterFeatured,
    filterInstalled,
    sortBy,
    sortDirection,
  ]);

  // 使用useMemo计算分页信息
  const { totalPages, paginatedSoftware, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSoftware = filteredSoftware.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return { totalPages, paginatedSoftware, startIndex };
  }, [filteredSoftware, currentPage, itemsPerPage]);

  // 自动滚动功能
  useEffect(() => {
    if (autoScroll) {
      // 清除之前的计时器以防止内存泄漏
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }

      autoScrollTimerRef.current = setInterval(() => {
        const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
        setCurrentPage(nextPage);
      }, scrollSpeed * 1000);
    } else if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScroll, scrollSpeed, totalPages, setCurrentPage, currentPage]);

  // 当筛选条件更改时重置到第1页
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    currentTab,
    itemsPerPage,
    filterFeatured,
    filterInstalled,
    sortBy,
    sortDirection,
    setCurrentPage,
  ]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 左右箭头键用于分页
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }

      // Ctrl+F 聚焦搜索框
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        // 如果搜索栏未显示，则先切换搜索栏可见性
        if (!searchVisible) {
          setSearchVisible(true);
        }
        // 使用requestAnimationFrame确保DOM已更新
        requestAnimationFrame(() => {
          document.getElementById("search-input")?.focus();
        });
      }

      // ESC键关闭详情对话框
      if (e.key === "Escape" && selectedSoftware) {
        setSelectedSoftware(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentPage,
    totalPages,
    setCurrentPage,
    searchVisible,
    setSearchVisible,
    selectedSoftware,
    setSelectedSoftware,
  ]);

  // 安装模拟
  useEffect(() => {
    if (isInstalling) {
      const interval = setInterval(() => {
        updateInstallProgress(installProgress + 5);

        if (installProgress >= 100) {
          clearInterval(interval);
          completeInstallation();

          toast.success("安装完成", {
            description: `${selectedSoftware?.name} 已成功安装。`,
          });
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [
    isInstalling,
    installProgress,
    updateInstallProgress,
    completeInstallation,
    selectedSoftware,
  ]);

  // 软件操作处理（安装或启动）
  const handleSoftwareAction = useCallback(
    async (software: Software) => {
      if (software.actionLabel === "Install") {
        startInstallation(software.id);
      } else {
        try {
          const response = await fetch("/api/software/launch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: software.id }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "无法启动软件");
          }

          toast.success("软件已启动", {
            description: `${software.name} 已成功启动。`,
          });

          setSelectedSoftware(null);
        } catch (error) {
          console.error(`启动 ${software.name} 时出错:`, error);

          toast.error("启动失败", {
            description:
              error instanceof Error ? error.message : "无法启动软件",
          });
        }
      }
    },
    [startInstallation, setSelectedSoftware]
  );

  // 刷新处理
  const handleRefresh = useCallback(async () => {
    try {
      await refreshSystemInfo();

      toast.success("已刷新", {
        description: "软件列表已刷新。",
      });
    } catch (error) {
      console.error("刷新软件列表时出错:", error);

      toast.error("刷新失败", {
        description:
          error instanceof Error ? error.message : "无法刷新软件列表。",
      });
    }
  }, [refreshSystemInfo]);

  // 计算过滤器数量
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterFeatured) count++;
    if (filterInstalled) count++;
    return count;
  }, [filterFeatured, filterInstalled]);

  // 当前排序设置
  const currentSort = useMemo(
    () => ({ field: sortBy, direction: sortDirection }),
    [sortBy, sortDirection]
  );

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden pb-12 sm:pb-0">
        {/* 搜索栏组件 */}
        <SearchBar
          searchQuery={searchQuery}
          searchVisible={searchVisible}
          onSearchChange={setSearchQuery}
          onSearchVisibilityToggle={() => setSearchVisible(!searchVisible)}
          onRefresh={handleRefresh}
        />

        {/* 过滤控件组件 - 仅在搜索可见时显示 */}
        {searchVisible && (
          <FilterControls
            currentTab={currentTab as Category}
            viewMode={viewMode as ViewMode}
            filterFeatured={filterFeatured}
            filterInstalled={filterInstalled}
            onTabChange={setCurrentTab}
            onViewModeChange={setViewMode as (mode: ViewMode) => void}
            onFeaturedFilterChange={setFilterFeatured}
            onInstalledFilterChange={setFilterInstalled}
            onSortChange={(by: SortField, direction: SortDirection) => {
              setSortBy(by);
              setSortDirection(direction);
            }}
            currentSort={currentSort}
            activeFiltersCount={activeFiltersCount}
          />
        )}

        {/* 分类标签组件 */}
        <CategoryTabs
          currentTab={currentTab as Category}
          onTabChange={setCurrentTab}
        />

        {/* 自动滚动控件组件 */}
        <AutoScrollControls
          autoScroll={autoScroll}
          scrollSpeed={scrollSpeed}
          itemsPerPage={itemsPerPage}
          onAutoScrollToggle={() => setAutoScroll(!autoScroll)}
          onScrollSpeedChange={setScrollSpeed}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* 软件列表 */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          {filteredSoftware.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-sm">没有找到符合条件的软件</p>
              <Button
                variant="link"
                size="sm"
                className="text-xs mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setFilterFeatured(false);
                  setFilterInstalled(false);
                }}
              >
                清除筛选条件
              </Button>
            </div>
          ) : (
            <>
              {/* 结果摘要 */}
              <div className="text-xs text-muted-foreground mb-3">
                显示 {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredSoftware.length)}/{" "}
                {filteredSoftware.length} 个结果
              </div>

              {/* 软件项目列表 */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    : "space-y-3"
                }`}
              >
                {paginatedSoftware.map((software) => (
                  <motion.div
                    key={software.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <SoftwareItem
                      software={software}
                      viewMode={viewMode as ViewMode}
                      onAction={() => handleSoftwareAction(software)}
                      onInfo={() => setSelectedSoftware(software)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>

        {/* 分页控件 */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredSoftware.length}
        />

        {/* 软件详情对话框 */}
        <SoftwareDetailsDialog
          software={selectedSoftware}
          isOpen={!!selectedSoftware}
          isInstalling={isInstalling}
          installProgress={installProgress}
          onOpenChange={(open) => !open && setSelectedSoftware(null)}
          onAction={handleSoftwareAction}
        />
      </div>
    </AppLayout>
  );
}
