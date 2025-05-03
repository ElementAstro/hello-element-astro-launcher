import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ANIMATION_DURATION } from "./animation-constants";
import type { ChangeHandler } from "./types";
import { cn } from "@/lib/utils";
import { useMemo, useCallback, useState, useEffect } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: ChangeHandler<number>;
  isLoading?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      if (isLoading || page < 1 || page > totalPages || page === currentPage)
        return;
      onPageChange(page);

      // 滚动到页面顶部 (可选)
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [isLoading, totalPages, currentPage, onPageChange]
  );

  // 使用useMemo优化页码按钮计算
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageButtons = useMemo(() => {
    const buttons = [];
    // 在小屏幕上显示更少的页码按钮
    const maxButtons = isMobile ? 3 : 5;
    const totalShown = Math.min(maxButtons, totalPages);

    let startPage;
    if (totalPages <= maxButtons) {
      startPage = 1;
    } else if (currentPage <= Math.ceil(maxButtons / 2)) {
      startPage = 1;
    } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
      startPage = totalPages - maxButtons + 1;
    } else {
      startPage = currentPage - Math.floor(maxButtons / 2);
    }

    for (let i = 0; i < totalShown; i++) {
      const pageNumber = startPage + i;
      if (pageNumber > 0 && pageNumber <= totalPages) {
        buttons.push(
          <motion.div
            key={pageNumber}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isLoading}
                  className={cn(
                    "w-7 h-7 text-xs",
                    currentPage === pageNumber && "pointer-events-none"
                  )}
                  aria-label={`第 ${pageNumber} 页`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                跳转到第 {pageNumber} 页
              </TooltipContent>
            </Tooltip>
          </motion.div>
        );
      }
    }

    return buttons;
  }, [isMobile, totalPages, currentPage, isLoading, handlePageChange]);

  // 计算当前显示的项目范围
  const rangeInfo = useMemo(() => {
    if (!itemsPerPage || !totalItems) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end} / ${totalItems}`;
  }, [currentPage, itemsPerPage, totalItems]);

  return (
    <div
      className="px-2 py-3 sm:px-4 sm:py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3"
      role="navigation"
      aria-label="分页导航"
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 移动端隐藏首页/尾页按钮，只保留箭头按钮 */}
        <div className="hidden sm:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                aria-label="第一页"
                className="h-7 text-xs px-2"
              >
                <ChevronsLeft className="h-3.5 w-3.5 mr-1" />
                首页
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              跳转到第一页
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              aria-label="上一页"
              className="w-7 h-7"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            上一页
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage} // 当页码改变时触发动画
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: ANIMATION_DURATION.fast }}
            >
              {pageButtons}
            </motion.div>
          </AnimatePresence>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
              aria-label="下一页"
              className="w-7 h-7"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            下一页
          </TooltipContent>
        </Tooltip>

        <div className="hidden sm:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading}
                aria-label="最后一页"
                className="h-7 text-xs px-2"
              >
                <ChevronsRight className="h-3.5 w-3.5 mr-1" />
                末页
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              跳转到最后一页
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center text-center">
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex items-center">
            <div className="h-3 w-3 border-2 border-r-transparent rounded-full animate-spin mr-1.5" />
            <span className="text-xs text-muted-foreground">加载中...</span>
          </div>
        )}

        {/* 显示项目范围信息 */}
        {!isLoading && rangeInfo && (
          <div className="text-xs text-muted-foreground">{rangeInfo}</div>
        )}

        {!isLoading && !rangeInfo && (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {currentPage} / {totalPages} 页
          </div>
        )}
      </div>
    </div>
  );
}
