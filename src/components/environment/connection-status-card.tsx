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
      toast.success("连接状态已更新");
    } catch (err) {
      console.error("获取连接状态失败:", err);
      toast.error("更新连接状态失败");
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
        status.status === "connected" ? "已断开服务" : "已连接到服务"
      );
    } catch (err) {
      console.error(
        `${status.status === "connected" ? "断开" : "连接"}服务失败:`,
        err
      );
      toast.error(`${status.status === "connected" ? "断开" : "连接"}服务失败`);
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
      toast.success("服务已重置");
    } catch (err) {
      console.error("重置服务失败:", err);
      toast.error("重置服务失败");
    } finally {
      setConnecting(false);
    }
  };

  // 获取状态文本
  const getStatusText = (status?: ConnectionStatus): string => {
    if (!status) return "无连接信息";
    if (status.status === "connected") return "已连接";
    return "未连接";
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
                服务连接状态
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>显示当前系统服务连接状态</CardDescription>
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
              服务连接状态
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
          <CardDescription>显示当前系统服务连接状态</CardDescription>
        </CardHeader>
        <CardContent>
          {status ? (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium">状态</span>
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
                  <span className="text-sm font-medium">网络详情</span>
                  <div className="rounded-md border p-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">服务名称</div>
                      <div>{status.name || "未知"}</div>
                      <div className="text-muted-foreground">状态</div>
                      <div>{status.status}</div>
                      <div className="text-muted-foreground">描述</div>
                      <div>{status.description || "无描述"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <WifiOff className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <p className="mt-4 text-muted-foreground">无可用连接信息</p>
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
                    加载中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    加载连接状态
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        {status && (
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
              重置服务
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
              {status.status === "connected" ? "断开服务" : "连接服务"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
