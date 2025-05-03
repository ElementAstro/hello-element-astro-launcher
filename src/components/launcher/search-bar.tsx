import { Search, X, RefreshCw, EyeOff, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ChangeHandler } from "./types";
import { useState, useRef, useEffect } from "react";
import { searchBarVariants, ANIMATION_DURATION } from "./animation-constants";

interface SearchBarProps {
  searchQuery: string;
  searchVisible: boolean;
  onSearchChange: ChangeHandler<string>;
  onSearchVisibilityToggle: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function SearchBar({
  searchQuery,
  searchVisible,
  onSearchChange,
  onSearchVisibilityToggle,
  onRefresh,
  isRefreshing = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  // 当搜索栏变为可见时，聚焦搜索输入框
  useEffect(() => {
    if (searchVisible && inputRef.current) {
      // 使用requestAnimationFrame来确保DOM更新后再聚焦
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [searchVisible]);

  const renderSearchBar = () => (
    <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4">
      <div
        className={cn(
          "relative flex-1 transition-all",
          isFocused && "ring-2 ring-primary/20 rounded-md"
        )}
      >
        <Input
          id="search-input"
          ref={inputRef}
          placeholder="搜索软件..."
          className="pl-8 pr-8 h-9 py-1"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label="搜索软件"
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: ANIMATION_DURATION.fast }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={handleClear}
                aria-label="清除搜索"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn(
                  "h-3.5 w-3.5 mr-1.5",
                  isRefreshing && "animate-spin"
                )}
              />
              <span className="text-xs">
                {isRefreshing ? "刷新中" : "刷新"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>刷新软件列表</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={onSearchVisibilityToggle}
            >
              {searchVisible ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">隐藏</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">搜索</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {searchVisible ? "隐藏搜索栏" : "显示搜索栏"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {searchVisible && (
        <motion.div
          className="p-2 sm:p-3 border-b"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {renderSearchBar()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
