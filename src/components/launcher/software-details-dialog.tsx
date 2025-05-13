import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, DownloadIcon, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  dialogVariants,
  progressVariants,
  ANIMATION_DURATION,
} from "./animation-constants";
import type { Software, ActionHandler } from "./types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as launcherApi from "./launcher-api";
import { useTranslations } from "@/components/i18n";

interface SoftwareDetailsDialogProps {
  software: Software | null;
  isOpen: boolean;
  isInstalling: boolean;
  installProgress: number;
  onOpenChange: (open: boolean) => void;
  onAction: ActionHandler;
  error?: string | null;
  onInstallComplete?: (software: Software) => void;
}

export function SoftwareDetailsDialog({
  software,
  isOpen,
  isInstalling,
  installProgress,
  onOpenChange,
  onAction,
  error = null,
  onInstallComplete,
}: SoftwareDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);
  const [activeInstallId, setActiveInstallId] = useState<string | null>(null);
  const [localInstallProgress, setLocalInstallProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLocalInstalling, setIsLocalInstalling] = useState(false);
  const { t } = useTranslations();

  // Fetch latest software details when the dialog opens and if a valid software ID exists
  useEffect(() => {
    if (isOpen && software && !isInstalling) {
      const fetchLatestInfo = async () => {
        try {
          const latestInfo = await launcherApi.getSoftwareDetails(
            software.id.toString()
          );
          // Update software info in the parent component via onAction
          if (JSON.stringify(latestInfo) !== JSON.stringify(software)) {
            onAction({ ...latestInfo, actionType: "update-info" });
          }
        } catch (err) {
          console.error("Failed to fetch software details:", err);
          // No need to set an error, as we still have local software info to display
        }
      };
      fetchLatestInfo();
    }
  }, [isOpen, software, isInstalling, onAction]);

  // Handle installation progress polling
  useEffect(() => {
    if (!isLocalInstalling || !activeInstallId) return;

    const progressInterval = setInterval(async () => {
      try {
        const progress = await launcherApi.getInstallationStatus(
          activeInstallId
        );
        setLocalInstallProgress(progress.progress);

        if (progress.error) {
          setLocalError(progress.error);
          setIsLocalInstalling(false);
          clearInterval(progressInterval);
        }

        if (progress.status === "completed" && progress.progress >= 100) {
          setIsLocalInstalling(false);
          clearInterval(progressInterval);

          // Fetch updated software info after installation completes
          if (software) {
            try {
              const updatedSoftware = await launcherApi.getSoftwareDetails(
                software.id.toString()
              );
              if (onInstallComplete) {
                onInstallComplete(updatedSoftware);
              }
            } catch (err) {
              console.error("Failed to fetch updated software info:", err);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch installation progress:", err);
        setLocalError(
          t("launcher.error.installProgress", {
            defaultValue: "无法获取安装进度信息",
          })
        );
        setIsLocalInstalling(false);
        clearInterval(progressInterval);
      }
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [isLocalInstalling, activeInstallId, software, onInstallComplete, t]);

  if (!software) return null;

  const handleWebsiteClick = () => {
    if (software.website) {
      window.open(software.website, "_blank", "noopener,noreferrer");
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle software actions (install, launch)
  const handleAction = async () => {
    if (isInstalling || isLocalInstalling) return;

    // Prioritize local state
    const currentError = localError || error;
    if (currentError) {
      setLocalError(null); // Clear the error
      return;
    }

    // Launch software
    if (software.actionLabel === "Launch") {
      try {
        const result = await launcherApi.launchSoftware(software.id.toString());
        if (result.success) {
          // Notify parent component that software has launched
          onAction({ ...software, actionType: "launched" });
        } else {
          setLocalError("Failed to launch software");
        }
      } catch (err) {
        console.error("Failed to launch software:", err);
        setLocalError("An error occurred while launching the software");
      }
    }
    // Install software
    else if (software.actionLabel === "Install") {
      try {
        setIsLocalInstalling(true);
        const result = await launcherApi.installSoftware(
          software.id.toString()
        );
        if (result.installationId) {
          setActiveInstallId(result.installationId);
          // Notify parent component that installation has started
          onAction({ ...software, actionType: "installing" });
        } else {
          setLocalError("Failed to install software");
          setIsLocalInstalling(false);
        }
      } catch (err) {
        console.error("Failed to install software:", err);
        setLocalError("An error occurred while installing the software");
        setIsLocalInstalling(false);
      }
    }
  };

  const isActionDisabled =
    isInstalling || isLocalInstalling || Boolean(error || localError);

  // Use local state or parent component state
  const displayedInstallProgress = isLocalInstalling
    ? localInstallProgress
    : installProgress;
  const displayedIsInstalling = isInstalling || isLocalInstalling;
  const displayedError = localError || error;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => {
          if (displayedIsInstalling) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (displayedIsInstalling) {
            e.preventDefault();
          }
        }}
      >
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={
                    imageError
                      ? "/placeholder.svg"
                      : software.icon || "/placeholder.svg"
                  }
                  alt={software.name}
                  width={40}
                  height={40}
                  className="rounded"
                  onError={handleImageError}
                />
              </div>
              <DialogTitle>{software.name}</DialogTitle>
            </div>
            <DialogDescription>{software.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <AnimatePresence mode="wait">
              {displayedError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: ANIMATION_DURATION.normal }}
                >
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {t("launcher.details.error", { defaultValue: "错误" })}
                    </AlertTitle>
                    <AlertDescription>{displayedError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">
                {t("launcher.details.version", { defaultValue: "版本" })}:
              </div>
              <div>{software.version}</div>

              <div className="text-muted-foreground">
                {t("launcher.details.size", { defaultValue: "大小" })}:
              </div>
              <div>{software.size}</div>

              <div className="text-muted-foreground">
                {t("launcher.details.developer", { defaultValue: "开发者" })}:
              </div>
              <div>{software.developer}</div>

              <div className="text-muted-foreground">
                {t("launcher.details.downloads", { defaultValue: "下载次数" })}:
              </div>
              <div>{software.downloads.toLocaleString()}</div>

              <div className="text-muted-foreground">
                {t("launcher.details.updated", { defaultValue: "更新日期" })}:
              </div>
              <div>{new Date(software.lastUpdated).toLocaleDateString()}</div>

              <div className="text-muted-foreground">
                {t("launcher.details.status", { defaultValue: "状态" })}:
              </div>
              <div>
                {software.installed ? (
                  <Badge variant="default">
                    {t("launcher.details.installed", {
                      defaultValue: "已安装",
                    })}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {t("launcher.details.notInstalled", {
                      defaultValue: "未安装",
                    })}
                  </Badge>
                )}
              </div>

              {software.dependencies && software.dependencies.length > 0 && (
                <>
                  <div className="text-muted-foreground">
                    {t("launcher.details.dependencies", {
                      defaultValue: "依赖项",
                    })}
                    :
                  </div>
                  <div>{software.dependencies.join(", ")}</div>
                </>
              )}

              {software.tags && software.tags.length > 0 && (
                <>
                  <div className="text-muted-foreground">
                    {t("launcher.details.tags", { defaultValue: "标签" })}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {software.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <AnimatePresence>
              {displayedIsInstalling && software.actionLabel === "Install" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: ANIMATION_DURATION.normal }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>
                      {t("launcher.details.installing", {
                        defaultValue: "正在安装...",
                      })}
                    </span>
                    <span>{displayedInstallProgress}%</span>
                  </div>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    custom={displayedInstallProgress}
                    variants={progressVariants}
                  >
                    <Progress
                      value={displayedInstallProgress}
                      className="h-2"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {software.releaseNotes && (
              <div className="space-y-2">
                <Label htmlFor="release-notes">
                  {t("launcher.details.releaseNotes", {
                    defaultValue: "版本说明",
                  })}
                </Label>
                <div
                  id="release-notes"
                  className="text-sm p-2 bg-muted rounded-md max-h-24 overflow-y-auto"
                  tabIndex={0}
                  role="region"
                  aria-label={t("launcher.details.releaseNotes", {
                    defaultValue: "版本说明",
                  })}
                >
                  {software.releaseNotes}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {software.website && (
              <Button
                variant="outline"
                className="mr-auto"
                onClick={handleWebsiteClick}
                disabled={displayedIsInstalling}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("launcher.details.website", { defaultValue: "访问网站" })}
              </Button>
            )}

            <Button
              onClick={handleAction}
              disabled={isActionDisabled}
              className={cn(
                displayedIsInstalling && "opacity-80 cursor-not-allowed"
              )}
            >
              {displayedIsInstalling ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-r-transparent rounded-full animate-spin"></div>
                  {t("launcher.details.installing", {
                    defaultValue: "正在安装...",
                  })}
                </>
              ) : software.actionLabel === "Install" ? (
                <>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  {t("launcher.details.install", { defaultValue: "安装" })}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {t("launcher.details.launch", { defaultValue: "启动" })}
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
