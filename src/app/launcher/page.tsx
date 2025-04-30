"use client";

import { useEffect, useRef } from "react";
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

  // Get state from Zustand store
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
      if (normalizedCategory === "all" ||
          normalizedCategory === "deepspace" ||
          normalizedCategory === "planets" ||
          normalizedCategory === "guiding" ||
          normalizedCategory === "analysis" ||
          normalizedCategory === "drivers" ||
          normalizedCategory === "vendor" ||
          normalizedCategory === "utilities") {
        setCurrentTab(normalizedCategory);
      }
    }

    const softwareParam = searchParams.get("software");
    if (softwareParam) {
      setSearchQuery(softwareParam);
    }
  }, [searchParams, setCurrentTab, setSearchQuery]);

  // Filter and sort software items
  const filteredSoftware = software
    .filter(
      (item) =>
        (currentTab === "all" || item.category === currentTab) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
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

  // Pagination
  const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSoftware = filteredSoftware.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll) {
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

  // Reset to page 1 when filters change
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow left/right for pagination
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }

      // Ctrl+F for search focus
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, setCurrentPage]);

  // Handle installation simulation
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

  // Handle software action (install or launch)
  const handleSoftwareAction = async (software: Software) => {
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
          throw new Error(data.error || "Failed to launch software");
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
              : "Failed to launch software",
        });
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
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
            : "Failed to refresh software list.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <SearchBar
          searchQuery={searchQuery}
          searchVisible={searchVisible}
          onSearchChange={setSearchQuery}
          onSearchVisibilityToggle={() => setSearchVisible(!searchVisible)}
          onRefresh={handleRefresh}
        />

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
          />
        )}

        <CategoryTabs 
          currentTab={currentTab as Category} 
          onTabChange={setCurrentTab} 
        />

        <AutoScrollControls
          autoScroll={autoScroll}
          scrollSpeed={scrollSpeed}
          itemsPerPage={itemsPerPage}
          onAutoScrollToggle={() => setAutoScroll(!autoScroll)}
          onScrollSpeedChange={setScrollSpeed}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Software List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSoftware.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>No software found matching your criteria</p>
              <Button
                variant="link"
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
              {/* Results summary */}
              <div className="text-sm text-muted-foreground mb-4">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredSoftware.length)} of{" "}
                {filteredSoftware.length} results
              </div>

              {/* Software items */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
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

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

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
