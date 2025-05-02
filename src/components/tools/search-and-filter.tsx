import { Search, RefreshCw, Star, Filter, X, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { VARIANTS, DURATION } from "./animation-constants";

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
  };

  // 计算激活的过滤器数量
  const activeFiltersCount = Object.values(filters).filter(
    (val) => val !== "" && val !== false && val !== undefined
  ).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeInUp}
      className="flex flex-col md:flex-row gap-4 items-center justify-between"
    >
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索工具..."
          className="pl-10 pr-8"
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="搜索工具"
        />
        <AnimatePresence>
          {showClearButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: DURATION.fast }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
                aria-label="清除搜索"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-between md:justify-end">
        <Tabs
          value={selectedCategory}
          onValueChange={onCategoryChange}
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TabsTrigger value="all">全部</TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-1"
              >
                <Star className="h-3.5 w-3.5" />
                收藏
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TabsTrigger value="calculation">计算</TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TabsTrigger value="planning">规划</TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TabsTrigger value="utility">工具</TabsTrigger>
            </motion.div>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {onFilterChange && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                    aria-label="高级过滤选项"
                    onClick={() => {
                      // 在这里实现高级过滤选项弹窗逻辑
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <Badge
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                        variant="destructive"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>高级过滤选项</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                    size="icon"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    aria-label="刷新"
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRefreshing ? "正在刷新..." : "刷新"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
