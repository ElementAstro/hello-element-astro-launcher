import {
  HardDrive,
  Cpu,
  RefreshCw,
  MemoryStick,
  Database,
  Loader2,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemInfo } from "./types";
import {
  fadeIn,
  enhancedSkeletonPulse,
  powerScale,
  bounceItem,
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

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
            <div>
              <CardTitle className="flex items-center text-base">
                <Cpu className="h-4 w-4 mr-2 text-primary" />
                {t(systemInformation.title)}
              </CardTitle>
            </div>
            <div className="h-7 w-7 bg-muted/40 rounded-full animate-pulse" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <motion.div
                    variants={enhancedSkeletonPulse}
                    className="h-3 w-20 bg-muted/40 rounded"
                  />
                  <motion.div
                    variants={enhancedSkeletonPulse}
                    className="h-6 bg-muted/40 rounded"
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
        <Card className="backdrop-blur-sm bg-card/80 border-red-200/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
            <div>
              <CardTitle className="flex items-center text-base text-red-500">
                <Cpu className="h-4 w-4 mr-2" />
                {t(systemInformation.title)}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className="h-3 w-3" />
              <span className="sr-only">{t(systemInformation.refresh)}</span>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4 px-3">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-red-500">
                {t(systemInformation.refreshError)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {t(systemInformation.refresh)}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
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
    <motion.div
      variants={powerScale}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="w-full"
    >
      <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />{" "}
        <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
          <div>
            <CardTitle className="flex items-center text-sm group">
              <div className="p-0.5 rounded-md bg-primary/10 text-primary mr-1 group-hover:bg-primary/20 transition-colors">
                <Server className="h-3.5 w-3.5" />
              </div>
              {t(systemInformation.title)}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-primary/10 transition-colors"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-primary/80 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="sr-only">{t(systemInformation.refresh)}</span>
          </Button>
        </CardHeader>
        <CardContent className="p-3 pt-0 max-h-[240px] overflow-y-auto">
          {info ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={bounceItem} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium">
                      <div className="p-0.5 rounded-md bg-blue-500/10 text-blue-500 mr-1">
                        <Cpu className="h-3 w-3" />
                      </div>
                      {t(systemInformation.cpuUsage)}
                    </div>
                    <span className="text-xs font-semibold">
                      {info.cpuUsage}%
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1.5 rounded-full bg-blue-100 dark:bg-blue-950/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${info.cpuUsage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {info.cpuModel}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={bounceItem} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium">
                      <div className="p-0.5 rounded-md bg-green-500/10 text-green-500 mr-1">
                        <MemoryStick className="h-3 w-3" />
                      </div>
                      {t(systemInformation.memoryUsage)}
                    </div>
                    <span className="text-xs font-semibold">
                      {info.memoryUsage}%
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1.5 rounded-full bg-green-100 dark:bg-green-950/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${info.memoryUsage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {info.memoryUsed}/{info.memoryTotal} GB
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={bounceItem} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium">
                      <div className="p-0.5 rounded-md bg-purple-500/10 text-purple-500 mr-1">
                        <HardDrive className="h-3 w-3" />
                      </div>
                      {t(systemInformation.diskUsage)}
                    </div>
                    <span className="text-xs font-semibold">
                      {info.diskUsage}%
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1.5 rounded-full bg-purple-100 dark:bg-purple-950/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${info.diskUsage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {info.diskFree}/{info.diskTotal} GB
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={bounceItem} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium">
                      <div className="p-0.5 rounded-md bg-amber-500/10 text-amber-500 mr-1">
                        <Database className="h-3 w-3" />
                      </div>
                      {t(systemInformation.osInfo)}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    <div className="font-medium">
                      {info.osName} {info.osVersion}
                    </div>
                    <div>
                      {info.hostname} | {info.uptime}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="py-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t(systemInformation.refreshError)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs h-7"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {t(systemInformation.refresh)}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
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
