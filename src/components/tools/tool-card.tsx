import {
  Star,
  MoreHorizontal,
  Edit,
  History,
  Copy,
  Trash2,
  Play,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Tool } from "@/types/tool";
import { getCategoryIcon } from "./utils";
import { VARIANTS, EASE } from "./animation-constants";
import { useToolsTranslations } from "./i18n-provider";

interface ToolCardProps {
  tool: Tool;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  index?: number;
}

export function ToolCard({
  tool,
  onRun,
  onEdit,
  onDelete,
  onToggleFavorite,
  index = 0,
}: ToolCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  // 使用 useCallback 优化事件处理
  const handleRun = useCallback(async () => {
    try {
      setIsRunning(true);
      setError(null);
      await onRun();
    } catch (err) {
      setError(typeof err === "string" ? err : "运行工具失败");
    } finally {
      setIsRunning(false);
    }
  }, [onRun]);

  // 处理触摸事件的特定回调
  const handleTouchStart = useCallback(() => {
    setIsPressing(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPressing(false);
  }, []);
  const { t } = useToolsTranslations();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.listItem}
      custom={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full"
      style={{ touchAction: "manipulation" }}
    >
      <Card
        className={`h-full transition-all duration-300 ${
          isHovering || isPressing ? "shadow-md bg-card/90" : "bg-card/70"
        } border ${isPressing ? "border-primary/50" : ""}`}
      >
        <CardHeader className="pb-2 space-y-0">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ rotate: -5, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: EASE.bounce }}
                  className="bg-secondary/30 p-1.5 rounded-md"
                >
                  {getCategoryIcon(tool.category)}
                </motion.div>
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg line-clamp-1">
                  {tool.name}
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2 text-xs sm:text-sm">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                    aria-label={
                      tool.favorite
                        ? t("toolCard.removeFromFavorites")
                        : t("toolCard.addToFavorites")
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={tool.favorite ? { scale: [1, 1.2, 1] } : {}}
                      transition={{
                        duration: tool.favorite ? 0.3 : 0.1,
                        ease: EASE.bounce,
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          tool.favorite ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                  {tool.favorite
                    ? t("toolCard.removeFromFavorites")
                    : t("toolCard.addToFavorites")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            {tool.lastUsed ? (
              <>
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  {t("toolCard.lastUsed")}:{" "}
                  {format(parseISO(tool.lastUsed), "yyyy-MM-dd")}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>{t("toolCard.neverUsed")}</span>
              </>
            )}
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center text-xs sm:text-sm text-red-500"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="工具选项"
                      className="h-8 w-8 rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start">
                  <p>更多选项</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="start" className="w-48">
              {" "}
              <DropdownMenuItem
                onClick={onEdit}
                className="flex items-center cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>{t("toolCard.edit")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                className="flex items-center cursor-pointer"
              >
                <History className="h-4 w-4 mr-2" />
                <span>{t("toolCard.viewHistory")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                className="flex items-center cursor-pointer"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span>{t("toolCard.duplicate")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmed = window.confirm(
                    `${t("toolCard.confirmDelete")} "${tool.name}"？`
                  );
                  if (confirmed) onDelete();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>删除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleRun}
            disabled={isRunning}
            size="sm"
            className={`relative overflow-hidden transition-all ${
              isRunning ? "bg-primary/90" : ""
            }`}
          >
            {isRunning ? (
              <>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                  initial="initial"
                  animate="animate"
                  variants={VARIANTS.progressBar}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                </motion.div>{" "}
                <span className="text-xs sm:text-sm">
                  {t("toolCard.run")}中...
                </span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs sm:text-sm">{t("toolCard.run")}</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
