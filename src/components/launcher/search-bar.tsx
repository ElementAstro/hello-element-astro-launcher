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
      setTimeout(() => {
        inputRef.current?.focus();
      }, ANIMATION_DURATION.normal * 1000);
    }
  }, [searchVisible]);

  const renderSearchBar = () => (
    <div className="flex flex-col md:flex-row gap-4">
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
          className="pl-10 pr-10 py-2"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label="搜索软件"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                className="h-6 w-6"
                onClick={handleClear}
                aria-label="清除搜索"
              >
                <X className="h-4 w-4" />
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
              className="flex-1 md:flex-none"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "刷新中..." : "刷新"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>刷新软件列表</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={onSearchVisibilityToggle}
            >
              {searchVisible ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  隐藏搜索
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  显示搜索
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
          className="p-4 border-b"
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
