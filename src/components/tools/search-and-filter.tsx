import { Search, RefreshCw, Star, Filter, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { VARIANTS, DURATION } from "./animation-constants";
import { useToolsTranslations } from "./i18n-provider";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  filters?: { [key: string]: string | boolean };
  onFilterChange?: (filters: { [key: string]: string | boolean }) => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
  isRefreshing = false,
  filters = {},
  onFilterChange,
}: SearchAndFilterProps) {
  const [showClearButton, setShowClearButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  // 修复重复声明的问题
  const { t } = useToolsTranslations();

  // 检测屏幕尺寸以适应移动设备
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowClearButton(value.length > 0);
  };

  // 清除搜索内容
  const clearSearch = () => {
    onSearchChange("");
    setShowClearButton(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 计算激活的过滤器数量
  const activeFiltersCount = Object.values(filters).filter(
    (val) => val !== "" && val !== false && val !== undefined
  ).length;

  // 处理刷新按钮触摸效果
  const handleRefreshClick = () => {
    if (!isRefreshing) {
      onRefresh();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeInUp}
      className="flex flex-col gap-3 w-full"
    >
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* 搜索输入框 */}
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            placeholder={t("tools.searchAndFilter.searchPlaceholder")}
            className="pl-10 pr-8 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label={t("tools.searchAndFilter.searchAriaLabel")}
            type="search"
          />
          <AnimatePresence>
            {showClearButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: DURATION.fast }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center"
                onClick={clearSearch}
                aria-label={t("tools.searchAndFilter.clearSearch")}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 操作按钮区域 */}
        <div className="flex items-center gap-2">
          {onFilterChange && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size={isMobile ? "default" : "icon"}
                        className="relative"
                        aria-label={t("tools.searchAndFilter.filters")}
                      >
                        <Filter className="h-4 w-4" />
                        {!isMobile ? null : (
                          <span className="ml-2">
                            {t("tools.searchAndFilter.filters")}
                          </span>
                        )}
                        {activeFiltersCount > 0 && (
                          <Badge
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                            variant="destructive"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{t("tools.searchAndFilter.filters")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent className="min-w-[200px]">
                <DropdownMenuLabel>
                  {t("tools.searchAndFilter.filters")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* 这里可以添加过滤选项 */}
                <DropdownMenuCheckboxItem
                  checked={filters.onlyFavorites === true}
                  onCheckedChange={(checked) => {
                    onFilterChange?.({ ...filters, onlyFavorites: checked });
                  }}
                >
                  {t("tools.searchAndFilter.favorites")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ rotate: isRefreshing ? 0 : 15, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size={isMobile ? "default" : "icon"}
                    onClick={handleRefreshClick}
                    disabled={isRefreshing}
                    aria-label={t("tools.searchAndFilter.refreshTools")}
                    className="active:scale-95 transition-transform"
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {!isMobile ? null : (
                      <span className="ml-2">
                        {t("tools.searchAndFilter.refresh")}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isRefreshing
                    ? t("tools.searchAndFilter.refreshingTools")
                    : t("tools.searchAndFilter.refreshTools")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <Tabs
          value={selectedCategory}
          onValueChange={onCategoryChange}
          className="w-full"
        >
          <TabsList className="min-w-max w-full h-9 p-1">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <TabsTrigger value="all" className="text-xs md:text-sm px-3">
                {t("tools.searchAndFilter.all")}
              </TabsTrigger>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-1 text-xs md:text-sm px-3"
              >
                <Star className="h-3.5 w-3.5" />
                {t("tools.searchAndFilter.favorites")}
              </TabsTrigger>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <TabsTrigger
                value="calculation"
                className="text-xs md:text-sm px-3"
              >
                {t("tools.searchAndFilter.calculation")}
              </TabsTrigger>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <TabsTrigger value="planning" className="text-xs md:text-sm px-3">
                {t("tools.searchAndFilter.planning")}
              </TabsTrigger>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <TabsTrigger value="utility" className="text-xs md:text-sm px-3">
                {t("tools.searchAndFilter.utility")}
              </TabsTrigger>
            </motion.div>
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  );
}
