import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Info, Star, Tag, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
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
import { cardVariants, DURATION, EASE } from "./animation-variants";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

interface AvailableSoftwareCardProps {
  software: {
    id: number;
    name: string;
    version: string;
    description: string;
    size: string;
    icon: string;
    category: string;
    installed: boolean;
    tags?: string[];
    rating?: number;
    isNew?: boolean;
    lastUpdated?: string;
  };
  onDownload: () => void;
  onViewDetails?: () => void;
  alreadyDownloading?: boolean;
}

export function AvailableSoftwareCard({
  software,
  onDownload,
  onViewDetails,
  alreadyDownloading = false,
}: AvailableSoftwareCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslations(); // 使用 i18n hook

  // 处理下载操作
  const handleDownload = () => {
    if (software.installed) {
      setShowConfirmDialog(true);
      return;
    }

    startDownload();
  };

  // 开始下载
  const startDownload = () => {
    setIsDownloading(true);

    // 模拟网络请求延迟
    setTimeout(() => {
      onDownload();
      setIsDownloading(false);
    }, 800);
  };

  // 渲染星级评分
  const renderRating = () => {
    if (!software.rating) return null;

    return (
      <div className="flex items-center gap-0.5 mt-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < Math.floor(software.rating || 0)
                ? "text-amber-500 fill-amber-500"
                : "text-muted-foreground"
            )}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">
          {software.rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
    >
      <Card
        className={cn(
          "overflow-hidden h-full flex flex-col",
          software.installed && "border-green-200 dark:border-green-800",
          hovered && "shadow-lg"
        )}
      >
        {" "}
        <CardHeader className="p-2 flex flex-row items-center gap-2">
          <div className="relative">
            <Image
              src={software.icon || "/placeholder.svg"}
              alt={software.name}
              width={32}
              height={32}
              className="rounded"
            />
            {software.installed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
              >
                <Check className="h-2.5 w-2.5" />
              </motion.div>
            )}
          </div>
          <div className="flex-1">
            {" "}
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-sm">{software.name}</CardTitle>
              {software.isNew && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: DURATION.normal,
                    ease: EASE.bounce,
                  }}
                >
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-[9px] h-3.5 px-1 py-0">
                    {t("download.software.new", { defaultValue: "新" })}
                  </Badge>
                </motion.div>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center">
              <span>
                {t("download.software.version", { defaultValue: "版本" })}{" "}
                {software.version}
              </span>
              {software.lastUpdated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[10px] ml-1.5 text-muted-foreground/70 cursor-help">
                      ({software.lastUpdated})
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {t("download.software.lastUpdated", {
                        defaultValue: "最后更新时间",
                      })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {renderRating()}
          </div>
        </CardHeader>{" "}
        <CardContent className="p-2 pt-0 flex-1">
          <CardDescription className="text-[10px] line-clamp-2 mb-1.5">
            {software.description}
          </CardDescription>

          {software.tags && software.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: DURATION.normal }}
              className="flex flex-wrap gap-1 mt-1"
            >
              {software.tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: DURATION.normal,
                    ease: EASE.bounce,
                  }}
                >
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 px-1 flex items-center gap-0.5"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    <span>{tag}</span>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="p-2.5 pt-1.5 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] h-5 py-0">
              {software.category}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {software.size}
            </span>
          </div>
          <div className="flex gap-1.5">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
                className="h-6 px-1.5"
              >
                <Info className="h-3.5 w-3.5" />
                <span className="sr-only">
                  {t("download.software.viewDetails", {
                    defaultValue: "查看详情",
                  })}
                </span>
              </Button>
            )}
            <Button
              onClick={handleDownload}
              disabled={isDownloading || alreadyDownloading}
              size="sm"
              className="h-6 px-2 text-xs flex gap-1.5"
            >
              {isDownloading || alreadyDownloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              <span>
                {software.installed
                  ? t("download.software.reinstall", {
                      defaultValue: "重新安装",
                    })
                  : t("download.software.download", {
                      defaultValue: "下载",
                    })}
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("download.software.reinstallTitle", {
                defaultValue: "确定要重新安装？",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("download.software.reinstallDescription", {
                defaultValue:
                  "该软件已经安装过了，重新安装可能会覆盖当前版本。确定继续吗？",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-7">
              {t("common.cancel", { defaultValue: "取消" })}
            </AlertDialogCancel>
            <AlertDialogAction
              className="text-xs h-7"
              onClick={() => {
                setShowConfirmDialog(false);
                startDownload();
              }}
            >
              {t("common.confirm", { defaultValue: "确认" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
