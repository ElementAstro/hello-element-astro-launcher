import {
  Plus,
  Calculator,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div key={i} variants={VARIANTS.listItem} custom={i}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeIn}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium">加载工具时出错</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            重试
          </Button>
        )}
      </motion.div>
    );
  }

  if (tools.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={VARIANTS.fadeInUp}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          className="rounded-full bg-muted p-3 mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Calculator className="h-6 w-6 text-muted-foreground" />
        </motion.div>
        <h3 className="text-lg font-medium">未找到工具</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md">
          {searchQuery
            ? "没有找到符合搜索条件的工具。尝试使用不同的搜索词。"
            : "您尚未创建任何工具。创建您的第一个工具以帮助进行天文计算。"}
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => router.push("/tools/create")}>
            <Plus className="h-4 w-4 mr-2" />
            创建工具
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeIn}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <AnimatePresence mode="popLayout">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            layout
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
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
                {deletingIds.has(tool.id) && (
                  <TooltipContent>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>正在删除...</span>
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
