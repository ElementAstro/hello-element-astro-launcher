import {
  Plus,
  Calculator,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Tool } from "@/types/tool";
import { ToolCard } from "./tool-card";
import { VARIANTS } from "./animation-constants";
import { useTranslations } from "@/components/i18n";

interface ToolListProps {
  tools: Tool[];
  isLoading: boolean;
  searchQuery: string;
  onRunTool: (tool: Tool) => void;
  onDeleteTool: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  error?: string;
  onRetry?: () => void;
}

export function ToolList({
  tools,
  isLoading,
  searchQuery,
  onRunTool,
  onDeleteTool,
  onToggleFavorite,
  error,
  onRetry,
}: ToolListProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(3); // 默认列数
  const { t } = useTranslations();

  // 根据屏幕宽度调整布局列数
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1); // 小屏幕设备
      } else if (window.innerWidth < 1024) {
        setColumns(2); // 平板设备
      } else {
        setColumns(3); // 桌面设备
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await onDeleteTool(id);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // 骨架屏加载状态
  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeIn}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <motion.div key={i} variants={VARIANTS.listItem} custom={i}>
            <Card className="h-full bg-card/50 border shadow-sm">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2 items-start">
                    <Skeleton className="h-8 w-8 rounded-md mt-1" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32 sm:w-36" />
                      <Skeleton className="h-3 w-48 sm:w-56" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeIn}
        className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4"
      >        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium">{t("toolList.loadingError")}</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md text-sm md:text-base">
          {error}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="active:scale-95 transition-transform"
            aria-label={t("toolList.retry")}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            {t("toolList.retry")}
          </Button>
        )}
      </motion.div>
    );
  }

  // 空状态
  if (tools.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeInUp}
        className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4"
      >
        <motion.div
          className="rounded-full bg-muted p-3 mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}        >
          <Calculator className="h-6 w-6 text-muted-foreground" />
        </motion.div>
        <h3 className="text-lg font-medium">{t("toolList.noToolsFound")}</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md text-sm md:text-base">
          {searchQuery
            ? t("toolList.emptySearchResult")
            : t("toolList.noToolsCreated")}
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push("/tools/create")}
            className="active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("toolList.createTool")}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // 工具列表
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeIn}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
    >
      <AnimatePresence mode="popLayout">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            layout
            layoutId={tool.id}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            className="focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:rounded-lg"
          >
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="h-full">
                    <ToolCard
                      tool={tool}
                      index={index}
                      onRun={() => onRunTool(tool)}
                      onEdit={() => router.push(`/tools/edit/${tool.id}`)}
                      onDelete={() => handleDelete(tool.id)}
                      onToggleFavorite={() => onToggleFavorite(tool.id)}
                    />
                  </div>
                </TooltipTrigger>
                {deletingIds.has(tool.id) && (                  <TooltipContent side="top">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>{t("toolCard.delete")}中...</span>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
