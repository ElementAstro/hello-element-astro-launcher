import Image from "next/image";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { itemVariants } from "./animation-constants";
import type { Software, ViewMode, ActionHandler } from "./types";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n";

interface SoftwareItemProps {
  software: Software;
  viewMode: ViewMode;
  onAction: ActionHandler;
  onInfo: () => void;
  isLoading?: boolean;
}

export function SoftwareItem({
  software,
  viewMode,
  onAction,
  onInfo,
  isLoading = false,
}: SoftwareItemProps) {
  const [imageError, setImageError] = useState(false);
  const { t, formatDate } = useTranslations();

  const formattedDate = useMemo(
    () => formatDate(new Date(software.lastUpdated), { dateStyle: "medium" }),
    [software.lastUpdated, formatDate]
  );

  const handleAction = () => {
    if (isLoading) return;
    onAction({
      ...software,
      actionType: software.installed ? "launched" : "installing",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        className="flex flex-col border rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md"
        layoutId={`software-${software.id}`}
      >
        <div className="p-2 sm:p-3 flex items-center gap-2 border-b bg-muted/10">
          <div className="relative w-8 h-8">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded">
                <div className="h-4 w-4 border-2 border-r-transparent rounded-full animate-spin border-primary"></div>
              </div>
            )}

            <Image
              src={
                imageError
                  ? "/placeholder.svg"
                  : software.icon || "/placeholder.svg"
              }
              alt={software.name}
              width={32}
              height={32}
              className={cn("rounded", isLoading && "opacity-50")}
              onError={handleImageError}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 justify-between">
              <h3 className="text-sm font-medium truncate">{software.name}</h3>
              <div className="flex items-center gap-1">
                {software.featured && (
                  <Badge
                    variant="secondary"
                    className="px-1 py-0 text-[10px] h-4"
                  >
                    {t("launcher.software.featured", { defaultValue: "精选" })}
                  </Badge>
                )}
                {software.installed && (
                  <Badge
                    variant="outline"
                    className="px-1 py-0 text-[10px] h-4"
                  >
                    {t("launcher.software.installed", { defaultValue: "已装" })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 sm:p-3 flex-1">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {software.description}
          </p>
        </div>

        <div className="p-2 sm:p-3 border-t bg-muted/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-2">
          <div className="flex flex-col text-[10px] text-muted-foreground">
            <span>v{software.version}</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex gap-1.5 ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onInfo}
                  title={t("launcher.software.moreInfo", {
                    defaultValue: "更多信息",
                  })}
                  aria-label={t("launcher.software.viewMoreInfo", {
                    defaultValue: "查看有关此软件的更多信息",
                  })}
                  disabled={isLoading}
                  className="h-7 w-7"
                >
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {t("launcher.software.detailedInfo", {
                  defaultValue: "详细信息",
                })}
              </TooltipContent>
            </Tooltip>

            <Button
              variant={
                software.actionLabel === "Launch" ? "default" : "outline"
              }
              size="sm"
              className={cn(
                "h-7 text-xs whitespace-nowrap",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
              onClick={handleAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-1 h-3 w-3 border-2 border-r-transparent rounded-full animate-spin"></div>
                  {software.actionLabel === "Install"
                    ? t("launcher.software.installing", {
                        defaultValue: "安装中...",
                      })
                    : t("launcher.software.loading", {
                        defaultValue: "加载中...",
                      })}
                </>
              ) : software.actionLabel === "Install" ? (
                t("launcher.software.install", { defaultValue: "安装" })
              ) : (
                t("launcher.software.launch", { defaultValue: "启动" })
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="flex items-center p-2 sm:p-3 border rounded-lg transition-all shadow-sm hover:shadow-md"
      layoutId={`software-${software.id}`}
    >
      <div className="flex-shrink-0 mr-3 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded">
            <div className="h-4 w-4 border-2 border-r-transparent rounded-full animate-spin border-primary"></div>
          </div>
        )}
        <Image
          src={
            imageError
              ? "/placeholder.svg"
              : software.icon || "/placeholder.svg"
          }
          alt={software.name}
          width={32}
          height={32}
          className={cn("rounded", isLoading && "opacity-50")}
          onError={handleImageError}
        />
      </div>

      <div className="flex-1 min-w-0 mr-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="text-sm font-medium">{software.name}</h3>
          <div className="flex gap-1">
            {software.featured && (
              <Badge variant="secondary" className="px-1 py-0 text-[10px] h-4">
                {t("launcher.software.featured", { defaultValue: "精选" })}
              </Badge>
            )}
            {software.installed && (
              <Badge variant="outline" className="px-1 py-0 text-[10px] h-4">
                {t("launcher.software.installed", { defaultValue: "已装" })}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 pr-1">
          {software.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] text-muted-foreground">
          <span>v{software.version}</span>
          <span className="hidden sm:inline">
            {software.downloads.toLocaleString()}{" "}
            {t("launcher.software.downloads", { defaultValue: "下载" })}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfo}
              title={t("launcher.software.moreInfo", {
                defaultValue: "更多信息",
              })}
              aria-label={t("launcher.software.viewMoreInfo", {
                defaultValue: "查看有关此软件的更多信息",
              })}
              disabled={isLoading}
              className="h-7 w-7"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {t("launcher.software.detailedInfo", { defaultValue: "详细信息" })}
          </TooltipContent>
        </Tooltip>

        <Button
          variant={software.actionLabel === "Launch" ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-7 text-xs whitespace-nowrap",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          onClick={handleAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-1 h-3 w-3 border-2 border-r-transparent rounded-full animate-spin"></div>
              {software.actionLabel === "Install"
                ? t("launcher.software.installing", {
                    defaultValue: "安装中...",
                  })
                : t("launcher.software.loading", { defaultValue: "加载中..." })}
            </>
          ) : software.actionLabel === "Install" ? (
            t("launcher.software.install", { defaultValue: "安装" })
          ) : (
            t("launcher.software.launch", { defaultValue: "启动" })
          )}
        </Button>
      </div>
    </motion.div>
  );
}
