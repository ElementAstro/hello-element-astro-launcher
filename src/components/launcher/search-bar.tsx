import { Search, X, RefreshCw, Clock } from "lucide-react"; // Removed unused EyeOff, Eye, ChevronDown
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ChangeHandler } from "./types";
import { useState, useRef, useEffect, useCallback } from "react";
import { searchBarVariants, ANIMATION_DURATION } from "./animation-constants";
import * as launcherApi from "./launcher-api";
import type { GlobalSoftware } from "./launcher-api"; // Import the specific type
import { useDebounce } from "use-debounce";
import { useTranslations } from "@/components/i18n";

interface SearchBarProps {
  searchQuery: string;
  searchVisible: boolean;
  onSearchChange: ChangeHandler<string>;
  onSearchVisibilityToggle: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onSearchResults?: (results: GlobalSoftware[]) => void; // Use specific type instead of any[]
}

export function SearchBar({
  searchQuery,
  searchVisible,
  onSearchChange,
  onSearchVisibilityToggle,
  onRefresh,
  isRefreshing = false,
  onSearchResults,
}: SearchBarProps) {
  // ...保持现有状态变量
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [debouncedSearchQueryValue] = useDebounce(searchQuery, 300); 
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslations();
  
  // ...保持所有现有逻辑

  // 从本地存储加载搜索历史
  useEffect(() => {
    try {
      const history = localStorage.getItem("search-history");
      if (history) {
        setSearchHistory(JSON.parse(history).slice(0, 5)); // 最多显示5条历史记录
      }
    } catch (error) {
      console.error("Failed to load search history", error);
    }
  }, []);
  
  // ...其他useEffect和函数

  // 保存搜索历史到本地存储
  const saveSearchToHistory = useCallback(
    (query: string) => {
      if (!query.trim() || query.length < 2) return;

      try {
        const updatedHistory = [
          query,
          ...searchHistory.filter((item) => item !== query),
        ].slice(0, 5);

        setSearchHistory(updatedHistory);
        localStorage.setItem("search-history", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save search history", error);
      }
    },
    [searchHistory]
  );

  // 当搜索查询变化时执行搜索
  useEffect(() => {
    // Use the debounced value directly
    if (!debouncedSearchQueryValue || !searchVisible) return;

    const performSearch = async () => {
      try {
        setIsSearching(true);
        // Pass the debounced string value
        const results = await launcherApi.searchSoftware(
          debouncedSearchQueryValue
        );
        if (onSearchResults) {
          onSearchResults(results);
        }
      } catch (error) {
        console.error("搜索软件失败:", error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQueryValue, searchVisible, onSearchResults]);

  // 当搜索框可见时，自动聚焦
  useEffect(() => {
    if (searchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchVisible]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 按Escape关闭搜索
      if (e.key === "Escape") {
        onSearchVisibilityToggle();
      }
      // 按Enter记录搜索历史
      if (e.key === "Enter" && searchQuery.trim()) {
        saveSearchToHistory(searchQuery);
      }
    },
    [searchQuery, onSearchVisibilityToggle, saveSearchToHistory]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onSearchChange]);

  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem("search-history");
  }, []);

  return (
    <AnimatePresence initial={false} mode="wait">
      {searchVisible ? (        <motion.div
          key="search-input"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: ANIMATION_DURATION.fast }}
          className="flex items-center gap-0.5 px-0.5 py-0.5 border-b"
        ><div className="relative flex-1">
            <div className="flex items-center">
              <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("launcher.search.placeholder", {
                  defaultValue: "搜索软件...",
                })}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowHistory(false), 100);
                }}
                onClick={() => searchHistory.length > 0 && setShowHistory(true)}
                className={cn(
                  "h-7 pl-7 pr-7 text-sm",
                  isSearching && "opacity-70",
                  isFocused && "ring-1 ring-ring"
                )}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 h-5 w-5 p-0 hover:bg-accent"
                  onClick={handleClearSearch}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
            {searchHistory.length > 0 && showHistory && (
              <Popover open={true} onOpenChange={setShowHistory}>
                <PopoverTrigger asChild>
                  <div />
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100%-2rem)] p-1"
                  align="start"
                  sideOffset={5}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {t("launcher.search.recentSearches", {
                        defaultValue: "最近搜索",
                      })}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs hover:bg-accent"
                      onClick={handleClearHistory}
                    >
                      {t("launcher.search.clearHistory", {
                        defaultValue: "清除历史记录",
                      })}
                    </Button>
                  </div>
                  <div className="space-y-0.5">
                    {searchHistory.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-7"
                        onClick={() => {
                          onSearchChange(item);
                          setShowHistory(false);
                          saveSearchToHistory(item);
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearchVisibilityToggle}
            className="ml-1 px-1.5 border h-8 text-xs"
          >
            {t("launcher.search.cancel", { defaultValue: "取消" })}
          </Button>
        </motion.div>
      ) : (
        <motion.div          key="search-button"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: ANIMATION_DURATION.fast }}
          className="flex items-center gap-0.5 px-0.5 py-0.5 border-b"
        >
          <Tooltip>
            <TooltipTrigger asChild>              <Button
                variant="outline"
                size="icon"
                onClick={onSearchVisibilityToggle}
                className="h-7 w-7"
              >
                <Search className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {t("launcher.search.searchSoftware", {
                defaultValue: "搜索软件",
              })}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
                className={cn(
                  "h-7 w-7",
                  isRefreshing && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw
                  className={cn("h-3 w-3", isRefreshing && "animate-spin")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {t("launcher.search.refreshSoftware", {
                defaultValue: "刷新软件列表",
              })}
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
