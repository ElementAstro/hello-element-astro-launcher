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

import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslations } from "@/components/i18n";

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
  const { t } = useTranslations();

  const handlePageChange = useCallback(
    (page: number) => {
      if (isLoading || page < 1 || page > totalPages || page === currentPage)
        return;
      onPageChange(page);
    },
    [isLoading, totalPages, currentPage, onPageChange]
  );

  // 使用useMemo优化页码按钮计算
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  // 检测屏幕宽度变化以调整移动模式
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 生成分页按钮
  const pageButtons = useMemo(() => {
    const buttons = [];
    const maxVisibleButtons = isMobile ? 3 : 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisibleButtons) {
      const halfVisible = Math.floor(maxVisibleButtons / 2);

      if (currentPage <= halfVisible + 1) {
        // 靠近起始页
        endPage = maxVisibleButtons;
      } else if (currentPage >= totalPages - halfVisible) {
        // 靠近末页
        startPage = totalPages - maxVisibleButtons + 1;
      } else {
        // 在中间
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // 生成页码按钮
    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
      if (pageNumber < 1 || pageNumber > totalPages) continue;

      // 为当前页使用不同的样式
      const isActive = currentPage === pageNumber;
      if (isActive) {
        buttons.push(
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
          >
            <Button
              variant="default"
              size="sm"
              disabled
              className="h-6 w-6 text-[11px] px-0"
              aria-label={t("launcher.pagination.currentPage", {
                params: { page: pageNumber },
                defaultValue: `当前页 ${pageNumber}`,
              })}
              aria-current="page"
            >
              {pageNumber}
            </Button>
          </motion.div>
        );
      } else {
        buttons.push(
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageNumber)}
              disabled={isLoading}
              className="h-6 w-6 text-[11px] px-0"
              aria-label={t("launcher.pagination.goToPage", {
                params: { page: pageNumber },
                defaultValue: `跳转到第 ${pageNumber} 页`,
              })}
            >
              {pageNumber}
            </Button>
          </motion.div>
        );
      }
    }

    return buttons;
  }, [isMobile, totalPages, currentPage, isLoading, handlePageChange, t]);

  // 计算当前显示的项目范围
  const rangeInfo = useMemo(() => {
    if (!itemsPerPage || !totalItems) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end} / ${totalItems}`;
  }, [currentPage, itemsPerPage, totalItems]);

  return (
    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 px-1">
      <div className="flex items-center gap-1">
        <div className="hidden xs:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                aria-label={t("launcher.pagination.firstPage", {
                  defaultValue: "首页",
                })}
                className="h-6 text-[11px] px-1"
              >
                <ChevronsLeft className="h-3 w-3 mr-0.5" />
                {t("launcher.pagination.first", { defaultValue: "首页" })}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[11px]">
              {t("launcher.pagination.goToFirstPage", {
                defaultValue: "跳转到第一页",
              })}
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              aria-label={t("launcher.pagination.previousPage", {
                defaultValue: "上一页",
              })}
              className="h-6 text-[11px] px-1.5"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="hidden sm:inline ml-0.5">
                {t("launcher.pagination.previous", { defaultValue: "上一页" })}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[11px]">
            {t("launcher.pagination.goToPreviousPage", {
              defaultValue: "跳转到上一页",
            })}
          </TooltipContent>
        </Tooltip>

        <div className="flex gap-0.5">
          <AnimatePresence mode="popLayout">{pageButtons}</AnimatePresence>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              aria-label={t("launcher.pagination.nextPage", {
                defaultValue: "下一页",
              })}
              className="h-6 text-[11px] px-1.5"
            >
              <span className="hidden sm:inline mr-0.5">
                {t("launcher.pagination.next", { defaultValue: "下一页" })}
              </span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[11px]">
            {t("launcher.pagination.goToNextPage", {
              defaultValue: "跳转到下一页",
            })}
          </TooltipContent>
        </Tooltip>

        <div className="hidden xs:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading}
                aria-label={t("launcher.pagination.lastPage", {
                  defaultValue: "末页",
                })}
                className="h-6 text-[11px] px-1.5"
              >
                {t("launcher.pagination.last", { defaultValue: "末页" })}
                <ChevronsRight className="h-3 w-3 ml-0.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[11px]">
              {t("launcher.pagination.goToLastPage", {
                defaultValue: "跳转到最后一页",
              })}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {rangeInfo && (
        <div className="text-[11px] text-muted-foreground">
          {t("launcher.pagination.showing", {
            params: { range: rangeInfo },
            defaultValue: `显示 ${rangeInfo}`,
          })}
        </div>
      )}
    </div>
  );
}
