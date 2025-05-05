import {
  HardDrive,
  Cpu,
  RefreshCw,
  Memory,
  Database,
  Loader2,
  BarChart2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SystemInfo } from "./types";
import {
  fadeIn,
  skeletonPulse,
  staggerContainer,
  staggerItems,
} from "./animation-constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { systemApi } from "./system-api";

interface SystemInformationCardProps {
  systemInfo?: SystemInfo;
  isLoading?: boolean;
}

export function SystemInformationCard({
  systemInfo,
  isLoading = false,
}: SystemInformationCardProps) {
  const [info, setInfo] = useState<SystemInfo | undefined>(systemInfo);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 当props更新时，更新内部状态
  useEffect(() => {
    if (systemInfo) {
      setInfo(systemInfo);
    }
  }, [systemInfo]);

  // 刷新系统信息
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    setError(null);
    
    try {
      const updatedInfo = await systemApi.getSystemInfo();
      setInfo(updatedInfo);
      toast.success("系统信息已更新");
    } catch (err) {
      console.error("获取系统信息失败:", err);
      setError("无法获取系统信息");
      toast.error("更新系统信息失败");
    } finally {
      setRefreshing(false);
    }
  };

  // 获取使用率的颜色类
  const getUsageColorClass = (percentage: number) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                系统信息
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>显示运行环境的系统信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <motion.div
                    variants={skeletonPulse}
                    className="h-5 w-28 bg-muted/40 rounded"
                  />
                  <motion.div
                    variants={skeletonPulse}
                    className="h-8 bg-muted/40 rounded"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-600 dark:text-red-400">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                系统信息
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">刷新</span>
              </Button>
            </CardTitle>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              无法获取系统信息
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center space-y-2">
              <p className="font-medium">获取系统信息时出现错误</p>
              <p className="text-sm text-muted-foreground">
                请检查系统服务是否正常运行
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    重试中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重试
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeIn} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              系统信息
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">刷新</span>
            </Button>
          </CardTitle>
          <CardDescription>显示运行环境的系统信息</CardDescription>
        </CardHeader>
        <CardContent>
          {info ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <Cpu className="h-4 w-4 mr-2" />
                    处理器
                  </div>
                  <span className="text-xs text-muted-foreground">{info.cpuUsage}%</span>
                </div>
                <div className="space-y-1">
                  <Progress
                    value={info.cpuUsage}
                    className="h-2"
                    indicatorClassName={getUsageColorClass(info.cpuUsage)}
                  />
                  <div className="text-xs text-muted-foreground">
                    {info.cpuModel}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <Memory className="h-4 w-4 mr-2" />
                    内存
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {info.memoryUsage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress
                    value={info.memoryUsage}
                    className="h-2"
                    indicatorClassName={getUsageColorClass(info.memoryUsage)}
                  />
                  <div className="text-xs text-muted-foreground">
                    {info.memoryUsed} GB / {info.memoryTotal} GB
                  </div>
                </div>
              </motion.div>

              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <HardDrive className="h-4 w-4 mr-2" />
                    磁盘
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {info.diskUsage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress
                    value={info.diskUsage}
                    className="h-2"
                    indicatorClassName={getUsageColorClass(info.diskUsage)}
                  />
                  <div className="text-xs text-muted-foreground">
                    {info.diskFree} GB 可用 / {info.diskTotal} GB 总容量
                  </div>
                </div>
              </motion.div>

              <motion.div variants={staggerItems} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <Database className="h-4 w-4 mr-2" />
                      操作系统
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.osName} {info.osVersion}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      主机名
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.hostname}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      系统运行时间
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.uptime}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">无可用系统信息</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    加载中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    加载系统信息
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
