import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Info,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DownloadItem as DownloadItemType } from "@/types";
import {
  progressVariants,
  iconVariants,
  slideOutVariants,
  DURATION,
} from "./animation-variants";
import {
  getStatusIcon,
  getStatusText,
  getStatusClass,
  formatTimeRemaining,
  formatSpeed,
} from "./download-status-utils";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

interface DownloadItemProps {
  download: DownloadItemType;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
  onShowDetails?: () => void;
}

export function DownloadItem({
  download,
  onCancel,
  onPause,
  onResume,
  onRetry,
  onRemove,
  onShowDetails,
}: DownloadItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations(); // 使用 i18n hook

  // Handle error message display
  const errorMessage = t("download.item.error", {
    defaultValue: "下载过程中发生错误",
  });
  // Handle download speed formatting
  const formattedSpeed = download.speed
    ? typeof download.speed === "number"
      ? formatSpeed(download.speed, t)
      : download.speed
    : "";
  // Handle remaining time formatting
  const formattedTimeRemaining = download.estimatedTimeRemaining
    ? typeof download.estimatedTimeRemaining === "number"
      ? formatTimeRemaining(download.estimatedTimeRemaining, t)
      : download.estimatedTimeRemaining
    : "";

  // Handle remove operation
  const handleRemove = () => {
    if (onRemove) {
      setIsExiting(true);
      // Allow enough time for the animation to execute
      setTimeout(() => {
        onRemove();
      }, DURATION.normal * 1000);
    }
  };

  // Get progress bar animation type
  const getProgressVariant = () => {
    if (download.status === "paused") return "paused";
    if (download.status === "error") return "error";
    if (
      download.status === "waiting" ||
      download.status === "verification" ||
      download.status === "processing"
    ) {
      return "indeterminate";
    }
    return "animate";
  };

  // Is it an active download status?
  const isActiveDownload = [
    "downloading",
    "paused",
    "waiting",
    "verification",
    "processing",
  ].includes(download.status);

  // Is it a cancellable status?
  const isCancellable = ["downloading", "paused", "waiting"].includes(
    download.status
  );

  // Get the appropriate action button based on download status
  const getActionButton = () => {
    if (download.status === "error") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-1"
              aria-label={t("download.item.retryAriaLabel", {
                defaultValue: "重试下载",
              })}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t("download.item.retry", { defaultValue: "重试" })}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t("download.item.retry", { defaultValue: "重试" })}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (download.status === "paused" && onResume) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onResume}
              className="flex items-center gap-1"
              aria-label={t("download.item.resumeAriaLabel", {
                defaultValue: "继续下载",
              })}
            >
              <Play className="h-3.5 w-3.5" />
              <span>{t("download.item.resume", { defaultValue: "继续" })}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t("download.item.resume", { defaultValue: "继续" })}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (download.status === "downloading" && onPause) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="flex items-center gap-1"
              aria-label={t("download.item.pauseAriaLabel", {
                defaultValue: "暂停下载",
              })}
            >
              <Pause className="h-3.5 w-3.5" />
              <span>{t("download.item.pause", { defaultValue: "暂停" })}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t("download.item.pause", { defaultValue: "暂停" })}
          </TooltipContent>
        </Tooltip>
      );
    }

    return null;
  };

  return (
    <AnimatePresence mode="wait">
      {!isExiting ? (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          variants={slideOutVariants}
          className="relative"
          layout
        >
          <Card
            className={cn(
              "overflow-hidden",
              download.status === "error" &&
                "border-red-200 dark:border-red-800"
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="mr-4 relative">
                  <Image
                    src={download.icon || "/placeholder.svg"}
                    alt={download.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  {download.status === "completed" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{download.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Version {download.version} • {download.size}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                      >
                        {" "}
                        <Badge
                          variant="outline"
                          className={cn(
                            "flex items-center gap-1",
                            getStatusClass(download.status)
                          )}
                        >
                          {getStatusIcon(download.status)}
                          {getStatusText(download.status, t)}
                        </Badge>
                      </motion.div>

                      {isCancellable && onCancel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={onCancel}
                              aria-label={t("download.item.cancelAriaLabel", {
                                defaultValue: "取消下载",
                              })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("download.item.cancel", {
                              defaultValue: "取消",
                            })}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {!isCancellable && onRemove && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowRemoveDialog(true)}
                              aria-label={t("download.item.removeAriaLabel", {
                                defaultValue: "从列表中移除",
                              })}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("download.item.remove", {
                              defaultValue: "删除",
                            })}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {isActiveDownload && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        {" "}
                        <span>
                          {download.progress !== undefined
                            ? `${download.progress.toFixed(0)}%`
                            : t("download.item.waiting", {
                                defaultValue: "等待中",
                              })}
                        </span>
                        {download.status === "downloading" &&
                          formattedTimeRemaining && (
                            <span>
                              {formattedTimeRemaining}{" "}
                              {t("download.item.timeRemaining", {
                                defaultValue: "剩余",
                              })}
                            </span>
                          )}
                      </div>
                      <div
                        ref={progressBarRef}
                        className="relative h-2 bg-muted rounded-full overflow-hidden"
                      >
                        <motion.div
                          custom={download.progress || 0}
                          variants={progressVariants}
                          initial="start"
                          animate={getProgressVariant()}
                          className="absolute h-full rounded-full bg-primary"
                          style={{ width: `${download.progress || 0}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {formattedSpeed && (
                          <span className="text-xs text-muted-foreground">
                            {formattedSpeed}
                          </span>
                        )}

                        <div className="flex gap-2">
                          {getActionButton()}

                          {onShowDetails && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={onShowDetails}
                                  className="h-8 w-8 p-0"
                                  aria-label="Show details"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("download.item.details", {
                                  defaultValue: "查看详情",
                                })}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error status display */}
                  {download.status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: DURATION.normal }}
                      className="mt-2 bg-red-50 dark:bg-red-900/20 rounded-md p-2 text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Completed status additional info */}
                  {download.status === "completed" && onShowDetails && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex justify-end"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowDetails}
                        className="text-xs flex items-center gap-1 h-7"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>
                          {t("download.item.details", {
                            defaultValue: "查看详情",
                          })}
                        </span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remove confirmation dialog */}
          <AlertDialog
            open={showRemoveDialog}
            onOpenChange={setShowRemoveDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("download.item.removeConfirmTitle", {
                    defaultValue: "删除下载记录？",
                  })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("download.item.removeConfirmDescription", {
                    params: { downloadName: download.name },
                    defaultValue: `您确定要删除"${download.name}"的下载记录吗？此操作不会删除已下载的文件。`,
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("common.cancel", { defaultValue: "取消" })}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRemove}>
                  {t("download.item.confirmRemove", { defaultValue: "删除" })}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
