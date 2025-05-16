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
  launcherTranslations,
} from "@/components/launcher";
import * as launcherApi from "@/components/launcher/launcher-api";
import { TranslationProvider } from "@/components/i18n";

function LauncherPageContent() {
  const searchParams = useSearchParams();

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

  // Initialize state from URL parameters
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

  // Optimize software filtering and sorting using useMemo
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

  // Calculate pagination information using useMemo
  const { totalPages, paginatedSoftware, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSoftware = filteredSoftware.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return { totalPages, paginatedSoftware, startIndex };
  }, [filteredSoftware, currentPage, itemsPerPage]);

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll) {
      // Clear previous timer to prevent memory leaks
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

  // Reset to page 1 when filter conditions change
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

  // Keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left/Right arrow keys for pagination
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }

      // Ctrl+F to focus search input
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        // If search bar is not visible, toggle its visibility first
        if (!searchVisible) {
          setSearchVisible(true);
        }
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          document.getElementById("search-input")?.focus();
        });
      }

      // ESC key to close details dialog
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

  // Installation simulation
  useEffect(() => {
    if (isInstalling) {
      const interval = setInterval(() => {
        updateInstallProgress(installProgress + 5);

        if (installProgress >= 100) {
          clearInterval(interval);
          completeInstallation();

          toast.success("Installation Complete", {
            description: `${selectedSoftware?.name} has been installed successfully.`,
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

  // Software action handling (install or launch)
  const handleSoftwareAction = useCallback(
    async (software: Software) => {
      if (software.actionLabel === "Install") {
        try {
          // Start installation state
          startInstallation(software.id);

          // Use API call to install software
          const { installationId } = await launcherApi.installSoftware(
            software.id.toString()
          );

          // Set up a poller to check installation progress
          const progressChecker = setInterval(async () => {
            try {
              const status = await launcherApi.getInstallationStatus(
                installationId
              );
              updateInstallProgress(status.progress);

              // Handle errors
              if (status.error) {
                clearInterval(progressChecker);
                toast.error("Installation Failed", {
                  description: status.error,
                });
                completeInstallation(); // Reset installation state
              }

              // Installation complete
              if (status.status === "completed" && status.progress >= 100) {
                clearInterval(progressChecker);
                completeInstallation();

                // Get updated software information (removed unused variable)
                // const updatedSoftware = await launcherApi.getSoftwareDetails(software.id.toString());

                // Update software information in the store
                const updatedSoftwareList = await launcherApi.getAllSoftware();
                useAppStore.getState().setSoftware(updatedSoftwareList);

                toast.success("Installation Complete", {
                  description: `${software.name} has been installed successfully.`,
                });
              }
            } catch (error) {
              clearInterval(progressChecker);
              console.error(
                `Error checking installation progress for ${software.name}:`,
                error
              );

              toast.error("Installation Progress Check Failed", {
                description:
                  error instanceof Error
                    ? error.message
                    : "Could not get installation progress",
              });

              completeInstallation(); // Reset installation state
            }
          }, 1000);

          // Clear progress checker if component unmounts
          return () => clearInterval(progressChecker);
        } catch (error) {
          console.error(`Error installing ${software.name}:`, error);

          toast.error("Installation Start Failed", {
            description:
              error instanceof Error
                ? error.message
                : "Could not start the installation process",
          });

          completeInstallation(); // Reset installation state
        }
      } else {
        try {
          // Use the encapsulated API instead of direct fetch
          const result = await launcherApi.launchSoftware(
            software.id.toString()
          );

          if (!result.success) {
            throw new Error("Could not launch software");
          }

          toast.success("Software Launched", {
            description: `${software.name} has been launched successfully.`,
          });

          setSelectedSoftware(null);
        } catch (error) {
          console.error(`Error launching ${software.name}:`, error);

          toast.error("Launch Failed", {
            description:
              error instanceof Error
                ? error.message
                : "Could not launch software",
          });
        }
      }
    },
    [
      startInstallation,
      updateInstallProgress,
      completeInstallation,
      setSelectedSoftware,
    ]
  );

  // Refresh handling
  const handleRefresh = useCallback(async () => {
    try {
      // Use API to get the latest software list
      const softwareList = await launcherApi.getAllSoftware();
      // Update the store with the fetched list
      useAppStore.getState().setSoftware(softwareList);
      await refreshSystemInfo();

      toast.success("Refreshed", {
        description: "Software list has been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing software list:", error);

      toast.error("Refresh Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Could not refresh software list.",
      });
    }
  }, [refreshSystemInfo]);

  // Calculate filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterFeatured) count++;
    if (filterInstalled) count++;
    return count;
  }, [filterFeatured, filterInstalled]);

  // Current sort settings
  const currentSort = useMemo(
    () => ({ field: sortBy, direction: sortDirection }),
    [sortBy, sortDirection]
  );

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden pb-0">
        {/* Search Bar Component - 减小内边距 */}
        <SearchBar
          searchQuery={searchQuery}
          searchVisible={searchVisible}
          onSearchChange={setSearchQuery}
          onSearchVisibilityToggle={() => setSearchVisible(!searchVisible)}
          onRefresh={handleRefresh}
        />

        {/* Filter Controls Component - 减小内边距，仅在搜索可见时显示 */}
        {searchVisible && (
          <FilterControls
            viewMode={viewMode as ViewMode}
            filterFeatured={filterFeatured}
            filterInstalled={filterInstalled}
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

        {/* Category Tabs Component - 减小内边距 */}
        <CategoryTabs
          currentTab={currentTab as Category}
          onTabChange={setCurrentTab}
        />

        {/* Auto Scroll Controls Component - 减小内边距 */}
        <AutoScrollControls
          autoScroll={autoScroll}
          scrollSpeed={scrollSpeed}
          itemsPerPage={itemsPerPage}
          onAutoScrollToggle={() => setAutoScroll(!autoScroll)}
          onScrollSpeedChange={setScrollSpeed}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Software List - 只有这里允许滚动 */}
        <div className="flex-1 overflow-y-auto p-1.5 border-t">
          {filteredSoftware.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-sm">No software found matching the criteria</p>
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
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Results Summary - 减小间距 */}
              <div className="text-xs text-muted-foreground mb-2">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredSoftware.length)}{" "}
                of {filteredSoftware.length} results
              </div>

              {/* Software Items List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                    : "space-y-2"
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

        {/* Pagination Controls - 放在底部固定位置 */}
        <div className="border-t py-1">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSoftware.length}
          />
        </div>

        {/* Software Details Dialog */}
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

export default function LauncherPage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage =
    typeof navigator !== "undefined"
      ? navigator.language.startsWith("zh")
        ? "zh-CN"
        : "en"
      : "en";

  // 从用户区域确定地区
  const userRegion = userLanguage === "zh-CN" ? "CN" : "US";

  return (
    <TranslationProvider
      initialDictionary={
        launcherTranslations[userLanguage] || launcherTranslations["en"]
      }
      lang={userLanguage.split("-")[0]}
      initialRegion={userRegion}
    >
      <LauncherPageContent />
    </TranslationProvider>
  );
}
