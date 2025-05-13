import { RefreshCw, WifiOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectionStatus } from "./types";
import { fadeIn, skeletonPulse } from "./animation-constants";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { connectionApi } from "./connection-api";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";

interface ConnectionStatusCardProps {
  connectionStatus?: ConnectionStatus;
  isLoading?: boolean;
}

export function ConnectionStatusCard({
  connectionStatus,
  isLoading = false,
}: ConnectionStatusCardProps) {
  const [status, setStatus] = useState<ConnectionStatus | undefined>(
    connectionStatus
  );
  const [refreshing, setRefreshing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { t } = useTranslations();
  const { connectionStatus: csKeys } = translationKeys;
  // 移除未使用的 error 状态
  // const [error, setError] = useState<string | null>(null);

  // 当props更新时更新内部状态
  useEffect(() => {
    if (connectionStatus) {
      setStatus(connectionStatus);
    }
  }, [connectionStatus]);
  // 刷新连接状态
  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      const statuses = await connectionApi.getConnectionStatus();
      // Use the first status if available
      setStatus(statuses[0]);
      toast.success(t(csKeys.connectionSuccess));
    } catch (err) {
      console.error("获取连接状态失败:", err);
      toast.error(t(csKeys.refreshError));
    } finally {
      setRefreshing(false);
    }
  };
  // 连接/断开网络
  const handleToggleConnection = async () => {
    if (connecting || !status) return;

    setConnecting(true);

    try {
      const serviceName = status.name;
      if (status.status === "connected") {
        await connectionApi.disconnectService(serviceName);
        setStatus({ ...status, status: "disconnected" });
      } else {
        const newStatus = await connectionApi.reconnectService(serviceName);
        setStatus(newStatus);
      }

      toast.success(
        status.status === "connected" 
          ? t(csKeys.disconnectionSuccess) 
          : t(csKeys.connectionSuccess)
      );
    } catch (err) {
      console.error(
        `${status.status === "connected" ? "断开" : "连接"}服务失败:`,
        err
      );
      toast.error(
        status.status === "connected" 
          ? t(csKeys.disconnectionError) 
          : t(csKeys.connectionError)
      );
    } finally {
      setConnecting(false);
    }
  };
  // 重置连接
  const handleResetConnection = async () => {
    if (connecting || !status) return;

    setConnecting(true);

    try {
      const newStatus = await connectionApi.reconnectService(status.name);
      setStatus(newStatus);
      toast.success(t(csKeys.connectionSuccess));
    } catch (err) {
      console.error("重置服务失败:", err);
      toast.error(t(csKeys.connectionError));
    } finally {
      setConnecting(false);
    }
  };
  // 获取状态文本
  const getStatusText = (status?: ConnectionStatus): string => {
    if (!status) return t(csKeys.disconnected);
    if (status.status === "connected") return t(csKeys.connected);
    return t(csKeys.disconnected);
  };

  // 获取状态颜色类
  const getStatusColorClass = (status?: ConnectionStatus): string => {
    if (!status) return "text-muted-foreground";
    if (status.status === "connected") return "text-green-500";
    return "text-red-500";
  };
  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                {t(csKeys.title)}
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>{t(csKeys.description)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <motion.div
                  variants={skeletonPulse}
                  className="h-5 w-28 bg-muted/40 rounded"
                />
                <motion.div
                  variants={skeletonPulse}
                  className="h-8 bg-muted/40 rounded"
                />
              </div>
              <div className="space-y-2">
                <motion.div
                  variants={skeletonPulse}
                  className="h-5 w-28 bg-muted/40 rounded"
                />
                <motion.div
                  variants={skeletonPulse}
                  className="h-8 bg-muted/40 rounded"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div
              variants={skeletonPulse}
              className="h-9 w-24 bg-muted/40 rounded"
            />
            <motion.div
              variants={skeletonPulse}
              className="h-9 w-24 bg-muted/40 rounded"
            />
          </CardFooter>
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
              <Wifi className="h-5 w-5 mr-2" />
              {t(csKeys.title)}
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
              <span className="sr-only">{t(csKeys.refresh)}</span>
            </Button>
          </CardTitle>
          <CardDescription>{t(csKeys.description)}</CardDescription>
        </CardHeader>        <CardContent>
          {status ? (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium">{t(csKeys.status)}</span>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        status.status === "connected"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className={getStatusColorClass(status)}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">{t(csKeys.latency)}</span>                  <div className="rounded-md border p-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">{t(csKeys.latency)}</div>
                      <div>{status.name || t(csKeys.disconnected)}</div>
                      <div className="text-muted-foreground">{t(csKeys.status)}</div>
                      <div>{status.status === "connected" ? t(csKeys.connected) : t(csKeys.disconnected)}</div>
                      <div className="text-muted-foreground">{t(csKeys.uptime)}</div>
                      <div>{status.description || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>          ) : (
            <div className="py-8 text-center">
              <WifiOff className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <p className="mt-4 text-muted-foreground">{t(csKeys.emptyState)}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {t(csKeys.connecting)}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t(csKeys.refresh)}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>        {status && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleResetConnection}
              disabled={connecting}
            >
              {connecting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {t(csKeys.refresh)}
            </Button>
            <Button
              variant={
                status.status === "connected" ? "destructive" : "default"
              }
              onClick={handleToggleConnection}
              disabled={connecting}
            >
              {connecting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : status.status === "connected" ? (
                <WifiOff className="h-4 w-4 mr-2" />
              ) : (
                <Wifi className="h-4 w-4 mr-2" />
              )}
              {status.status === "connected" ? t(csKeys.disconnect) : t(csKeys.connect)}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
