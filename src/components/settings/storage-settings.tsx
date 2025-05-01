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
import { Slider } from "@/components/ui/slider";
import {
  HardDrive,
  FolderOpen,
  Save,
  Trash,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SettingsSectionProps } from "./types";
import {
  AnimatedCard,
  ErrorState,
  LoadingIndicator,
  ProgressIndicator,
} from "./ui-components";
import {
  slideUp,
  staggeredContainer,
  switchVariants,
  TRANSITION_DURATION,
} from "./animation-constants"; // Removed unused fadeIn
import { toast } from "sonner";

export function StorageSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cacheUsage, setCacheUsage] = useState<{ used: number; total: number }>(
    { used: 0, total: 0 }
  );
  const [storageStats, setStorageStats] = useState<{
    downloads: { count: number; size: number };
    images: { count: number; size: number };
  }>({
    downloads: { count: 0, size: 0 },
    images: { count: 0, size: 0 },
  });
  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);

    // Simulate fetching storage stats
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Set simulated statistics for cache and storage usage
      setCacheUsage({
        used: Math.random() * settings.storage.cacheSizeLimit * 0.8,
        total: settings.storage.cacheSizeLimit,
      });

      setStorageStats({
        downloads: {
          count: Math.floor(Math.random() * 120) + 30,
          size: Math.random() * 15 + 5, // GB
        },
        images: {
          count: Math.floor(Math.random() * 500) + 100,
          size: Math.random() * 25 + 10, // GB
        },
      });
    }, 900);

    return () => clearTimeout(timer);
  }, [settings.storage.cacheSizeLimit]);

  // Handle path selection (simulating file dialog)
  const handleBrowse = (type: "downloadLocation" | "imageLocation") => {
    // In a real application, this would open a file dialog
    // Here we'll simulate selecting a path
    const simulatedPaths = {
      downloadLocation: "D:\\StarAtlas\\Downloads",
      imageLocation: "D:\\StarAtlas\\Images",
    };

    // Corrected toast usage: toast(title, options)
    toast("已选择文件夹", {
      description: `已设置${
        type === "downloadLocation" ? "下载" : "图像"
      }位置为: ${simulatedPaths[type]}`,
    });

    onSettingChange("storage", type, simulatedPaths[type]);
  };

  // Handle cache clearing
  const handleClearCache = async () => {
    setIsClearingCache(true);

    try {
      // Simulate cache clearing operation with progress
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      // Update cache usage after clearing
      setCacheUsage((prev) => ({ ...prev, used: 0 }));

      // Corrected toast usage: toast(title, options)
      toast("缓存已清除", {
        description: "所有临时文件已被成功清除",
        action: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </motion.div>
        ),
      });
    } catch {
      // Renamed unused variable
      setError("清除缓存时出错");
      // Corrected toast.error usage: toast.error(title, options)
      toast.error("清除失败", {
        description: "无法清除缓存文件，请重试",
      });
    } finally {
      setIsClearingCache(false);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      // Simulate saving operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Corrected toast usage: toast(title, options)
      toast("设置已保存", {
        description: "您的存储设置已成功更新",
      });
    } catch {
      // Renamed unused variable
      setError("保存设置时出错");
      // Corrected toast.error usage: toast.error(title, options)
      toast.error("保存失败", {
        description: "无法保存存储设置，请重试",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format bytes to human-readable size
  const formatSize = (sizeInGB: number) => {
    return sizeInGB.toFixed(1) + " GB";
  };

  if (isLoading) {
    return <LoadingIndicator message="加载存储设置..." />;
  }

  if (error && !settings) {
    return <ErrorState message={error} onRetry={() => setError(null)} />;
  }

  const cacheUsagePercent = (cacheUsage.used / cacheUsage.total) * 100;

  return (
    <AnimatedCard>
      <Card>
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between"
          >
            <div>
              <CardTitle>存储设置</CardTitle>
              <CardDescription>管理存储位置和偏好设置</CardDescription>
            </div>
            <HardDrive className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            {/* Storage Statistics */}
            <motion.div variants={slideUp} className="mb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="rounded-lg bg-muted/50 p-3">
                  <h4 className="text-sm font-medium mb-2">下载统计</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">文件数量:</span>
                    <span>{storageStats.downloads.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">占用空间:</span>
                    <span>{formatSize(storageStats.downloads.size)}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <h4 className="text-sm font-medium mb-2">图像统计</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">文件数量:</span>
                    <span>{storageStats.images.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">占用空间:</span>
                    <span>{formatSize(storageStats.images.size)}</span>
                  </div>
                </div>
              </div>

              <ProgressIndicator
                value={cacheUsagePercent}
                label="当前缓存使用"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatSize(cacheUsage.used)} (已使用)</span>
                <span>{formatSize(cacheUsage.total)} (总计)</span>
              </div>
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="download-location">默认下载位置</Label>
              <div className="flex gap-2">
                <Input
                  id="download-location"
                  value={settings.storage.downloadLocation}
                  onChange={(e) =>
                    onSettingChange(
                      "storage",
                      "downloadLocation",
                      e.target.value
                    )
                  }
                  className="flex-1"
                  aria-label="默认下载位置"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: TRANSITION_DURATION.fast }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleBrowse("downloadLocation")}
                          aria-label="浏览下载位置"
                        >
                          <FolderOpen className="h-4 w-4 mr-1" />
                          浏览
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>选择下载文件的保存位置</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="image-location">图像存储位置</Label>
              <div className="flex gap-2">
                <Input
                  id="image-location"
                  value={settings.storage.imageLocation}
                  onChange={(e) =>
                    onSettingChange("storage", "imageLocation", e.target.value)
                  }
                  className="flex-1"
                  aria-label="图像存储位置"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: TRANSITION_DURATION.fast }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleBrowse("imageLocation")}
                          aria-label="浏览图像位置"
                        >
                          <FolderOpen className="h-4 w-4 mr-1" />
                          浏览
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>选择图像文件的保存位置</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor="clear-cache-automatically">自动清理缓存</Label>
                <p className="text-sm text-muted-foreground">
                  定期清理临时文件和缓存
                </p>
              </div>
              <motion.div
                variants={switchVariants}
                initial="unchecked"
                animate={
                  settings.storage.clearCacheAutomatically
                    ? "checked"
                    : "unchecked"
                }
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="clear-cache-automatically"
                  checked={settings.storage.clearCacheAutomatically}
                  onCheckedChange={(checked) =>
                    onSettingChange(
                      "storage",
                      "clearCacheAutomatically",
                      checked
                    )
                  }
                  aria-label="启用或禁用自动清理缓存"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="cache-size-limit">缓存大小限制</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.storage.cacheSizeLimit} GB
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Slider
                  id="cache-size-limit"
                  value={[settings.storage.cacheSizeLimit]}
                  min={0.5}
                  max={5}
                  step={0.5}
                  onValueChange={(value) =>
                    onSettingChange("storage", "cacheSizeLimit", value[0])
                  }
                  aria-label="调整缓存大小限制"
                />
              </motion.div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>500 MB</span>
                <span>5 GB</span>
              </div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="backup-frequency">备份频率</Label>
              <Select
                value={settings.storage.backupFrequency}
                onValueChange={(value) =>
                  onSettingChange(
                    "storage",
                    "backupFrequency",
                    value as "daily" | "weekly" | "monthly" | "never"
                  )
                }
              >
                <SelectTrigger id="backup-frequency" aria-label="选择备份频率">
                  <SelectValue placeholder="选择频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                  <SelectItem value="never">从不</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <motion.div
            whileHover={{ scale: isClearingCache ? 1 : 1.02 }}
            whileTap={{ scale: isClearingCache ? 1 : 0.98 }}
            transition={{ duration: TRANSITION_DURATION.fast }}
          >
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearingCache}
              className="relative"
            >
              {isClearingCache ? (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </motion.span>
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              <span className={isClearingCache ? "opacity-0" : "opacity-100"}>
                立即清除缓存
              </span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
            transition={{ duration: TRANSITION_DURATION.fast }}
          >
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="relative"
            >
              {isSaving ? (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </motion.span>
              ) : showSuccess ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              <span className={isSaving ? "opacity-0" : "opacity-100"}>
                {showSuccess ? "已保存" : "保存更改"}
              </span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
