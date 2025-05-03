import { Grid, List, ArrowUpDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ANIMATION_DURATION, buttonVariants } from "./animation-constants";
import { cn } from "@/lib/utils";
import type {
  Category,
  ViewMode,
  SortField,
  SortDirection,
  ChangeHandler,
} from "./types";
import { useCallback, useMemo } from "react";

interface FilterControlsProps {
  currentTab: Category;
  viewMode: ViewMode;
  filterFeatured: boolean;
  filterInstalled: boolean;
  onTabChange: ChangeHandler<Category>;
  onViewModeChange: ChangeHandler<ViewMode>;
  onFeaturedFilterChange: ChangeHandler<boolean>;
  onInstalledFilterChange: ChangeHandler<boolean>;
  onSortChange: (by: SortField, direction: SortDirection) => void;
  currentSort?: { field: SortField; direction: SortDirection };
  activeFiltersCount?: number;
  isLoading?: boolean;
}

export function FilterControls({
  currentTab,
  viewMode,
  filterFeatured,
  filterInstalled,
  onTabChange,
  onViewModeChange,
  onFeaturedFilterChange,
  onInstalledFilterChange,
  onSortChange,
  currentSort = { field: "name", direction: "asc" },
  activeFiltersCount = 0,
  isLoading = false,
}: FilterControlsProps) {
  // 生成排序选项显示文本
  const getSortOptionLabel = useCallback(
    (field: SortField, direction: SortDirection) => {
      switch (field) {
        case "name":
          return direction === "asc" ? "名称 (A-Z)" : "名称 (Z-A)";
        case "downloads":
          return direction === "desc" ? "下载量 (高到低)" : "下载量 (低到高)";
        case "lastUpdated":
          return direction === "desc" ? "最近更新" : "最早更新";
        default:
          return "默认排序";
      }
    },
    []
  );

  // 当前排序选项的标签
  const currentSortLabel = useMemo(
    () => getSortOptionLabel(currentSort.field, currentSort.direction),
    [currentSort.field, currentSort.direction, getSortOptionLabel]
  );

  // 为了可访问性获取激活的过滤器信息
  const getActiveFiltersInfo = useCallback(() => {
    const filters = [];
    if (filterFeatured) filters.push("精选");
    if (filterInstalled) filters.push("已安装");
    return filters.length ? filters.join("、") : "无过滤器";
  }, [filterFeatured, filterInstalled]);

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 sm:gap-3 px-2 py-2 sm:px-3 sm:py-2.5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <div className="relative w-full sm:w-auto sm:flex-grow-0">
        <Select
          value={currentTab}
          onValueChange={onTabChange}
          disabled={isLoading}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                className={cn(
                  "w-full h-8 text-xs sm:w-[180px]",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <SelectValue placeholder="选择分类" />
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 h-4 px-1.5 text-xs"
                    aria-label={`${activeFiltersCount} 个激活的过滤器: ${getActiveFiltersInfo()}`}
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              选择软件分类
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: ANIMATION_DURATION.normal }}
            >
              <SelectItem value="all">所有分类</SelectItem>
              <SelectItem value="deepspace">深空</SelectItem>
              <SelectItem value="planets">行星</SelectItem>
              <SelectItem value="guiding">引导</SelectItem>
              <SelectItem value="analysis">分析</SelectItem>
              <SelectItem value="drivers">驱动</SelectItem>
              <SelectItem value="vendor">厂商</SelectItem>
              <SelectItem value="utilities">工具</SelectItem>
            </motion.div>
          </SelectContent>
        </Select>

        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="h-3 w-3 border-2 border-r-transparent rounded-full animate-spin border-primary/70" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between w-full sm:w-auto sm:flex-nowrap sm:justify-start gap-1.5 sm:gap-3 mt-2 sm:mt-0">
        {/* 筛选开关 - 使用compact style在移动端 */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Switch
                  id="featured-only"
                  checked={filterFeatured}
                  onCheckedChange={onFeaturedFilterChange}
                  disabled={isLoading}
                  aria-label="只显示精选项目"
                  className="h-3.5 w-7 data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="featured-only"
                  className={cn(
                    "text-xs cursor-pointer select-none",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  精选
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {filterFeatured ? "显示所有软件" : "只显示精选软件"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Switch
                  id="installed-only"
                  checked={filterInstalled}
                  onCheckedChange={onInstalledFilterChange}
                  disabled={isLoading}
                  aria-label="只显示已安装项目"
                  className="h-3.5 w-7 data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="installed-only"
                  className={cn(
                    "text-xs cursor-pointer select-none",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  已安装
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {filterInstalled ? "显示所有软件" : "只显示已安装软件"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 排序和布局控件 */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    onViewModeChange(viewMode === "list" ? "grid" : "list")
                  }
                  title={
                    viewMode === "list" ? "切换到网格视图" : "切换到列表视图"
                  }
                  disabled={isLoading}
                  aria-label={
                    viewMode === "list" ? "切换到网格视图" : "切换到列表视图"
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {viewMode === "list" ? (
                      <motion.span
                        key="grid"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: ANIMATION_DURATION.fast }}
                      >
                        <Grid className="h-3.5 w-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="list"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: ANIMATION_DURATION.fast }}
                      >
                        <List className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {viewMode === "list" ? "切换到网格视图" : "切换到列表视图"}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1.5 h-7 px-2 text-xs",
                        isLoading && "opacity-70 cursor-not-allowed"
                      )}
                      disabled={isLoading}
                      aria-label={`排序方式: ${currentSortLabel}`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      <span className="hidden xs:inline-block max-w-[65px] sm:max-w-none truncate">
                        {currentSortLabel}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                选择排序方式
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="min-w-[150px]">
              <DropdownMenuLabel className="text-xs">
                排序方式
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={`${currentSort.field}-${currentSort.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      SortField,
                      SortDirection
                    ];
                    onSortChange(field, direction);
                  }}
                >
                  <DropdownMenuRadioItem value="name-asc" className="text-xs">
                    <div className="flex items-center justify-between w-full">
                      <span>名称 (A-Z)</span>
                      {currentSort.field === "name" &&
                        currentSort.direction === "asc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc" className="text-xs">
                    <div className="flex items-center justify-between w-full">
                      <span>名称 (Z-A)</span>
                      {currentSort.field === "name" &&
                        currentSort.direction === "desc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem
                    value="downloads-desc"
                    className="text-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>下载量 (高到低)</span>
                      {currentSort.field === "downloads" &&
                        currentSort.direction === "desc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="downloads-asc"
                    className="text-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>下载量 (低到高)</span>
                      {currentSort.field === "downloads" &&
                        currentSort.direction === "asc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem
                    value="lastUpdated-desc"
                    className="text-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>最近更新</span>
                      {currentSort.field === "lastUpdated" &&
                        currentSort.direction === "desc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="lastUpdated-asc"
                    className="text-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>最早更新</span>
                      {currentSort.field === "lastUpdated" &&
                        currentSort.direction === "asc" && (
                          <Check className="h-3 w-3 ml-2" />
                        )}
                    </div>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
