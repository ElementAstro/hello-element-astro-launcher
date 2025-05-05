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
  onSearchResults
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [debouncedSearchQueryValue] = useDebounce(searchQuery, 300); // Get the debounced value directly
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 从本地存储加载搜索历史
  useEffect(() => {
    try {
      const history = localStorage.getItem('search-history');
      if (history) {
        setSearchHistory(JSON.parse(history).slice(0, 5)); // 最多显示5条历史记录
      }
    } catch (error) {
      console.error("Failed to load search history", error);
    }
  }, []);

  // 保存搜索历史到本地存储
  const saveSearchToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, 5);
      
      setSearchHistory(updatedHistory);
      localStorage.setItem('search-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save search history", error);
    }
  }, [searchHistory]);
  
  // 当搜索查询变化时执行搜索
  useEffect(() => {
    // Use the debounced value directly
    if (!debouncedSearchQueryValue || !searchVisible) return;
    
    const performSearch = async () => {
      try {
        setIsSearching(true);
        // Pass the debounced string value
        const results = await launcherApi.searchSoftware(debouncedSearchQueryValue);
        if (onSearchResults) {
          onSearchResults(results);
        }
      } catch (error) {
        console.error("搜索软件失败:", error);
      } finally {
        setIsSearching(false);
        // 当用户完成搜索时保存到历史记录
        // Use the debounced string value for checks and saving
        if (debouncedSearchQueryValue.trim().length >= 2) {
          saveSearchToHistory(debouncedSearchQueryValue);
        }
      }
    };
    
    performSearch();
  // Depend on the debounced value
  }, [debouncedSearchQueryValue, searchVisible, onSearchResults, saveSearchToHistory]);
  
  // 当搜索栏可见性变化时，聚焦搜索输入框
  useEffect(() => {
    if (searchVisible && inputRef.current) {
      // 使用短暂延迟确保DOM已更新
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchVisible]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onSearchChange('');
      onSearchVisibilityToggle();
    }
  };
  
  const handleHistoryItemClick = (historyItem: string) => {
    onSearchChange(historyItem);
    setShowHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const clearSearchQuery = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {searchVisible ? (
        <motion.div
          key="search-input"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: ANIMATION_DURATION.fast }}
          className="flex-1 relative flex items-center"
        >
          <div className="relative w-full flex items-center">
            <Search className={cn(
              "absolute left-3 h-4 w-4 transition-colors",
              isSearching ? "text-primary animate-pulse" : "text-muted-foreground"
            )} />
            
            <div className="w-full relative">
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onKeyDown={handleKeyDown}
                placeholder="搜索软件..."
                className={cn(
                  "pl-10 pr-16 h-10 w-full bg-background border-muted shadow-sm transition-all",
                  isFocused && "border-primary ring-1 ring-primary"
                )}
              />

              <AnimatePresence>
                {searchHistory.length > 0 && isFocused && (
                  <Popover open={showHistory} onOpenChange={setShowHistory}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-muted"
                        onClick={() => setShowHistory(true)}
                      >
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-1" align="end">
                      <div className="flex flex-col space-y-0.5">
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          最近搜索
                        </div>
                        {searchHistory.map((historyItem, index) => (
                          <button
                            key={`${historyItem}-${index}`}
                            onClick={() => handleHistoryItemClick(historyItem)}
                            className="flex items-center px-2 py-1.5 hover:bg-muted rounded text-sm text-left"
                          >
                            <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            {historyItem}
                          </button>
                        ))}
                        <Button 
                          variant="ghost" 
                          className="text-xs justify-start text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setSearchHistory([]);
                            localStorage.removeItem('search-history');
                            setShowHistory(false);
                          }}
                        >
                          清除搜索历史
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </AnimatePresence>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted"
                  onClick={clearSearchQuery}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearchVisibilityToggle}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">关闭搜索</TooltipContent>
          </Tooltip>
        </motion.div>
      ) : (
        <motion.div
          key="search-button"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: ANIMATION_DURATION.fast }}
          className="flex-row flex space-x-2"
        >
          <div className="flex-1 flex items-center justify-end space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSearchVisibilityToggle}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">搜索软件</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isRefreshing && "animate-spin text-primary"
                  )}
                  disabled={isRefreshing}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isRefreshing ? "正在刷新..." : "刷新列表"}
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
