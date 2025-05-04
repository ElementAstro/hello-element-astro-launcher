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
  Download,
  Upload,
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
import {
  slideUp,
  staggeredContainer,
  switchVariants,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";
// 导入 API 服务
import { advancedApi } from "./settings-api";

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
  const [systemLogs, setSystemLogs] = useState<
    { timestamp: string; level: string; message: string }[]
  >([]);
  const [importFile, setImportFile] = useState<File | null>(null);

  // API 端点的本地副本，用于编辑
  const [localEndpoints, setLocalEndpoints] = useState<Record<string, string>>(
    JSON.parse(JSON.stringify(settings.advanced.apiEndpoints || {}))
  );

  // 从 API 加载高级设置
  useEffect(() => {
    const fetchAdvancedSettings = async () => {
      setIsLoading(true);
      try {
        // 获取高级设置
        const advancedData = await advancedApi.getAdvancedSettings();

        // 更新父组件中的设置
        Object.entries(advancedData).forEach(([key, value]) => {
          const settingKey = key as keyof typeof settings.advanced;
          // Type guard to ensure value matches expected types
          if (
            typeof value === "boolean" ||
            (typeof value === "object" && value !== null) ||
            ["error", "warning", "info", "debug", "verbose"].includes(
              value as string
            )
          ) {
            onSettingChange(
              "advanced",
              settingKey,
              value as boolean | Record<string, string> | LogLevel
            );
          }
        });

        // 获取系统日志
        const logs = await advancedApi.getSystemLogs(
          settings.advanced.logLevel
        );
        setSystemLogs(logs);
      } catch (err) {
        console.error("Error loading advanced settings:", err);
        setError("无法加载高级设置，请稍后重试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvancedSettings();
  }, [onSettingChange, settings, settings.advanced.logLevel]);

  // 当设置变更时重置本地端点
  useEffect(() => {
    setLocalEndpoints(
      JSON.parse(JSON.stringify(settings.advanced.apiEndpoints || {}))
    );
  }, [settings.advanced.apiEndpoints]);

  // 处理高级设置变更
  const handleSettingChange = async <
    T extends boolean | Record<string, string> | LogLevel
  >(
    setting: keyof typeof settings.advanced,
    value: T
  ) => {
    try {
      // 更新本地状态
      onSettingChange("advanced", setting, value);

      // 发送更新到 API
      await advancedApi.updateAdvancedSettings({
        ...settings.advanced,
        [setting]: value,
      });

      if (setting === "debugMode") {
        toast(value ? "已启用调试模式" : "已禁用调试模式", {
          description: value
            ? "现在将显示详细的调试信息。这可能会影响性能。"
            : "不再显示详细的调试信息。",
        });
      } else if (setting === "experimentalFeatures") {
        toast(value ? "已启用实验性功能" : "已禁用实验性功能", {
          description: value
            ? "已启用实验性功能。这些功能可能不稳定。"
            : "已禁用实验性功能。",
        });
      }

      // 如果日志级别改变，重新获取日志
      if (setting === "logLevel") {
        try {
          const logs = await advancedApi.getSystemLogs(value as LogLevel);
          setSystemLogs(logs);
        } catch (err) {
          console.error("Error fetching logs:", err);
        }
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      const errorMessage = `更改${setting}设置时出错`;
      setError(errorMessage);
      toast.error("设置更新失败", {
        description: `无法更改${setting}设置，请重试。`,
      });
    }
  };

  // 处理端点变更
  const handleEndpointChange = (key: string, value: string) => {
    setLocalEndpoints((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 添加新端点
  const addEndpoint = async () => {
    if (!newEndpointName.trim()) {
      toast.error("无效的端点名称", {
        description: "请输入有效的端点名称。",
      });
      return;
    }

    if (!newEndpointUrl.trim()) {
      toast.error("无效的端点 URL", {
        description: "请输入有效的端点 URL。",
      });
      return;
    }

    // 检查是否有重复
    if (localEndpoints[newEndpointName]) {
      toast.error("端点已存在", {
        description: "具有该名称的端点已存在。请使用不同的名称。",
      });
      return;
    }

    // 添加新端点到本地状态
    const updatedEndpoints = {
      ...localEndpoints,
      [newEndpointName]: newEndpointUrl,
    };

    setLocalEndpoints(updatedEndpoints);

    try {
      // 发送更新到 API
      await advancedApi.updateAdvancedSettings({
        ...settings.advanced,
        apiEndpoints: updatedEndpoints,
      });

      // 更新父组件中的设置
      onSettingChange("advanced", "apiEndpoints", updatedEndpoints);

      setNewEndpointName("");
      setNewEndpointUrl("");
      setShowAddForm(false);

      toast.success("已添加新端点", {
        description: `已添加端点: ${newEndpointName}`,
      });
    } catch (err) {
      console.error("Error adding endpoint:", err);
      toast.error("添加端点失败", {
        description: "无法添加新端点，请重试。",
      });
    }
  };

  // 删除端点
  const confirmDeleteEndpoint = (key: string) => {
    setEndpointToDelete(key);
    setShowDeleteConfirm(true);
  };

  const deleteEndpoint = async () => {
    if (!endpointToDelete) return;

    const updatedEndpoints = Object.fromEntries(
      Object.entries(localEndpoints).filter(([key]) => key !== endpointToDelete)
    );

    try {
      // 发送更新到 API
      await advancedApi.updateAdvancedSettings({
        ...settings.advanced,
        apiEndpoints: updatedEndpoints,
      });

      // 更新本地状态
      setLocalEndpoints(updatedEndpoints);

      // 更新父组件中的设置
      onSettingChange("advanced", "apiEndpoints", updatedEndpoints);

      setShowDeleteConfirm(false);
      setEndpointToDelete(null);

      toast.success("已删除端点", {
        description: `端点 ${endpointToDelete} 已成功删除。`,
      });
    } catch (err) {
      console.error("Error deleting endpoint:", err);
      toast.error("删除端点失败", {
        description: "无法删除端点，请重试。",
      });
    }
  };

  // 应用高级设置
  const applySettings = async () => {
    setIsApplying(true);

    try {
      // 应用所有高级设置，包括 API 端点
      await advancedApi.updateAdvancedSettings({
        ...settings.advanced,
        apiEndpoints: localEndpoints,
      });

      // 更新父组件中的设置
      onSettingChange("advanced", "apiEndpoints", localEndpoints);

      setShowSuccess(true);

      toast.success("已应用高级设置", {
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

      // 一段时间后重置成功状态
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        "应用高级设置时出错: " +
        (error instanceof Error ? error.message : "未知错误");
      setError(errorMessage);
      toast.error("设置应用失败", {
        description: "无法应用高级设置，请重试。",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // 重置为默认值
  const resetToDefaults = async () => {
    setIsResetting(true);

    try {
      // 调用 API 重置所有设置
      const defaultSettings = await advancedApi.resetToDefaults();

      // 更新父组件中的高级设置
      Object.entries(defaultSettings.advanced).forEach(([key, value]) => {
        onSettingChange(
          "advanced",
          key as keyof typeof settings.advanced,
          value
        );
      });

      // 更新本地端点
      setLocalEndpoints(defaultSettings.advanced.apiEndpoints || {});

      setShowResetConfirm(false);

      toast.success("已重置为默认设置", {
        description: "所有高级设置已重置为默认值。",
      });
    } catch (error: unknown) {
      const errorMessage =
        "重置设置时出错: " +
        (error instanceof Error ? error.message : "未知错误");
      setError(errorMessage);
      toast.error("重置失败", {
        description: "无法重置为默认设置，请重试。",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // 导出设置
  const exportSettings = async () => {
    try {
      const blob = await advancedApi.exportSettings();

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `launcher-settings-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("设置已导出", {
        description: "您的设置已成功导出为 JSON 文件。",
      });
    } catch (err) {
      console.error("Error exporting settings:", err);
      toast.error("导出设置失败", {
        description: "无法导出您的设置，请重试。",
      });
    }
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  // 导入设置
  const importSettings = async () => {
    if (!importFile) {
      toast.error("未选择文件", {
        description: "请选择有效的设置文件进行导入。",
      });
      return;
    }

    try {
      const importedSettings = await advancedApi.importSettings(importFile);

      // 更新父组件中的所有设置
      Object.entries(importedSettings).forEach(([section, sectionSettings]) => {
        if (section === "advanced") {
          // Handle advanced settings with known types
          Object.entries(sectionSettings as Record<string, unknown>).forEach(
            ([key, value]) => {
              const settingKey = key as keyof typeof settings.advanced;
              if (
                typeof value === "boolean" ||
                (typeof value === "object" && value !== null) ||
                ["error", "warning", "info", "debug", "verbose"].includes(
                  value as string
                )
              ) {
                onSettingChange(
                  "advanced",
                  settingKey,
                  value as boolean | Record<string, string> | LogLevel
                );
              }
            }
          );
        }
      });

      // 更新本地端点，确保类型安全
      const apiEndpoints = importedSettings.advanced?.apiEndpoints;
      if (apiEndpoints && typeof apiEndpoints === "object") {
        setLocalEndpoints(apiEndpoints as Record<string, string>);
      } else {
        setLocalEndpoints({});
      }

      // 重置文件选择
      setImportFile(null);
      const fileInput = document.getElementById(
        "settings-import-file"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast.success("设置已导入", {
        description: "您的设置已成功导入并应用。",
      });
    } catch (err) {
      console.error("Error importing settings:", err);
      toast.error("导入设置失败", {
        description: "无法导入设置，请确保文件格式正确。",
      });
    }
  };

  // 获取日志级别的可读名称
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
                  <Select
                    value={settings.advanced.logLevel}
                    onValueChange={(value: LogLevel) =>
                      handleSettingChange("logLevel", value)
                    }
                  >
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

                {/* 显示系统日志预览 */}
                {systemLogs.length > 0 && (
                  <div className="mt-3 border rounded-md p-2">
                    <Label className="text-xs mb-1 block">最近的系统日志</Label>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 max-h-[150px] overflow-y-auto text-xs font-mono">
                      {systemLogs.slice(0, 5).map((log, index) => (
                        <div
                          key={index}
                          className={`mb-1 ${
                            log.level === "error"
                              ? "text-red-500"
                              : log.level === "warning"
                              ? "text-amber-500"
                              : log.level === "debug"
                              ? "text-blue-500"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          [{log.timestamp}] [{log.level.toUpperCase()}]{" "}
                          {log.message}
                        </div>
                      ))}
                      {systemLogs.length > 5 && (
                        <div className="text-center text-gray-500 mt-1">
                          ...还有 {systemLogs.length - 5} 条日志
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                          custom={index + 3}
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

              {/* 导入/导出设置 */}
              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <Label>导入/导出设置</Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportSettings}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    导出设置
                  </Button>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input
                        id="settings-import-file"
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        aria-label="选择设置文件导入"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        选择文件
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      disabled={!importFile}
                      onClick={importSettings}
                    >
                      导入
                    </Button>
                  </div>
                </div>

                {importFile && (
                  <div className="text-sm text-muted-foreground">
                    已选择文件: {importFile.name}
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-1">
                  导出设置以备份或在另一台设备上导入。导入设置将覆盖所有现有设置。
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
                className="relative min-w-[130px]"
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
                <motion.span
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
                className="relative min-w-[160px]"
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
                <motion.span
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
