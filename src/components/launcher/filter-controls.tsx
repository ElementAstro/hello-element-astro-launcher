import { Grid, List, ArrowUpDown, Check } from "lucide-react";
import { motion } from "framer-motion";
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
  ViewMode,
  SortField,
  SortDirection,
  ChangeHandler,
} from "./types";
import { useCallback, useMemo } from "react";
import { useTranslations } from "@/components/i18n";

interface FilterControlsProps {
  viewMode: ViewMode;
  filterFeatured: boolean;
  filterInstalled: boolean;
  onViewModeChange: ChangeHandler<ViewMode>;
  onFeaturedFilterChange: ChangeHandler<boolean>;
  onInstalledFilterChange: ChangeHandler<boolean>;
  onSortChange: (by: SortField, direction: SortDirection) => void;
  currentSort?: { field: SortField; direction: SortDirection };
  activeFiltersCount?: number;
  isLoading?: boolean;
}

export function FilterControls({
  viewMode,
  filterFeatured,
  filterInstalled,
  onViewModeChange,
  onFeaturedFilterChange,
  onInstalledFilterChange,
  onSortChange,
  currentSort = { field: "name", direction: "asc" },
  activeFiltersCount = 0,
  isLoading = false,
}: FilterControlsProps) {
  const { t } = useTranslations();

  // 生成排序选项显示文本
  const getSortOptionLabel = useCallback(
    (field: SortField, direction: SortDirection) => {
      switch (field) {
        case "name":
          return direction === "asc"
            ? t("launcher.filter.sortNameAsc", { defaultValue: "名称 (A-Z)" })
            : t("launcher.filter.sortNameDesc", { defaultValue: "名称 (Z-A)" });
        case "downloads":
          return direction === "desc"
            ? t("launcher.filter.sortDownloadsDesc", {
                defaultValue: "下载量 (高到低)",
              })
            : t("launcher.filter.sortDownloadsAsc", {
                defaultValue: "下载量 (低到高)",
              });
        case "lastUpdated":
          return direction === "desc"
            ? t("launcher.filter.sortUpdatedDesc", { defaultValue: "最近更新" })
            : t("launcher.filter.sortUpdatedAsc", { defaultValue: "最早更新" });
        default:
          return t("launcher.filter.sortDefault", { defaultValue: "默认排序" });
      }
    },
    [t]
  );

  // 当前排序选项的标签
  const currentSortLabel = useMemo(
    () => getSortOptionLabel(currentSort.field, currentSort.direction),
    [currentSort.field, currentSort.direction, getSortOptionLabel]
  );
  // 移除未使用的函数

  return (
    <motion.div
      className="flex flex-col px-1 py-0.5 border-b"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      {/* 过滤器状态指示 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">
            {t("launcher.filter.filters", { defaultValue: "过滤器:" })}
          </span>
          {activeFiltersCount > 0 ? (
            <Badge
              variant="secondary"
              className="h-4 text-[9px] px-1 py-0 rounded-sm bg-primary/15"
            >
              {activeFiltersCount}{" "}
              {t("launcher.filter.active", { defaultValue: "已启用" })}
            </Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground">
              {t("launcher.filter.none", { defaultValue: "无" })}
            </span>
          )}
          
          {isLoading && (
            <div className="ml-2" aria-label="Loading">
              <div className="h-3 w-3 border-2 border-r-transparent rounded-full animate-spin border-primary/70" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto sm:flex-nowrap sm:justify-start gap-1 sm:gap-1.5 mt-1 sm:mt-0">
          {/* 筛选开关 - 更紧凑的布局 */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Switch
                    id="featured-only"
                    checked={filterFeatured}
                    onCheckedChange={onFeaturedFilterChange}
                    disabled={isLoading}
                    aria-label={t("launcher.filter.featuredOnly", {
                      defaultValue: "只显示精选项目",
                    })}
                    className="h-3 w-6 data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="featured-only"
                    className={cn(
                      "text-[10px] cursor-pointer select-none",
                      isLoading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {t("launcher.filter.featured", { defaultValue: "精选" })}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px]">
                {filterFeatured
                  ? t("launcher.filter.showAllSoftware", {
                      defaultValue: "显示所有软件",
                    })
                  : t("launcher.filter.showFeaturedSoftware", {
                      defaultValue: "只显示精选软件",
                    })}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Switch
                    id="installed-only"
                    checked={filterInstalled}
                    onCheckedChange={onInstalledFilterChange}
                    disabled={isLoading}
                    aria-label={t("launcher.filter.installedOnly", {
                      defaultValue: "只显示已安装项目",
                    })}
                    className="h-3 w-6 data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="installed-only"
                    className={cn(
                      "text-[10px] cursor-pointer select-none",
                      isLoading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {t("launcher.filter.installed", { defaultValue: "已安装" })}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px]">
                {filterInstalled
                  ? t("launcher.filter.showAllSoftware", {
                      defaultValue: "显示所有软件",
                    })
                  : t("launcher.filter.showInstalledSoftware", {
                      defaultValue: "只显示已安装软件",
                    })}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 排序和布局控件 */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
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
                    className="h-6 w-6"
                    onClick={() =>
                      onViewModeChange(viewMode === "list" ? "grid" : "list")
                    }
                    title={
                      viewMode === "list"
                        ? t("launcher.filter.switchToGridView", {
                            defaultValue: "切换到网格视图",
                          })
                        : t("launcher.filter.switchToListView", {
                            defaultValue: "切换到列表视图",
                          })
                    }
                  >
                    {viewMode === "list" ? (
                      <Grid className="h-3 w-3" />
                    ) : (
                      <List className="h-3 w-3" />
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px]">
                {viewMode === "list"
                  ? t("launcher.filter.switchToGridView", {
                      defaultValue: "切换到网格视图",
                    })
                  : t("launcher.filter.switchToListView", {
                      defaultValue: "切换到列表视图",
                    })}
              </TooltipContent>
            </Tooltip>

            {/* 排序下拉菜单 */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-[10px] flex items-center gap-1"
                    >
                      <ArrowUpDown className="h-3 w-3 mr-0.5" />
                      <span className="hidden xs:inline">
                        {currentSortLabel}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  {t("launcher.filter.changeSortOrder", {
                    defaultValue: "更改排序方式",
                  })}
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] py-1">
                    {t("launcher.filter.sortBy", { defaultValue: "排序方式" })}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={`${currentSort.field}-${currentSort.direction}`}
                    onValueChange={(value) => {
                      // 从值字符串解析出字段和方向
                      const [field, direction] = value.split("-") as [
                        SortField,
                        SortDirection
                      ];
                      onSortChange(field, direction);
                    }}
                  >
                    <DropdownMenuRadioItem value="name-asc" className="text-[10px]">
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortNameAsc", {
                            defaultValue: "名称 (A-Z)",
                          })}
                        </span>
                        {currentSort.field === "name" &&
                          currentSort.direction === "asc" && (
                            <Check className="h-3 w-3 ml-2" />
                          )}
                      </div>
                    </DropdownMenuRadioItem>
                    {/* ...其他排序选项 */}
                    <DropdownMenuRadioItem value="name-desc" className="text-[10px]">
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortNameDesc", {
                            defaultValue: "名称 (Z-A)",
                          })}
                        </span>
                        {currentSort.field === "name" &&
                          currentSort.direction === "desc" && (
                            <Check className="h-3 w-3 ml-2" />
                          )}
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioItem
                      value="downloads-desc"
                      className="text-[10px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortDownloadsDesc", {
                            defaultValue: "下载量 (高到低)",
                          })}
                        </span>
                        {currentSort.field === "downloads" &&
                          currentSort.direction === "desc" && (
                            <Check className="h-3 w-3 ml-2" />
                          )}
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="downloads-asc"
                      className="text-[10px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortDownloadsAsc", {
                            defaultValue: "下载量 (低到高)",
                          })}
                        </span>
                        {currentSort.field === "downloads" &&
                          currentSort.direction === "asc" && (
                            <Check className="h-3 w-3 ml-2" />
                          )}
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioItem
                      value="lastUpdated-desc"
                      className="text-[10px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortUpdatedDesc", {
                            defaultValue: "最近更新",
                          })}
                        </span>
                        {currentSort.field === "lastUpdated" &&
                          currentSort.direction === "desc" && (
                            <Check className="h-3 w-3 ml-2" />
                          )}
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="lastUpdated-asc"
                      className="text-[10px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {t("launcher.filter.sortUpdatedAsc", {
                            defaultValue: "最早更新",
                          })}
                        </span>
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
      </div>
    </motion.div>
  );
}
