import { RefreshCw, ScrollText, X, Filter, Clock } from "lucide-react";
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
import { 
  powerScale, 
  enhancedSkeletonPulse, 
  enhancedStaggerChildren, 
  bounceItem,
  parallaxFadeIn
} from "./animation-constants";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { connectionApi } from "./connection-api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

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
      toast.success("日志已更新", {
        description: `获取到 ${newLogs.length} 条日志记录`
      });
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

  // 筛选日志
  const filteredLogs = selectedLevel 
    ? logs.filter(log => log.level === selectedLevel)
    : logs;

  // 获取日志项级别对应的颜色
  const getLogLevelColor = (level: string | undefined) => {
    // 如果 level 是 undefined 或空字符串，返回默认颜色
    if (!level) {
      return "bg-primary hover:bg-primary/90";
    }

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

  // 获取日志项级别对应的边框颜色
  const getLogLevelBorderColor = (level: string | undefined) => {
    if (!level) {
      return "border-primary/20";
    }

    switch (level.toLowerCase()) {
      case "error":
        return "border-destructive/20";
      case "warning":
        return "border-warning/20";
      case "info":
        return "border-info/20";
      case "debug":
        return "border-secondary/20";
      default:
        return "border-primary/20";
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={powerScale} className="w-full">
        <Card className="overflow-hidden border-t-4 border-t-primary/50 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ScrollText className="h-5 w-5 mr-2" />
                连接日志
              </div>
              <div className="h-9 w-9 bg-muted/40 rounded-full animate-pulse" />
            </CardTitle>
            <CardDescription>显示最近的连接日志信息</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={enhancedSkeletonPulse}
                  custom={i * 0.1}
                  className="h-16 bg-muted/30 rounded-md border border-muted/40"
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/30">
            <motion.div
              variants={enhancedSkeletonPulse}
              className="h-9 w-24 bg-muted/40 rounded"
            />
            <motion.div
              variants={enhancedSkeletonPulse}
              className="h-9 w-24 bg-muted/40 rounded"
            />
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={powerScale}
      whileHover="hover"
      className="w-full"
    >
      <Card className="overflow-hidden border-t-4 border-t-primary/50 shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-muted/30 to-background">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ScrollText className="h-5 w-5 mr-2" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 font-bold">
                连接日志
              </span>
              {liveMode && (
                <Badge className="ml-2 bg-success animate-pulse">
                  <span className="mr-1">●</span> 实时
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">筛选</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>筛选日志级别</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedLevel(null)}>
                    显示全部
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel("info")}>
                    仅显示信息
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel("warning")}>
                    仅显示警告
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel("error")}>
                    仅显示错误
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel("debug")}>
                    仅显示调试
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
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
                </TooltipTrigger>
                <TooltipContent>刷新日志</TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
          <CardDescription className="flex items-center">
            <Clock className="h-3 w-3 mr-1 opacity-70" />
            显示最近的连接日志信息
            {selectedLevel && (
              <Badge variant="outline" className="ml-2">
                已筛选: {selectedLevel}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 bg-gradient-to-b from-card to-background/80">
          {filteredLogs && filteredLogs.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <motion.div 
                className="space-y-3"
                variants={enhancedStaggerChildren}
                initial="initial"
                animate="animate"
              >
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={`${log.timestamp}-${
                      log.message?.substring(0, 10) || "unknown"
                    }`}
                    variants={bounceItem}
                    custom={index}
                    className={`p-3 text-sm rounded-md border ${getLogLevelBorderColor(log.level)} backdrop-blur-sm bg-card/70 hover:bg-card/90 transition-all duration-300`}
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        className={`${getLogLevelColor(log.level)} mb-2 shadow-sm`}
                        variant="secondary"
                      >
                        {log.level || "未知"}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1 opacity-70" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 leading-relaxed">{log.message || "无消息内容"}</div>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          ) : error ? (
            <motion.div 
              className="py-12 text-center"
              variants={parallaxFadeIn}
              initial="initial"
              animate="animate"
            >
              <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <X className="h-8 w-8 text-destructive" />
              </div>
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
            </motion.div>
          ) : (
            <motion.div 
              className="py-12 text-center"
              variants={parallaxFadeIn}
              initial="initial"
              animate="animate"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ScrollText className="h-8 w-8 text-primary/80" />
              </div>
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
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-gradient-to-r from-muted/30 to-background p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={liveMode ? "default" : "outline"}
                className={liveMode ? "bg-success hover:bg-success/90" : ""}
                onClick={toggleLiveMode}
              >
                <span className={`mr-2 ${liveMode ? "text-success-foreground" : ""}`}>
                  {liveMode ? "●" : "○"}
                </span>
                {liveMode ? "停止实时监控" : "实时监控"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {liveMode ? "关闭实时更新" : "每3秒自动更新一次日志"}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                onClick={handleClearLogs}
                disabled={!logs || logs.length === 0}
                className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 shadow-md"
              >
                清除日志
              </Button>
            </TooltipTrigger>
            <TooltipContent>清除所有日志记录</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
