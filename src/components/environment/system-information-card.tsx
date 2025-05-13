import {
  HardDrive,
  Cpu,
  RefreshCw,
  MemoryStick, // 修复：改用 MemoryStick 替代不存在的 Memory
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SystemInfo } from "./types";
import {
  fadeIn,
  skeletonPulse,
  // 修复：移除不存在的动画常量导入
} from "./animation-constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { systemApi } from "./system-api";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";

// 修复：定义正确的 SystemInfo 类型，添加缺少的属性
interface ExtendedSystemInfo extends SystemInfo {
  cpuUsage: number;
  cpuModel: string;
  memoryUsage: number;
  memoryUsed: number;
  memoryTotal: number;
  diskUsage: number;
  diskFree: number;
  diskTotal: number;
  osName: string;
  osVersion: string;
  hostname: string;
  uptime: string;
}

interface SystemInformationCardProps {
  systemInfo?: ExtendedSystemInfo;
  isLoading?: boolean;
}

export function SystemInformationCard({
  systemInfo,
  isLoading = false,
}: SystemInformationCardProps) {
  const [info, setInfo] = useState<ExtendedSystemInfo | undefined>(systemInfo);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();
  const { systemInformation } = translationKeys;

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
      setInfo(updatedInfo as ExtendedSystemInfo);
      toast.success(t(systemInformation.refreshSuccess));
    } catch (err) {
      console.error("获取系统信息失败:", err);
      setError(t(systemInformation.refreshError));
      toast.error(t(systemInformation.refreshError));
    } finally {
      setRefreshing(false);
    }
  };

  // 自定义动画变体定义
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItems = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
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
                {t(systemInformation.title)}
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>{t(systemInformation.description)}</CardDescription>
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
                {t(systemInformation.title)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">{t(systemInformation.refresh)}</span>
              </Button>
            </CardTitle>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              {t(systemInformation.refreshError)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center space-y-2">
              <p className="font-medium">{t(systemInformation.refreshError)}</p>
              <p className="text-sm text-muted-foreground">
                {error}
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
                    {t(systemInformation.refresh)}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t(systemInformation.refresh)}
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
              {t(systemInformation.title)}
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
              <span className="sr-only">{t(systemInformation.refresh)}</span>
            </Button>
          </CardTitle>
          <CardDescription>{t(systemInformation.description)}</CardDescription>
        </CardHeader>
        <CardContent>
          {info ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <Cpu className="h-4 w-4 mr-2" />
                    {t(systemInformation.cpuUsage)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {info.cpuUsage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={info.cpuUsage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {info.cpuModel}
                  </div>
                </div>
              </motion.div>              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <MemoryStick className="h-4 w-4 mr-2" />
                    {t(systemInformation.memoryUsage)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {info.memoryUsage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={info.memoryUsage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {info.memoryUsed} GB ({t(systemInformation.used)}) / {info.memoryTotal} GB ({t(systemInformation.total)})
                  </div>
                </div>
              </motion.div>              <motion.div variants={staggerItems} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <HardDrive className="h-4 w-4 mr-2" />
                    {t(systemInformation.diskUsage)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {info.diskUsage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={info.diskUsage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {info.diskFree} GB ({t(systemInformation.free)}) / {info.diskTotal} GB ({t(systemInformation.total)})
                  </div>
                </div>
              </motion.div>              <motion.div variants={staggerItems} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <Database className="h-4 w-4 mr-2" />
                      {t(systemInformation.osInfo)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.osName} {info.osVersion}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      {t(systemInformation.hostname)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.hostname}
                    </div>
                  </div>
                </div>                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {t(systemInformation.uptime)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {info.uptime}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">{t(systemInformation.refreshError)}</p>
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
                    {t(systemInformation.refresh)}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t(systemInformation.refresh)}
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
