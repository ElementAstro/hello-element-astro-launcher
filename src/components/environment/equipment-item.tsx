import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Info,
  Loader2,
  RefreshCw,
  Shield,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fadeInScale,
  statusIndicator,
  pulseAnimation,
  expandContent,
  successAnimation,
} from "./animation-constants";
import { Equipment } from "./types";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { shouldReduceMotion } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type EquipmentItemProps = Omit<Equipment, "id"> & {
  onConnect?: () => Promise<void>;
};

export function EquipmentItem({
  name,
  type,
  status,
  driver,
  details,
  lastConnected,
  connectionType,
  firmwareVersion,
  onConnect,
}: EquipmentItemProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showFirmwareUpdate, setShowFirmwareUpdate] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<
    "success" | "warning" | "error" | null
  >(null);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    autoReconnect: false,
    highPrecisionMode: false,
    lowNoiseMode: false,
    debugMode: false,
  });

  // 连接状态效果
  useEffect(() => {
    if (status === "Connected") {
      setConnectionSuccess(true);
    } else {
      setConnectionSuccess(false);
    }
  }, [status]);

  // 处理设备连接
  const handleConnect = async () => {
    if (!onConnect) return;

    setLoading(true);
    setError(null);
    setConnectionSuccess(false);

    try {
      await onConnect();
      setConnectionSuccess(true);
      toast.success(`成功连接到 ${name}`, {
        description: `设备已准备就绪`,
        action: {
          label: "查看详情",
          onClick: () => setShowDetails(true),
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "连接失败";
      setError(errorMessage);
      toast.error(`连接失败: ${errorMessage}`, {
        action: {
          label: "重试",
          onClick: () => handleRetry(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理重试连接
  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await handleConnect();
    } finally {
      setIsRetrying(false);
    }
  };

  // 处理固件更新
  const handleFirmwareUpdate = async () => {
    setShowFirmwareUpdate(true);
    setIsUpdating(true);
    setUpdateProgress(0);

    // 模拟更新过程
    const interval = setInterval(() => {
      setUpdateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          setUpdateComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  // 处理运行诊断
  const handleRunDiagnostics = async () => {
    setDiagnosticsRunning(true);
    setDiagnosticsResult(null);

    // 模拟诊断过程
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 随机诊断结果
    const random = Math.random();
    if (random > 0.7) {
      setDiagnosticsResult("success");
    } else if (random > 0.3) {
      setDiagnosticsResult("warning");
    } else {
      setDiagnosticsResult("error");
    }

    setDiagnosticsRunning(false);
  };

  return (
    <motion.div
      layout
      variants={fadeInScale}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col gap-2 p-3 border rounded-lg hover:border-primary/50 transition-colors"
      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
      whileTap={{ scale: shouldReduceMotion() ? 1 : 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            variants={statusIndicator}
            animate={status === "Connected" ? "connected" : "disconnected"}
            className={`w-3 h-3 rounded-full ${
              status === "Connected" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <div>
            <h4 className="font-medium">{name}</h4>
            <div className="text-sm text-muted-foreground">
              {type} • {driver}
            </div>
            {lastConnected && status !== "Connected" && (
              <div className="text-xs text-muted-foreground mt-1">
                上次连接时间: {lastConnected}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </motion.div>
            ) : connectionSuccess ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="flex items-center gap-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="whitespace-nowrap bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      >
                        {connectionType || "已连接"}
                      </Badge>
                      {firmwareVersion && (
                        <Badge variant="outline" className="text-xs">
                          v{firmwareVersion}
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>连接类型: {connectionType || "未知"}</p>
                    {firmwareVersion && <p>固件版本: v{firmwareVersion}</p>}
                    {Object.entries(details || {}).map(([key, value]) => (
                      <p key={key}>{`${key}: ${value}`}</p>
                    ))}
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  详情
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="connect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnect}
                  disabled={loading || !onConnect}
                >
                  连接
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>查看设备详情</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            variants={expandContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-between gap-2 text-sm text-red-500 mt-2 bg-red-50 dark:bg-red-950/50 p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRetry}
              disabled={isRetrying}
              className="h-6 w-6 flex-shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 设备详情对话框 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{name} 详情</DialogTitle>
            <DialogDescription>查看和管理设备详细信息和设置</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">基本信息</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
              <TabsTrigger value="diagnostics">诊断</TabsTrigger>
              <TabsTrigger value="firmware">固件</TabsTrigger>
            </TabsList>

            {/* 基本信息选项卡 */}
            <TabsContent value="info" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">设备名称</div>
                  <div className="text-sm">{name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">设备类型</div>
                  <div className="text-sm">{type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">驱动</div>
                  <div className="text-sm">{driver}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">连接状态</div>
                  <div className="flex items-center text-sm">
                    <motion.div
                      variants={statusIndicator}
                      animate={
                        status === "Connected" ? "connected" : "disconnected"
                      }
                      className={`w-2 h-2 rounded-full mr-2 ${
                        status === "Connected" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {status === "Connected" ? "已连接" : "未连接"}
                  </div>
                </div>
                {connectionType && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">连接类型</div>
                    <div className="text-sm">{connectionType}</div>
                  </div>
                )}
                {firmwareVersion && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">固件版本</div>
                    <div className="text-sm">v{firmwareVersion}</div>
                  </div>
                )}
                {lastConnected && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">上次连接时间</div>
                    <div className="text-sm">{lastConnected}</div>
                  </div>
                )}
              </div>

              {details && Object.keys(details).length > 0 && (
                <>
                  <div className="text-sm font-medium mt-4">其他详细信息</div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-sm font-medium">{key}</div>
                        <div className="text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* 设置选项卡 */}
            <TabsContent value="settings" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-reconnect">自动重连</Label>
                    <div className="text-xs text-muted-foreground">
                      设备断开连接时自动尝试重新连接
                    </div>
                  </div>
                  <Switch
                    id="auto-reconnect"
                    checked={advancedSettings.autoReconnect}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        autoReconnect: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-precision">高精度模式</Label>
                    <div className="text-xs text-muted-foreground">
                      提高设备精度，但可能降低性能
                    </div>
                  </div>
                  <Switch
                    id="high-precision"
                    checked={advancedSettings.highPrecisionMode}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        highPrecisionMode: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-noise">低噪音模式</Label>
                    <div className="text-xs text-muted-foreground">
                      减少设备噪音，适用于某些相机和调焦器
                    </div>
                  </div>
                  <Switch
                    id="low-noise"
                    checked={advancedSettings.lowNoiseMode}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        lowNoiseMode: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">调试模式</Label>
                    <div className="text-xs text-muted-foreground">
                      启用详细日志记录以帮助解决问题
                    </div>
                  </div>
                  <Switch
                    id="debug-mode"
                    checked={advancedSettings.debugMode}
                    onCheckedChange={(checked) => {
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        debugMode: checked,
                      }));
                      if (checked) {
                        toast.info("已启用调试模式");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => {
                    toast.success("设置已保存");
                  }}
                >
                  保存设置
                </Button>
              </div>
            </TabsContent>

            {/* 诊断选项卡 */}
            <TabsContent value="diagnostics" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">设备诊断</h4>
                      <p className="text-sm text-muted-foreground">
                        运行诊断测试以检查设备是否正常工作
                      </p>
                    </div>
                    <Button
                      disabled={diagnosticsRunning}
                      onClick={handleRunDiagnostics}
                    >
                      {diagnosticsRunning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          运行中...
                        </>
                      ) : (
                        <>
                          <Wrench className="h-4 w-4 mr-2" />
                          运行诊断
                        </>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    {diagnosticsResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`p-3 rounded-md ${
                            diagnosticsResult === "success"
                              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                              : diagnosticsResult === "warning"
                              ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          <div className="font-medium mb-1">
                            {diagnosticsResult === "success"
                              ? "诊断完成: 设备运行正常"
                              : diagnosticsResult === "warning"
                              ? "诊断完成: 发现潜在问题"
                              : "诊断完成: 发现严重问题"}
                          </div>
                          <div className="text-sm">
                            {diagnosticsResult === "success"
                              ? "所有测试均已通过。设备处于最佳状态。"
                              : diagnosticsResult === "warning"
                              ? "某些测试显示可能存在问题。建议定期维护。"
                              : "诊断测试失败。请检查连接并联系技术支持。"}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium">设备状态检查</h4>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>连接稳定性</span>
                      <span className="text-green-600 dark:text-green-400">
                        良好
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>响应时间</span>
                      <span className="text-green-600 dark:text-green-400">
                        正常 (45ms)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>传输速率</span>
                      <span
                        className={`${
                          status === "Connected"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {status === "Connected" ? "5.2 MB/s" : "未连接"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>设备温度</span>
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {status === "Connected" ? "42°C (轻微偏高)" : "未知"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 固件选项卡 */}
            <TabsContent value="firmware" className="space-y-4 py-4">
              <div className="rounded-md border p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">固件信息</h4>
                    <p className="text-sm text-muted-foreground">
                      管理设备固件和更新
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      有可用更新
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>当前版本</span>
                    <span>{firmwareVersion || "未知"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>最新版本</span>
                    <span className="font-medium">
                      {firmwareVersion
                        ? parseFloat(firmwareVersion) + 0.1
                        : "1.0.0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>发布日期</span>
                    <span>2025年4月15日</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleFirmwareUpdate}
                    disabled={!status || status !== "Connected"}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    更新固件
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h4 className="font-medium">发行说明</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  最新固件版本的更新内容
                </p>
                <div className="mt-3 text-sm space-y-2">
                  <p>• 改进温度控制算法，减少噪音</p>
                  <p>• 修复某些连接状态下的稳定性问题</p>
                  <p>• 提高与最新ASCOM驱动程序的兼容性</p>
                  <p>• 新增远程操作功能</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              关闭
            </Button>
            {status === "Connected" && (
              <Button
                variant="destructive"
                onClick={() => {
                  toast.success("设备已断开连接");
                  setShowDetails(false);
                }}
              >
                断开连接
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 固件更新对话框 */}
      <Dialog open={showFirmwareUpdate} onOpenChange={setShowFirmwareUpdate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {updateComplete ? "更新完成" : "固件更新"}
            </DialogTitle>
            <DialogDescription>
              {updateComplete
                ? `${name} 固件已成功更新`
                : `更新 ${name} 的固件`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {updateComplete ? (
              <motion.div
                variants={successAnimation}
                initial="initial"
                animate="animate"
                className="flex flex-col items-center justify-center space-y-4"
              >
                <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold">固件更新成功</h3>
                <p className="text-center text-muted-foreground">
                  设备固件已成功更新到最新版本
                </p>
              </motion.div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>正在更新固件...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <Progress value={updateProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    更新过程中请不要断开设备连接或关闭应用程序
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={
                        updateProgress > 20 ? { opacity: 1 } : { opacity: 0.5 }
                      }
                    >
                      {updateProgress > 20 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Shield className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </motion.div>
                    <span
                      className={
                        updateProgress > 20 ? "" : "text-muted-foreground"
                      }
                    >
                      准备更新
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={
                        updateProgress > 40 ? { opacity: 1 } : { opacity: 0.5 }
                      }
                    >
                      {updateProgress > 40 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Shield className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </motion.div>
                    <span
                      className={
                        updateProgress > 40 ? "" : "text-muted-foreground"
                      }
                    >
                      传输固件数据
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={
                        updateProgress > 70 ? { opacity: 1 } : { opacity: 0.5 }
                      }
                    >
                      {updateProgress > 70 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Shield className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </motion.div>
                    <span
                      className={
                        updateProgress > 70 ? "" : "text-muted-foreground"
                      }
                    >
                      验证固件完整性
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={
                        updateProgress > 90 ? { opacity: 1 } : { opacity: 0.5 }
                      }
                    >
                      {updateProgress > 90 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Shield className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </motion.div>
                    <span
                      className={
                        updateProgress > 90 ? "" : "text-muted-foreground"
                      }
                    >
                      重启设备
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {updateComplete ? (
              <Button
                onClick={() => {
                  setShowFirmwareUpdate(false);
                  setUpdateComplete(false);
                  setUpdateProgress(0);
                }}
              >
                完成
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() => setShowFirmwareUpdate(false)}
              >
                {isUpdating ? "更新中..." : "取消"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
