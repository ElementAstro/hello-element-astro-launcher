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
  const renderPageButtons = () => {
    const buttons = [];
    const totalShown = Math.min(5, totalPages);

    let startPage;
    if (totalPages <= 5) {
      startPage = 1;
    } else if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
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
                  onClick={() => onPageChange(pageNumber)}
                  disabled={isLoading}
                  className={cn(
                    "w-8 h-8",
                    currentPage === pageNumber && "pointer-events-none"
                  )}
                  aria-label={`第 ${pageNumber} 页`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              </TooltipTrigger>
              <TooltipContent>跳转到第 {pageNumber} 页</TooltipContent>
            </Tooltip>
          </motion.div>
        );
      }
    }

    return buttons;
  };

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || page > totalPages || page === currentPage)
      return;
    onPageChange(page);
  };

  // 计算当前显示的项目范围
  const calculateRange = () => {
    if (!itemsPerPage || !totalItems) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end} / ${totalItems}`;
  };

  // 项目范围显示
  const rangeInfo = calculateRange();

  return (
    <div
      className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
      role="navigation"
      aria-label="分页导航"
    >
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isLoading}
              aria-label="第一页"
            >
              <ChevronsLeft className="h-4 w-4 mr-2" />
              首页
            </Button>
          </TooltipTrigger>
          <TooltipContent>跳转到第一页</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              aria-label="上一页"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>上一页</TooltipContent>
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
              {renderPageButtons()}
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
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>下一页</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              aria-label="最后一页"
            >
              <ChevronsRight className="h-4 w-4 mr-2" />
              末页
            </Button>
          </TooltipTrigger>
          <TooltipContent>跳转到最后一页</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex items-center">
            <div className="h-3 w-3 border-2 border-r-transparent rounded-full animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">加载中...</span>
          </div>
        )}

        {/* 显示项目范围信息 */}
        {rangeInfo && (
          <div className="text-sm text-muted-foreground">显示 {rangeInfo}</div>
        )}

        {!rangeInfo && (
          <div className="text-sm text-muted-foreground">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
        )}
      </div>
    </div>
  );
}
