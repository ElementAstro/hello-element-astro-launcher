"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Grid,
  List,
  ArrowUpDown,
  Clock,
  Info,
  DownloadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import type { Software } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Constants
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50];
const CATEGORIES = [
  "all",
  "deepspace",
  "planets",
  "guiding",
  "analysis",
  "drivers",
  "vendor",
  "utilities",
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const progressVariants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.3, ease: "easeOut" },
  }),
};

const dialogVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", duration: 0.3 },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

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
      const normalizedCategory = category.toLowerCase();
      if (CATEGORIES.includes(normalizedCategory)) {
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
        setCurrentPage((prev) => {
          if (prev < totalPages) {
            return prev + 1;
          } else {
            return 1; // Loop back to first page
          }
        });
      }, scrollSpeed * 1000);
    } else if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScroll, scrollSpeed, totalPages, setCurrentPage]);

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
        setCurrentPage((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
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
        {/* Search Bar */}
        <div className={cn("p-4 border-b", !searchVisible && "hidden")}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                id="search-input"
                placeholder="Search software..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={() => setSearchVisible(!searchVisible)}
              >
                {searchVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Search
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Search
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Select value={currentTab} onValueChange={setCurrentTab}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="deepspace">Deep Space</SelectItem>
                <SelectItem value="planets">Planets</SelectItem>
                <SelectItem value="guiding">Guiding</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="drivers">Drivers</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured-only"
                  checked={filterFeatured}
                  onCheckedChange={setFilterFeatured}
                />
                <Label
                  htmlFor="featured-only"
                  className="text-sm cursor-pointer"
                >
                  Featured Only
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="installed-only"
                  checked={filterInstalled}
                  onCheckedChange={setFilterInstalled}
                />
                <Label
                  htmlFor="installed-only"
                  className="text-sm cursor-pointer"
                >
                  Installed Only
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                title={
                  viewMode === "list"
                    ? "Switch to Grid View"
                    : "Switch to List View"
                }
              >
                {viewMode === "list" ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Sort Options">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("name");
                        setSortDirection("asc");
                      }}
                    >
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("name");
                        setSortDirection("desc");
                      }}
                    >
                      Name (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("downloads");
                        setSortDirection("desc");
                      }}
                    >
                      Most Downloads
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("lastUpdated");
                        setSortDirection("desc");
                      }}
                    >
                      Recently Updated
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("lastUpdated");
                        setSortDirection("asc");
                      }}
                    >
                      Oldest Updated
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="flex-1 overflow-hidden"
        >
          <div className="px-4 border-b overflow-x-auto">
            <TabsList className="h-14 w-full justify-start">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="deepspace"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Deep Space
              </TabsTrigger>
              <TabsTrigger
                value="planets"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Planets
              </TabsTrigger>
              <TabsTrigger
                value="guiding"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Guiding
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Analysis
              </TabsTrigger>
              <TabsTrigger
                value="drivers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Drivers
              </TabsTrigger>
              <TabsTrigger
                value="vendor"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Vendor
              </TabsTrigger>
              <TabsTrigger
                value="utilities"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Utilities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Auto-scroll Controls */}
          <div className="px-4 py-2 border-b flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={autoScroll ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoScroll(!autoScroll)}
              >
                {autoScroll ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Auto-Scroll
                  </>
                )}
              </Button>

              {autoScroll && (
                <div className="flex items-center gap-2 ml-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[scrollSpeed]}
                    min={1}
                    max={10}
                    step={1}
                    className="w-24"
                    onValueChange={(value) => setScrollSpeed(value[0])}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {scrollSpeed}s
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Label
                htmlFor="items-per-page"
                className="text-sm whitespace-nowrap"
              >
                Items per page:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) =>
                  setItemsPerPage(Number.parseInt(value))
                }
              >
                <SelectTrigger id="items-per-page" className="w-16">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Software List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredSoftware.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Search className="h-8 w-8 mb-2 opacity-50" />
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
                  {Math.min(startIndex + itemsPerPage, filteredSoftware.length)}{" "}
                  of {filteredSoftware.length} results
                </div>

                {/* Software items */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  )}
                >
                  {paginatedSoftware.map((software) => (
                    <motion.div
                      key={software.id}
                      variants={itemVariants}
                      exit="exit"
                    >
                      <SoftwareItem
                        software={software}
                        viewMode={viewMode}
                        onAction={() => handleSoftwareAction(software)}
                        onInfo={() => setSelectedSoftware(software)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageToShow}
                      variant={
                        currentPage === pageToShow ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setCurrentPage(pageToShow)}
                      className="w-8 h-8"
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </Tabs>

        {/* Software Details Dialog */}
        <Dialog
          open={!!selectedSoftware}
          onOpenChange={(open) => !open && setSelectedSoftware(null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            {selectedSoftware && (
              <motion.div
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedSoftware.icon || "/placeholder.svg"}
                      alt={selectedSoftware.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <DialogTitle>{selectedSoftware.name}</DialogTitle>
                  </div>
                  <DialogDescription>
                    {selectedSoftware.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Version:</div>
                    <div>{selectedSoftware.version}</div>

                    <div className="text-muted-foreground">Size:</div>
                    <div>{selectedSoftware.size}</div>

                    <div className="text-muted-foreground">Developer:</div>
                    <div>{selectedSoftware.developer}</div>

                    <div className="text-muted-foreground">Downloads:</div>
                    <div>{selectedSoftware.downloads.toLocaleString()}</div>

                    <div className="text-muted-foreground">Last Updated:</div>
                    <div>
                      {new Date(
                        selectedSoftware.lastUpdated
                      ).toLocaleDateString()}
                    </div>

                    <div className="text-muted-foreground">Status:</div>
                    <div>
                      {selectedSoftware.installed ? (
                        <Badge variant="default">Installed</Badge>
                      ) : (
                        <Badge variant="secondary">Not Installed</Badge>
                      )}
                    </div>

                    {selectedSoftware.dependencies &&
                      selectedSoftware.dependencies.length > 0 && (
                        <>
                          <div className="text-muted-foreground">
                            Dependencies:
                          </div>
                          <div>{selectedSoftware.dependencies.join(", ")}</div>
                        </>
                      )}

                    {selectedSoftware.tags &&
                      selectedSoftware.tags.length > 0 && (
                        <>
                          <div className="text-muted-foreground">Tags:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedSoftware.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                  </div>

                  {isInstalling &&
                    selectedSoftware.actionLabel === "Install" && (
                      <motion.div
                        variants={progressVariants}
                        initial="initial"
                        animate="animate"
                        custom={installProgress}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span>Installing...</span>
                          <span>{installProgress}%</span>
                        </div>
                        <Progress value={installProgress} />
                      </motion.div>
                    )}

                  {selectedSoftware.releaseNotes && (
                    <div className="space-y-2">
                      <Label>Release Notes</Label>
                      <div className="text-sm p-2 bg-muted rounded-md max-h-24 overflow-y-auto">
                        {selectedSoftware.releaseNotes}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  {selectedSoftware.website && (
                    <Button
                      variant="outline"
                      className="mr-auto"
                      onClick={() =>
                        window.open(selectedSoftware.website, "_blank")
                      }
                    >
                      Visit Website
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      handleSoftwareAction(selectedSoftware);
                      if (selectedSoftware.actionLabel === "Launch") {
                        setSelectedSoftware(null);
                      }
                    }}
                    disabled={isInstalling}
                  >
                    {selectedSoftware.actionLabel === "Install" ? (
                      <>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Install
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Launch
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

interface SoftwareItemProps {
  software: Software;
  viewMode: "grid" | "list";
  onAction: () => void;
  onInfo: () => void;
}

function SoftwareItem({
  software,
  viewMode,
  onAction,
  onInfo,
}: SoftwareItemProps) {
  const formattedDate = new Date(software.lastUpdated).toLocaleDateString();

  if (viewMode === "grid") {
    return (
      <div className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 flex items-center gap-3 border-b bg-muted/20">
          <Image
            src={software.icon || "/placeholder.svg"}
            alt={software.name}
            width={40}
            height={40}
            className="rounded"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium truncate">
                {software.name}
              </h3>
              {software.featured && (
                <Badge variant="secondary" className="ml-auto">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {software.description}
          </p>
        </div>
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>v{software.version}</span>
            <span>Updated: {formattedDate}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfo}
              title="More Info"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant={
                software.actionLabel === "Launch" ? "default" : "outline"
              }
              size="sm"
              className="whitespace-nowrap"
              onClick={onAction}
            >
              {software.actionLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mr-4">
        <Image
          src={software.icon || "/placeholder.svg"}
          alt={software.name}
          width={40}
          height={40}
          className="rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">{software.name}</h3>
          {software.featured && <Badge variant="secondary">Featured</Badge>}
          {software.installed && <Badge variant="outline">Installed</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {software.description}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>v{software.version}</span>
          <span>{software.downloads.toLocaleString()} downloads</span>
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0 flex gap-2">
        <Button variant="ghost" size="icon" onClick={onInfo} title="More Info">
          <Info className="h-4 w-4" />
        </Button>
        <Button
          variant={software.actionLabel === "Launch" ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          onClick={onAction}
        >
          {software.actionLabel}
        </Button>
      </div>
    </div>
  );
}
