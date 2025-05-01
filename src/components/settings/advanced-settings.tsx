"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings2,
  Bug,
  Terminal,
  Beaker,
  Globe,
  RotateCcw,
  Check,
  Trash2,
  Plus,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type SettingsSectionProps, type LogLevel } from "./types";
import { AnimatedCard, LoadingIndicator, ErrorState } from "./ui-components";
// Removed unused fadeIn import
import {
  slideUp,
  staggeredContainer,
  switchVariants,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";

export function AdvancedSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Deep copy of API endpoints for local editing
  const [localEndpoints, setLocalEndpoints] = useState<Record<string, string>>(
    JSON.parse(JSON.stringify(settings.advanced.apiEndpoints || {}))
  );

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Reset local endpoints when settings change
  useEffect(() => {
    setLocalEndpoints(
      JSON.parse(JSON.stringify(settings.advanced.apiEndpoints || {}))
    );
  }, [settings.advanced.apiEndpoints]);

  // Handle advanced setting change
  // Removed unnecessary 'extends unknown'
  const handleSettingChange = <
    T extends boolean | Record<string, string> | LogLevel
  >(
    setting: keyof typeof settings.advanced,
    value: T
  ) => {
    try {
      // Removed 'as any' assertion
      onSettingChange("advanced", setting, value);

      if (setting === "debugMode") {
        // Fixed toast call format
        toast(value ? "已启用调试模式" : "已禁用调试模式", {
          description: value
            ? "现在将显示详细的调试信息。这可能会影响性能。"
            : "不再显示详细的调试信息。",
        });
      } else if (setting === "experimentalFeatures") {
        // Fixed toast call format
        toast(value ? "已启用实验性功能" : "已禁用实验性功能", {
          description: value
            ? "已启用实验性功能。这些功能可能不稳定。"
            : "已禁用实验性功能。",
        });
      }
    } catch {
      // Renamed unused variable
      const errorMessage = `更改${setting}设置时出错`;
      setError(errorMessage);
      // Fixed toast call format
      toast("设置更新失败", {
        // Removed unsupported 'variant' property from options object
        description: `无法更改${setting}设置，请重试。`,
      });
    }
  };

  // Handle endpoint change
  const handleEndpointChange = (key: string, value: string) => {
    setLocalEndpoints((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Add new endpoint
  const addEndpoint = () => {
    if (!newEndpointName.trim()) {
      // Fixed toast call format
      toast("无效的端点名称", {
        // Removed unsupported 'variant' property from options object
        description: "请输入有效的端点名称。",
      });
      return;
    }

    if (!newEndpointUrl.trim()) {
      // Fixed toast call format
      toast("无效的端点 URL", {
        // Removed unsupported 'variant' property from options object
        description: "请输入有效的端点 URL。",
      });
      return;
    }

    // Check for duplicates
    if (localEndpoints[newEndpointName]) {
      // Fixed toast call format
      toast("端点已存在", {
        // Removed unsupported 'variant' property from options object
        description: "具有该名称的端点已存在。请使用不同的名称。",
      });
      return;
    }

    // Add new endpoint to local state
    const updatedEndpoints = {
      ...localEndpoints,
      [newEndpointName]: newEndpointUrl,
    };

    setLocalEndpoints(updatedEndpoints);
    setNewEndpointName("");
    setNewEndpointUrl("");
    setShowAddForm(false);

    // Fixed toast call format
    toast("已添加新端点", {
      description: `已添加端点: ${newEndpointName}`,
    });
  };

  // Delete endpoint
  const confirmDeleteEndpoint = (key: string) => {
    setEndpointToDelete(key);
    setShowDeleteConfirm(true);
  };

  const deleteEndpoint = () => {
    if (!endpointToDelete) return;

    const rest = Object.fromEntries(
      Object.entries(localEndpoints).filter(([key]) => key !== endpointToDelete)
    );
    setLocalEndpoints(rest);
    setShowDeleteConfirm(false);
    setEndpointToDelete(null);

    // Fixed toast call format
    toast("已删除端点", {
      description: `端点 ${endpointToDelete} 已成功删除。`,
    });
  };

  // Apply advanced settings
  const applySettings = async () => {
    setIsApplying(true);

    try {
      // Apply API endpoints
      onSettingChange("advanced", "apiEndpoints", localEndpoints);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setShowSuccess(true);

      // Fixed toast call format
      toast("已应用高级设置", {
        description: "您的高级设置已成功更新。",
        action: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Check className="h-5 w-5 text-green-500" />
          </motion.div>
        ),
      });

      // Reset success state after a delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        "应用高级设置时出错: " +
        (error instanceof Error ? error.message : "未知错误");
      setError(errorMessage);
      // Fixed toast call format
      toast("设置应用失败", {
        // Removed unsupported 'variant' property from options object
        description: "无法应用高级设置，请重试。",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    setIsResetting(true);

    try {
      // Simulate reset
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset debug mode
      onSettingChange("advanced", "debugMode", false);

      // Reset log level
      onSettingChange("advanced", "logLevel", "info");

      // Reset experimental features
      onSettingChange("advanced", "experimentalFeatures", false);

      // Reset API endpoints to defaults
      const defaultEndpoints = {
        main: "https://api.example.com/v1",
        backup: "https://backup-api.example.com/v1",
      };

      onSettingChange("advanced", "apiEndpoints", defaultEndpoints);
      setLocalEndpoints(defaultEndpoints);

      setShowResetConfirm(false);

      // Fixed toast call format
      toast("已重置为默认设置", {
        description: "所有高级设置已重置为默认值。",
      });
    } catch (error: unknown) {
      const errorMessage =
        "重置设置时出错: " +
        (error instanceof Error ? error.message : "未知错误");
      setError(errorMessage);
      // Fixed toast call format
      toast("重置失败", {
        // Removed unsupported 'variant' property from options object
        description: "无法重置为默认设置，请重试。",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Get human-readable log level
  const getLogLevelText = (level: LogLevel): string => {
    const names: Record<LogLevel, string> = {
      error: "错误",
      warning: "警告",
      info: "信息",
      debug: "调试",
      verbose: "详细",
    };
    return names[level] || level;
  };

  if (isLoading) {
    return <LoadingIndicator message="加载高级设置..." />;
  }

  if (error && !settings) {
    // Pass title to ErrorState if needed, or adjust ErrorState component
    return (
      <ErrorState
        title="加载错误"
        message={error}
        onRetry={() => setError(null)}
      />
    );
  }

  return (
    <>
      <AnimatedCard>
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-start"
            >
              <div>
                <CardTitle>高级设置</CardTitle>
                <CardDescription>为高级用户配置高级选项</CardDescription>
              </div>
              <Settings2 className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={staggeredContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div
                variants={slideUp}
                className="flex items-center justify-between"
              >
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <Bug className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">调试模式</Label>
                    <p className="text-sm text-muted-foreground">
                      启用详细日志记录和调试工具
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.advanced.debugMode ? "checked" : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="debug-mode"
                    checked={settings.advanced.debugMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("debugMode", checked)
                    }
                    aria-label="启用或禁用调试模式"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    {/* Label now correctly points to SelectTrigger via id */}
                    <Label htmlFor="log-level">日志级别</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getLogLevelText(settings.advanced.logLevel)}
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  {/* Removed id from Select component */}
                  <Select
                    value={settings.advanced.logLevel}
                    onValueChange={(value: LogLevel) =>
                      handleSettingChange("logLevel", value)
                    }
                  >
                    {/* Added id to SelectTrigger for Label association */}
                    <SelectTrigger id="log-level" aria-label="选择日志级别">
                      <SelectValue placeholder="选择日志级别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">错误</SelectItem>
                      <SelectItem value="warning">警告</SelectItem>
                      <SelectItem value="info">信息</SelectItem>
                      <SelectItem value="debug">调试</SelectItem>
                      <SelectItem value="verbose">详细</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {settings.advanced.logLevel === "debug" ||
                settings.advanced.logLevel === "verbose" ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 rounded-md bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-300"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        较高的日志级别会生成大量日志数据，可能会影响性能并占用磁盘空间。
                      </span>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div
                variants={slideUp}
                className="flex items-center justify-between"
              >
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <Beaker className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="experimental-features">实验性功能</Label>
                    <p className="text-sm text-muted-foreground">
                      启用仍在开发中的实验性功能
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.advanced.experimentalFeatures
                      ? "checked"
                      : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="experimental-features"
                    checked={settings.advanced.experimentalFeatures}
                    onCheckedChange={(checked) =>
                      handleSettingChange("experimentalFeatures", checked)
                    }
                    aria-label="启用或禁用实验性功能"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label>API 端点</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加端点
                  </Button>
                </div>

                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 p-3 border rounded-md mb-3"
                  >
                    <Label htmlFor="endpoint-name">名称</Label>
                    <Input
                      id="endpoint-name"
                      value={newEndpointName}
                      onChange={(e) => setNewEndpointName(e.target.value)}
                      placeholder="端点名称"
                      className="mb-2"
                    />
                    <Label htmlFor="endpoint-url">URL</Label>
                    <Input
                      id="endpoint-url"
                      value={newEndpointUrl}
                      onChange={(e) => setNewEndpointUrl(e.target.value)}
                      placeholder="https://api.example.com"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewEndpointName("");
                          setNewEndpointUrl("");
                        }}
                      >
                        取消
                      </Button>
                      <Button size="sm" onClick={addEndpoint}>
                        添加
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {Object.entries(localEndpoints).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center p-4 text-sm text-muted-foreground"
                    >
                      没有配置的 API 端点
                    </motion.div>
                  ) : (
                    Object.entries(localEndpoints).map(
                      ([key, value], index) => (
                        <motion.div
                          key={key}
                          className="flex gap-2 items-center"
                          variants={slideUp}
                          custom={index + 3} // Adjust custom prop if needed based on slideUp definition
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Input
                            value={key}
                            className="w-1/3"
                            readOnly
                            aria-label={`端点名称 ${key}`}
                          />
                          <Input
                            value={value}
                            className="flex-1"
                            onChange={(e) =>
                              handleEndpointChange(key, e.target.value)
                            }
                            aria-label={`端点 URL ${key}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteEndpoint(key)}
                            className="flex-shrink-0"
                            aria-label={`删除端点 ${key}`}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                          </Button>
                        </motion.div>
                      )
                    )
                  )}
                </div>
              </motion.div>

              {settings.advanced.experimentalFeatures && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      <p className="font-medium">警告：已启用实验性功能</p>
                      <p className="mt-1">
                        实验性功能可能不稳定，并可能导致应用程序行为异常或数据丢失。请谨慎使用。
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div
              whileHover={{ scale: isResetting ? 1 : 1.02 }}
              whileTap={{ scale: isResetting ? 1 : 0.98 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(true)}
                disabled={isResetting}
                className="relative min-w-[130px]" // Added min-width
              >
                {isResetting ? (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </motion.span>
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                <motion.span // Added motion span
                  initial={false}
                  animate={{ opacity: isResetting ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  重置为默认值
                </motion.span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: isApplying ? 1 : 1.02 }}
              whileTap={{ scale: isApplying ? 1 : 0.98 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button
                onClick={applySettings}
                disabled={isApplying}
                className="relative min-w-[160px]" // Added min-width
              >
                {isApplying ? (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </motion.span>
                ) : showSuccess ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Settings2 className="h-4 w-4 mr-2" />
                )}
                <motion.span // Added motion span
                  initial={false}
                  animate={{ opacity: isApplying ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {showSuccess ? "已应用" : "应用高级设置"}
                </motion.span>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </AnimatedCard>

      {/* 重置确认对话框 */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重置为默认设置</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将重置所有高级设置为默认值。这将删除所有自定义 API
              端点和其他高级配置。此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={resetToDefaults}>
              继续重置
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除端点确认对话框 */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除端点</AlertDialogTitle>
            <AlertDialogDescription>
              {/* Escaped quotes */}
              您确定要删除端点 &quot;{endpointToDelete}&quot;
              吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEndpoint}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
