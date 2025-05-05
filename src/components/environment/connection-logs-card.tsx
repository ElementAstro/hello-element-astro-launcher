import { RefreshCw, ScrollText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectionLogEntry } from "./types";
import { motion } from "framer-motion";
import { fadeIn, skeletonPulse } from "./animation-constants";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { connectionApi } from "./connection-api";

interface ConnectionLogsCardProps {
  logs?: ConnectionLogEntry[];
  isLoading?: boolean;
}

export function ConnectionLogsCard({
  logs: initialLogs,
  isLoading = false,
}: ConnectionLogsCardProps) {
  const [logs, setLogs] = useState<ConnectionLogEntry[]>(initialLogs || []);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveInterval, setLiveIntervalRef] = useState<number | null>(null);

  // 当props更新时更新内部状态
  useEffect(() => {
    if (initialLogs) {
      setLogs(initialLogs);
    }
  }, [initialLogs]);

  // 处理组件卸载时的清理工作
  useEffect(() => {
    return () => {
      if (liveInterval) {
        window.clearInterval(liveInterval);
      }
    };
  }, [liveInterval]);

  // 刷新连接日志
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError(null);

    try {
      const newLogs = await connectionApi.getConnectionLogs();
      setLogs(newLogs);
    } catch (err) {
      console.error("获取连接日志失败:", err);
      setError("无法获取连接日志");
      toast.error("获取连接日志失败");
    } finally {
      setRefreshing(false);
    }
  };

  // 清除日志
  const handleClearLogs = async () => {
    try {
      await connectionApi.clearConnectionLogs();
      setLogs([]);
      toast.success("连接日志已清除");
    } catch (err) {
      console.error("清除连接日志失败:", err);
      toast.error("清除连接日志失败");
    }
  };

  // 切换实时模式
  const toggleLiveMode = () => {
    if (liveMode && liveInterval) {
      window.clearInterval(liveInterval);
      setLiveIntervalRef(null);
      setLiveMode(false);
      toast.info("已关闭实时监控");
    } else {
      const interval = window.setInterval(async () => {
        try {
          const newLogs = await connectionApi.getConnectionLogs();
          setLogs(newLogs);
        } catch (err) {
          console.error("自动获取连接日志失败:", err);
        }
      }, 3000);
      setLiveIntervalRef(interval);
      setLiveMode(true);
      toast.info("已开启实时监控（每3秒更新一次）");
    }
  };

  // 获取日志项级别对应的颜色
  const getLogLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "bg-destructive hover:bg-destructive/90";
      case "warning":
        return "bg-warning hover:bg-warning/90 text-black";
      case "info":
        return "bg-info hover:bg-info/90";
      case "debug":
        return "bg-secondary hover:bg-secondary/90";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ScrollText className="h-5 w-5 mr-2" />
                连接日志
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>显示最近的连接日志信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={skeletonPulse}
                  className="h-10 bg-muted/40 rounded"
                />
              ))}
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
              <ScrollText className="h-5 w-5 mr-2" />
              连接日志
              {liveMode && (
                <Badge className="ml-2 bg-success animate-pulse">实时</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={refreshing || liveMode}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">刷新</span>
            </Button>
          </CardTitle>
          <CardDescription>显示最近的连接日志信息</CardDescription>
        </CardHeader>
        <CardContent>
          {logs && logs.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={`${log.timestamp}-${log.message.substring(0, 10)}`}
                    className="p-3 text-sm rounded-md border"
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        className={`${getLogLevelColor(log.level)} mb-2`}
                        variant="secondary"
                      >
                        {log.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1">{log.message}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : error ? (
            <div className="py-8 text-center">
              <X className="h-12 w-12 mx-auto text-destructive/60" />
              <p className="mt-4 text-muted-foreground">{error}</p>
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
                    重试
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <ScrollText className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <p className="mt-4 text-muted-foreground">暂无连接日志</p>
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
                    加载日志
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={toggleLiveMode}>
            {liveMode ? "停止实时监控" : "实时监控"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearLogs}
            disabled={!logs || logs.length === 0}
          >
            清除日志
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
