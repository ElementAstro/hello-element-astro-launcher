import {
  AlertTriangle,
  Info,
  Layers,
  Loader2,
  RefreshCw,
  Settings,
  Terminal,
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
import { ConnectionStatus } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInScale,
  statusIndicator,
  expandContent,
} from "./animation-constants";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shouldReduceMotion } from "@/lib/utils";

interface ConnectionStatusCardProps {
  connections: ConnectionStatus[];
  isLoading?: boolean;
}

export function ConnectionStatusCard({
  connections,
  isLoading = false,
}: ConnectionStatusCardProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionStatus | null>(null);
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [autoRetry, setAutoRetry] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [retryTimerActive, setRetryTimerActive] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // 处理连接请求
  const handleConnect = async (connection: ConnectionStatus) => {
    const connectionName = connection.name;
    setLoading((prev) => ({ ...prev, [connectionName]: true }));
    setError((prev) => ({ ...prev, [connectionName]: "" }));
    setProcessLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - 正在连接到 ${connectionName}...`,
    ]);

    try {
      // 模拟连接尝试
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 随机成功/失败示例
      const success = connection.status === "connected" || Math.random() > 0.3;

      if (!success) {
        throw new Error("连接失败。请检查设备连接并重试。");
      }

      // 连接成功
      setProcessLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()} - 成功连接到 ${connectionName}`,
      ]);
      toast.success(`成功连接到 ${connectionName}`);
      setRetryAttempt(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "连接失败";
      setError((prev) => ({ ...prev, [connectionName]: errorMessage }));
      setProcessLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()} - 错误: ${errorMessage}`,
      ]);

      toast.error(`连接到 ${connectionName} 失败: ${errorMessage}`, {
        action: {
          label: "重试",
          onClick: () => handleRetry(connection),
        },
      });

      // 如果启用了自动重试
      if (autoRetry) {
        handleAutoRetry(connection);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [connectionName]: false }));
    }
  };

  // 处理重试
  const handleRetry = async (connection: ConnectionStatus) => {
    setRetryAttempt((prev) => prev + 1);
    await handleConnect(connection);
  };

  // 处理自动重试
  const handleAutoRetry = async (connection: ConnectionStatus) => {
    const maxRetries = 3;
    const delay = 5; // 秒

    if (retryAttempt >= maxRetries) {
      setProcessLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()} - 达到最大重试次数 (${maxRetries})`,
      ]);
      toast.error(`无法连接到 ${connection.name}：达到最大重试次数`);
      setRetryAttempt(0);
      return;
    }

    setRetryTimerActive(true);
    setRetryCountdown(delay);

    setProcessLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - 将在 ${delay} 秒后重试 (尝试 ${
        retryAttempt + 1
      }/${maxRetries})`,
    ]);

    // 倒计时逻辑
    const timer = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRetryTimerActive(false);
          handleRetry(connection);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  // 打开详情对话框
  const showDetails = (connection: ConnectionStatus) => {
    setSelectedConnection(connection);
    setShowDetailsDialog(true);
  };

  // 渲染连接状态图标
  const renderStatusIndicator = (status: string) => {
    return (
      <motion.div
        variants={statusIndicator}
        animate={status}
        className={`w-3 h-3 rounded-full mr-3 ${
          status === "connected" ? "bg-green-500" : "bg-red-500"
        }`}
      />
    );
  };

  // 渲染空状态
  if (!isLoading && connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            连接状态
          </CardTitle>
          <CardDescription>监控和管理软件连接</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Settings className="h-16 w-16 text-muted-foreground mb-4 opacity-50 mx-auto" />
            <h3 className="text-lg font-medium">没有可用的连接</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              尚未配置任何软件连接。通过设置界面添加新的连接，或检查您的系统配置。
            </p>
            <Button className="mt-4">配置连接</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              连接状态
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    toast.success("刷新连接状态");
                    // 刷新逻辑
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>刷新连接状态</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>监控和管理软件连接</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence mode="wait" initial={false}>
              {isLoading
                ? // 加载骨架屏
                  Array.from({ length: 3 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-16 bg-muted/30 rounded-lg animate-pulse"
                    />
                  ))
                : connections.map((connection, index) => (
                    <motion.div
                      key={index}
                      layout
                      variants={fadeInScale}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`flex flex-col gap-2 p-3 border rounded-lg ${
                        error[connection.name]
                          ? "border-red-200 dark:border-red-900"
                          : ""
                      } transition-colors`}
                      whileHover={{
                        scale: shouldReduceMotion() ? 1 : 1.01,
                        borderColor: "var(--primary)",
                      }}
                      whileTap={{ scale: shouldReduceMotion() ? 1 : 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {renderStatusIndicator(connection.status)}
                          <div>
                            <h4 className="font-medium">{connection.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {connection.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AnimatePresence mode="wait">
                            {loading[connection.name] ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <Button variant="ghost" size="sm" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  连接中...
                                </Button>
                              </motion.div>
                            ) : connection.status === "connected" ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => showDetails(connection)}
                                  >
                                    <Info className="h-4 w-4 mr-2" />
                                    详情
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>查看连接详情和选项</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConnect(connection)}
                                    disabled={loading[connection.name]}
                                  >
                                    连接
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>建立连接</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <AnimatePresence>
                        {error[connection.name] && (
                          <motion.div
                            variants={expandContent}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center justify-between gap-2 text-sm text-red-500 mt-1 bg-red-50 dark:bg-red-950/30 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                              <span>{error[connection.name]}</span>
                            </div>
                            <div className="flex gap-2">
                              {retryTimerActive && (
                                <div className="flex items-center text-xs">
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    {retryCountdown}秒后重试...
                                  </motion.span>
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRetry(connection)}
                                disabled={
                                  loading[connection.name] || retryTimerActive
                                }
                                className="h-6 w-6"
                              >
                                <RefreshCw
                                  className={`h-3 w-3 ${
                                    retryTimerActive ? "animate-spin" : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-retry"
                    checked={autoRetry}
                    onCheckedChange={setAutoRetry}
                  />
                  <Label htmlFor="auto-retry">自动重试</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>启用自动重试失败的连接</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setProcessLogs([]);
              setShowDetailsDialog(true);
            }}
          >
            <Terminal className="h-4 w-4 mr-2" />
            查看日志
          </Button>
        </CardFooter>
      </Card>

      {/* 连接详情对话框 */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedConnection
                ? `${selectedConnection.name} 详情`
                : "连接日志"}
            </DialogTitle>
            <DialogDescription>
              {selectedConnection ? "查看和修改连接设置" : "查看连接过程日志"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="logs">连接日志</TabsTrigger>
              <TabsTrigger value="settings" disabled={!selectedConnection}>
                设置
              </TabsTrigger>
              <TabsTrigger value="diagnostics" disabled={!selectedConnection}>
                诊断
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="logs"
              className="space-y-4 h-[300px] overflow-y-auto"
            >
              <div className="p-2 bg-muted/30 rounded font-mono text-xs h-full overflow-auto">
                {processLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    暂无日志记录
                  </div>
                ) : (
                  processLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="py-1"
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              {selectedConnection && (
                <>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">名称</Label>
                      <Input
                        id="name"
                        value={selectedConnection.name}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">描述</Label>
                      <Input
                        id="description"
                        value={selectedConnection.description}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-connect" />
                      <Label htmlFor="auto-connect">启动时自动连接</Label>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="diagnostics" className="space-y-4">
              {selectedConnection && (
                <>
                  <div className="space-y-2">
                    <Label>连接状态</Label>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="flex items-center space-x-2">
                        {renderStatusIndicator(selectedConnection.status)}
                        <span>
                          {selectedConnection.status === "connected"
                            ? "已连接"
                            : "未连接"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>延迟测试</Label>
                    <Button variant="outline" size="sm" className="w-full">
                      运行延迟测试
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              关闭
            </Button>
            {selectedConnection &&
              selectedConnection.status === "connected" && (
                <Button variant="destructive">断开连接</Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
