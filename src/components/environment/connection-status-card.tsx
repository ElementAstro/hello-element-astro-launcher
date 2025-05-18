import { RefreshCw, WifiOff, Wifi, Signal, Network } from "lucide-react";
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
import { fadeIn, enhancedSkeletonPulse } from "./animation-constants";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { connectionApi } from "./connection-api";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";
import { Badge } from "@/components/ui/badge";

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
      // 使用正确的API方法获取连接状态
      const statuses = await connectionApi.getConnectionStatus();
      if (statuses && statuses.length > 0) {
        setStatus(statuses[0]);
      }
      toast.success("连接状态已刷新");
    } catch (err) {
      console.error("刷新连接状态失败:", err);
      toast.error(t(csKeys.refreshError));
    } finally {
      setTimeout(() => setRefreshing(false), 300);
    }
  };

  // 连接/断开操作
  const handleToggleConnection = async () => {
    if (!status || connecting) return;

    setConnecting(true);

    try {
      const isConnected = status.status === "connected";
      
      if (isConnected) {
        // 使用正确的API方法断开连接
        await connectionApi.disconnectService(status.name);
        toast.success(t(csKeys.disconnectionSuccess));
        setStatus(prev => prev ? { ...prev, status: "disconnected" } : undefined);
      } else {
        // 使用正确的API方法重新连接
        const result = await connectionApi.reconnectService(status.name);
        setStatus(result);
        toast.success(t(csKeys.connectionSuccess));
      }
    } catch (err) {
      console.error("切换连接失败:", err);
      toast.error(t(csKeys.connectionError));
    } finally {
      setTimeout(() => setConnecting(false), 300);
    }
  };

  // 获取状态图标
  const getStatusIcon = () => {
    if (!status) return <Signal className="h-6 w-6 text-muted-foreground" />;
    
    switch (status.status) {
      case "connected":
        return <Wifi className="h-6 w-6 text-green-500" />;
      case "disconnected":
        return <WifiOff className="h-6 w-6 text-red-500" />;
      default:
        return <Network className="h-6 w-6 text-amber-500" />;
    }
  };
  // 获取状态文本和颜色
  const getStatusInfo = () => {
    if (!status) return { 
      text: "未知", 
      color: "text-muted-foreground",
      bgColor: "bg-gray-300",
      badgeVariant: "outline" as const
    };
    
    switch (status.status) {
      case "connected":
        return { 
          text: t(csKeys.connected), 
          color: "text-green-500",
          bgColor: "bg-green-500",
          badgeVariant: "default" as const
        };
      case "disconnected":
        return { 
          text: t(csKeys.disconnected), 
          color: "text-red-500",
          bgColor: "bg-red-500",
          badgeVariant: "destructive" as const
        };
      default:
        return { 
          text: t(csKeys.connecting), 
          color: "text-amber-500",
          bgColor: "bg-amber-500",
          badgeVariant: "outline" as const
        };
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Network className="h-5 w-5 mr-2 text-primary" />
                {t(csKeys.title)}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {t(csKeys.description)}
              </CardDescription>
            </div>
            <div className="h-9 w-9 bg-muted/40 rounded-full">
              <motion.div
                variants={enhancedSkeletonPulse}
                className="h-full w-full"
                animate="animate"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-28 bg-muted/40 rounded">
                    <motion.div
                      variants={enhancedSkeletonPulse}
                      className="h-full w-full"
                      animate="animate"
                    />
                  </div>
                  <div className="h-8 bg-muted/40 rounded">
                    <motion.div
                      variants={enhancedSkeletonPulse}
                      className="h-full w-full"
                      animate="animate"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <div className="h-9 w-24 bg-muted/40 rounded">
              <motion.div
                variants={enhancedSkeletonPulse}
                className="h-full w-full"
                animate="animate"
              />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg overflow-hidden">
        {/* 状态颜色条 */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.bgColor}/70`} 
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center text-xl group">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary mr-2 group-hover:bg-primary/20 transition-colors">
                <Network className="h-5 w-5" />
              </div>
              {t(csKeys.title)}
            </CardTitle>
            <CardDescription className="mt-1.5">
              {t(csKeys.description)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-5 w-5 text-primary/70 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">{t(csKeys.refresh)}</span>
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`absolute inset-0 ${statusInfo.bgColor}/20 rounded-full blur-md`} />
                  <div className="relative p-3 rounded-full bg-card border">
                    {getStatusIcon()}
                  </div>
                </div>                <div>
                  <h3 className="text-lg font-medium">
                    {status?.name || "设备名称"}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Badge variant={statusInfo.badgeVariant} className="mr-2">
                      {statusInfo.text}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {status?.description || t(csKeys.description)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">
                连接详情
              </div>
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t(csKeys.lastChecked)}</span>
                  <span className="text-sm">刚刚</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">连接类型</span>
                  <span className="text-sm">USB / 串口</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t(csKeys.latency)}</span>
                  <span className="text-sm">42ms</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-2">
          <Button
            onClick={handleToggleConnection}
            disabled={connecting}
            variant={status?.status === "connected" ? "destructive" : "default"}
            className={status?.status === "connected" 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600 text-white"}
          >
            {connecting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : status?.status === "connected" ? (
              <WifiOff className="h-4 w-4 mr-2" />
            ) : (
              <Wifi className="h-4 w-4 mr-2" />
            )}
            {status?.status === "connected"
              ? t(csKeys.disconnect)
              : t(csKeys.connect)}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
