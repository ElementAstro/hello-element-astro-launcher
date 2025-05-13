import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  CheckCircle,
  PauseCircle,
  XCircle,
  Gauge,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { formatSpeed } from "./download-status-utils";
import type { DownloadItem } from "@/types";

// 定义统计卡片属性接口
interface DownloadStatsCardProps {
  activeDownloads: DownloadItem[];
  completedDownloads: number;
  pausedDownloads: number;
  failedDownloads: number;
  totalDownloaded: number; // 字节数
  totalToDownload: number; // 字节数
  averageSpeed: number; // 字节/秒
  onPauseAll?: () => void;
  onResumeAll?: () => void;
  onCancelAll?: () => void;
}

// 动画变体
const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export function DownloadStatsCard({
  activeDownloads,
  completedDownloads,
  pausedDownloads,
  failedDownloads,
  totalDownloaded,
  totalToDownload,
  averageSpeed,
  onPauseAll,
  onResumeAll,
  onCancelAll,
}: DownloadStatsCardProps) {
  const [remainingTime, setRemainingTime] = useState<string>("");

  // 计算剩余时间
  useEffect(() => {
    if (averageSpeed > 0 && totalToDownload > totalDownloaded) {
      const remainingBytes = totalToDownload - totalDownloaded;
      const remainingSeconds = remainingBytes / averageSpeed;

      let timeString = "";

      if (remainingSeconds < 60) {
        timeString = `${Math.ceil(remainingSeconds)}秒`;
      } else if (remainingSeconds < 3600) {
        timeString = `${Math.ceil(remainingSeconds / 60)}分钟`;
      } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.ceil((remainingSeconds % 3600) / 60);
        timeString = `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ""}`;
      }

      setRemainingTime(timeString);
    } else {
      setRemainingTime("计算中...");
    }
  }, [averageSpeed, totalDownloaded, totalToDownload]);

  // 计算总进度比例
  const progressPercentage =
    totalToDownload > 0
      ? Math.min(100, Math.round((totalDownloaded / totalToDownload) * 100))
      : 0;

  // 判断是否所有下载都已暂停
  const allPaused =
    activeDownloads.length > 0 &&
    activeDownloads.every((d) => d.status === "paused");

  // 判断是否有下载正在进行
  const hasActiveDownloads = activeDownloads.some(
    (d) =>
      d.status === "downloading" ||
      d.status === "waiting" ||
      d.status === "processing" ||
      d.status === "verification"
  );

  return (
    <motion.div variants={statsVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <ArrowDownToLine className="h-5 w-5 mr-2" />
            下载统计
          </CardTitle>
          <CardDescription>
            {hasActiveDownloads
              ? "正在进行下载任务，查看实时下载状态"
              : "当前没有活跃的下载任务"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 下载状态统计 */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <ArrowDownToLine className="h-4 w-4 mb-1 text-blue-500" />
              <span className="text-lg font-semibold">
                {activeDownloads.length}
              </span>
              <span className="text-xs text-muted-foreground">活跃</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <CheckCircle className="h-4 w-4 mb-1 text-green-500" />
              <span className="text-lg font-semibold">
                {completedDownloads}
              </span>
              <span className="text-xs text-muted-foreground">已完成</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <PauseCircle className="h-4 w-4 mb-1 text-amber-500" />
              <span className="text-lg font-semibold">{pausedDownloads}</span>
              <span className="text-xs text-muted-foreground">已暂停</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <XCircle className="h-4 w-4 mb-1 text-red-500" />
              <span className="text-lg font-semibold">{failedDownloads}</span>
              <span className="text-xs text-muted-foreground">失败</span>
            </div>
          </div>

          {/* 总体进度 */}
          {activeDownloads.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>总体进度</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          )}

          {/* 下载速度和剩余时间 */}
          {hasActiveDownloads && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                <Gauge className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">
                    {formatSpeed(averageSpeed)}
                  </div>
                  <div className="text-xs text-muted-foreground">平均速度</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">{remainingTime}</div>
                  <div className="text-xs text-muted-foreground">剩余时间</div>
                </div>
              </div>
            </div>
          )}

          {/* 批量操作按钮 */}
          {activeDownloads.length > 0 && (
            <div className="flex gap-2 justify-end">
              {allPaused
                ? onResumeAll && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onResumeAll}
                        >
                          全部恢复
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>恢复所有暂停的下载</TooltipContent>
                    </Tooltip>
                  )
                : onPauseAll && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onPauseAll}
                        >
                          全部暂停
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>暂停所有下载</TooltipContent>
                    </Tooltip>
                  )}

              {onCancelAll && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onCancelAll}
                    >
                      全部取消
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>取消所有下载</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
