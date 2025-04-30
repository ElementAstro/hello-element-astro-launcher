import {
  Bell,
  Check,
  Cpu,
  Download,
  FileStack,
  RefreshCw,
  Slash,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInScale,
  pulseAnimation,
  staggerChildren,
  DURATION,
} from "./animation-constants";
import { SystemInfo } from "./types";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { shouldReduceMotion } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SystemInformationCardProps {
  systemInfo: SystemInfo;
  isLoading?: boolean;
}

export function SystemInformationCard({
  systemInfo,
  isLoading = false,
}: SystemInformationCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [showSystemReport, setShowSystemReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);

  // 处理刷新系统信息
  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      // 模拟刷新操作
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("系统信息已刷新");
    } catch (error) {
      toast.error("刷新系统信息时出错");
      console.error("Error refreshing system info:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 处理检查更新
  const handleCheckUpdates = () => {
    setShowUpdateDialog(true);
    // 检查是否有更新
    simulateUpdateCheck();
  };

  // 模拟更新检查
  const simulateUpdateCheck = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // 假设找到了更新
      toast.success("发现可用更新", {
        description: "ASCOM 平台有新版本可用",
        action: {
          label: "立即更新",
          onClick: () => handleUpdate(),
        },
      });
    } catch {
      toast.error("检查更新时出错");
    }
  };

  // 处理更新
  const handleUpdate = async () => {
    if (updating) return;

    setUpdating(true);
    setUpdateProgress(0);

    try {
      // 模拟更新进度
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUpdateProgress(i);
      }

      setUpdateComplete(true);
      toast.success("更新已成功完成");
    } catch (error) {
      toast.error("更新过程中出错");
      console.error("Error during update:", error);
    }
  };

  // 处理生成系统报告
  const handleGenerateReport = async () => {
    setShowSystemReport(true);

    try {
      // 模拟报告生成
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 生成假报告数据
      const report = `系统报告生成于: ${new Date().toLocaleString()}
操作系统: ${systemInfo.os}
处理器: ${systemInfo.processor}
内存: ${systemInfo.memory}
显卡: ${systemInfo.graphics}

已安装的软件:
- ASCOM 平台: 版本 ${systemInfo.ascomVersion}
- PHD2 指导软件: 版本 ${systemInfo.phd2Version}
- INDIGO: ${systemInfo.indigoInstalled ? "已安装" : "未安装"}
- INDI: ${systemInfo.indiInstalled ? "已安装" : "未安装"}

存储状态:
- 系统盘 (C:): ${systemInfo.storage.system.free} 可用，共 ${
        systemInfo.storage.system.total
      }
- 数据盘 (D:): ${systemInfo.storage.data.free} 可用，共 ${
        systemInfo.storage.data.total
      }

系统运行状态: 正常
最近错误: 无`;

      setReportData(report);
      setReportGenerated(true);
    } catch (error) {
      toast.error("生成系统报告时出错");
      console.error("Error generating system report:", error);
    }
  };

  // 存储使用情况警告状态
  const lowStorageWarning =
    systemInfo.storage.system.percentUsed > 90 ||
    systemInfo.storage.data.percentUsed > 90;

  // 渲染加载骨架屏
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              系统信息
            </CardTitle>
            <CardDescription>
              关于您的计算机系统和软件环境的详细信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                    className="h-10 bg-muted/50 rounded"
                  />
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i + 4}
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                    className="h-10 bg-muted/50 rounded"
                  />
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="h-6 w-20 bg-muted/50 rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <motion.div
                      key={i + 8}
                      variants={pulseAnimation}
                      initial="initial"
                      animate="animate"
                      className="space-y-1"
                    >
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-muted/50 rounded" />
                        <div className="h-4 w-32 bg-muted/50 rounded" />
                      </div>
                      <div className="h-2 bg-muted rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              系统信息
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: DURATION.normal }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>刷新系统信息</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            关于您的计算机系统和软件环境的详细信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div variants={staggerChildren} className="grid gap-4">
            {/* 系统硬件信息 */}
            <motion.div
              variants={fadeInScale}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <Label className="text-muted-foreground">操作系统</Label>
                <div className="font-medium">{systemInfo.os}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">处理器</Label>
                <div className="font-medium">{systemInfo.processor}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">内存</Label>
                <div className="font-medium">{systemInfo.memory}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">显卡</Label>
                <div className="font-medium">{systemInfo.graphics}</div>
              </div>
            </motion.div>

            <Separator />

            {/* 软件平台信息 */}
            <motion.div
              variants={fadeInScale}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <Label className="text-muted-foreground">ASCOM 平台</Label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    版本 {systemInfo.ascomVersion}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                  >
                    已安装
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">INDIGO 平台</Label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {systemInfo.indigoInstalled ? "已安装" : "未安装"}
                  </span>
                  {systemInfo.indigoInstalled ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    >
                      已安装
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
                    >
                      未安装
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">INDI 库</Label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {systemInfo.indiInstalled ? "已安装" : "未安装"}
                  </span>
                  {systemInfo.indiInstalled ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    >
                      已安装
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
                    >
                      未安装
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">PHD2 指导</Label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    版本 {systemInfo.phd2Version}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                  >
                    已安装
                  </Badge>
                </div>
              </div>
            </motion.div>

            <Separator />

            {/* 存储信息 */}
            <motion.div variants={fadeInScale} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground">存储</Label>
                {lowStorageWarning && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <motion.div
                          animate={{
                            scale: shouldReduceMotion() ? 1 : [1, 1.1, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            repeatDelay: 2,
                            duration: 0.5,
                          }}
                        >
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Bell className="h-3 w-3" />
                            <span>存储空间不足</span>
                          </Badge>
                        </motion.div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>一个或多个驱动器存储空间不足</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">C: (系统)</span>
                    <span>
                      {systemInfo.storage.system.free} 可用, 共{" "}
                      {systemInfo.storage.system.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        systemInfo.storage.system.percentUsed > 90
                          ? "bg-red-500"
                          : systemInfo.storage.system.percentUsed > 70
                          ? "bg-amber-500"
                          : "bg-primary"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${systemInfo.storage.system.percentUsed}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">D: (数据)</span>
                    <span>
                      {systemInfo.storage.data.free} 可用, 共{" "}
                      {systemInfo.storage.data.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        systemInfo.storage.data.percentUsed > 90
                          ? "bg-red-500"
                          : systemInfo.storage.data.percentUsed > 70
                          ? "bg-amber-500"
                          : "bg-primary"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${systemInfo.storage.data.percentUsed}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 存储空间警告 */}
            <AnimatePresence>
              {lowStorageWarning && (
                <motion.div
                  variants={fadeInScale}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Alert
                    variant="destructive"
                    className="bg-red-500/10 border-red-500/30"
                  >
                    <Bell className="h-4 w-4" />
                    <AlertTitle>存储空间不足</AlertTitle>
                    <AlertDescription>
                      一个或多个驱动器存储空间不足。请清理不必要的文件以确保系统正常运行。
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleGenerateReport()}
          >
            <FileStack className="h-4 w-4 mr-2" />
            系统报告
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleCheckUpdates}>
            <Download className="h-4 w-4 mr-2" />
            检查更新
          </Button>
        </CardFooter>
      </Card>

      {/* 更新对话框 */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {updateComplete ? "更新完成" : "软件更新"}
            </DialogTitle>
            <DialogDescription>
              {updateComplete
                ? "所有组件已成功更新"
                : updating
                ? "正在更新系统组件..."
                : "检查并安装可用的软件更新"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {updateComplete ? (
              <motion.div
                className="flex flex-col items-center justify-center space-y-4 py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">更新已完成</h3>
                <p className="text-center text-muted-foreground">
                  所有组件已成功更新到最新版本
                </p>
              </motion.div>
            ) : updating ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>正在更新 ASCOM 平台...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <Progress value={updateProgress} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>下载完成</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>验证软件包</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {updateProgress > 50 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                    )}
                    <span>安装组件</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {updateProgress > 90 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Slash className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        updateProgress > 90 ? "" : "text-muted-foreground"
                      }
                    >
                      更新配置
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>可用更新</Label>
                  <div className="rounded-md border p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">ASCOM 平台</h4>
                        <p className="text-sm text-muted-foreground">
                          版本 {systemInfo.ascomVersion} → 6.6.0
                        </p>
                      </div>
                      <Badge>推荐</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">PHD2 指导</h4>
                        <p className="text-sm text-muted-foreground">
                          版本 {systemInfo.phd2Version} → 2.6.11
                        </p>
                      </div>
                      <Badge variant="secondary">可选</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>上次更新检查: 今天 10:23</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {updateComplete ? (
              <Button
                onClick={() => {
                  setShowUpdateDialog(false);
                  setUpdateComplete(false);
                  setUpdating(false);
                }}
              >
                完成
              </Button>
            ) : updating ? (
              <Button variant="outline" disabled>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                正在更新...
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateDialog(false)}
                >
                  稍后更新
                </Button>
                <Button onClick={handleUpdate}>立即更新</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 系统报告对话框 */}
      <Dialog open={showSystemReport} onOpenChange={setShowSystemReport}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>系统报告</DialogTitle>
            <DialogDescription>您的系统配置和状态的详细报告</DialogDescription>
          </DialogHeader>

          <div className="py-6 overflow-auto">
            {!reportGenerated ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-10 w-10 text-muted-foreground" />
                </motion.div>
                <p className="text-center text-muted-foreground">
                  正在生成系统报告，请稍候...
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <pre className="bg-muted p-4 rounded-md font-mono text-xs whitespace-pre-wrap overflow-auto max-h-[400px]">
                  {reportData}
                </pre>
              </motion.div>
            )}
          </div>

          <DialogFooter>
            {reportGenerated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSystemReport(false);
                    setReportGenerated(false);
                    setReportData(null);
                  }}
                >
                  关闭
                </Button>
                <Button>下载报告</Button>
              </>
            ) : (
              <Button variant="outline" disabled>
                生成中...
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
