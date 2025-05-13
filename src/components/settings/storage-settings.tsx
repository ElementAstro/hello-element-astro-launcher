"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/components/i18n";
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
  const { t } = useTranslations();
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
      setError(t("settings.storage.errors.clearCacheFailed"));
      // Corrected toast.error usage: toast.error(title, options)
      toast.error(t("settings.storage.toast.error.clearCache.title"), {
        description: t("settings.storage.toast.error.clearCache.description"),
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
      setError(t("settings.storage.errors.saveSettingsFailed"));
      // Corrected toast.error usage: toast.error(title, options)
      toast.error(t("settings.storage.toast.error.save.title"), {
        description: t("settings.storage.toast.error.save.description"),
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
    return <LoadingIndicator message={t("settings.storage.loading")} />;
  }

  if (error && !settings) {
    return (
      <ErrorState
        message={error}
        onRetry={() => setError(null)}
        title={t("settings.storage.errors.title")}
      />
    );
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
            {" "}
            <div>
              <CardTitle>{t("settings.storage.title")}</CardTitle>
              <CardDescription>
                {t("settings.storage.description")}
              </CardDescription>
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
                {" "}
                <div className="rounded-lg bg-muted/50 p-3">
                  <h4 className="text-sm font-medium mb-2">
                    {t("settings.storage.stats.downloads.title")}
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("settings.storage.stats.fileCount")}:
                    </span>
                    <span>{storageStats.downloads.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("settings.storage.stats.spaceUsed")}:
                    </span>
                    <span>{formatSize(storageStats.downloads.size)}</span>
                  </div>
                </div>{" "}
                <div className="rounded-lg bg-muted/50 p-3">
                  <h4 className="text-sm font-medium mb-2">
                    {t("settings.storage.stats.images.title")}
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("settings.storage.stats.fileCount")}:
                    </span>
                    <span>{storageStats.images.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("settings.storage.stats.spaceUsed")}:
                    </span>
                    <span>{formatSize(storageStats.images.size)}</span>
                  </div>
                </div>
              </div>{" "}
              <ProgressIndicator
                value={cacheUsagePercent}
                label={t("settings.storage.cacheUsage.label")}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  {formatSize(cacheUsage.used)} (
                  {t("settings.storage.cacheUsage.used")})
                </span>
                <span>
                  {formatSize(cacheUsage.total)} (
                  {t("settings.storage.cacheUsage.total")})
                </span>
              </div>
            </motion.div>{" "}
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="download-location">
                {t("settings.storage.downloadLocation.label")}
              </Label>
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
                  aria-label={t("settings.storage.downloadLocation.ariaLabel")}
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
                          aria-label={t(
                            "settings.storage.downloadLocation.browse.ariaLabel"
                          )}
                        >
                          <FolderOpen className="h-4 w-4 mr-1" />
                          {t("settings.storage.browse")}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>{" "}
                    <TooltipContent>
                      <p>{t("settings.storage.downloadLocation.tooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>{" "}
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="image-location">
                {t("settings.storage.imageLocation.label")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="image-location"
                  value={settings.storage.imageLocation}
                  onChange={(e) =>
                    onSettingChange("storage", "imageLocation", e.target.value)
                  }
                  className="flex-1"
                  aria-label={t("settings.storage.imageLocation.ariaLabel")}
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
                          aria-label={t(
                            "settings.storage.imageLocation.browse.ariaLabel"
                          )}
                        >
                          <FolderOpen className="h-4 w-4 mr-1" />
                          {t("settings.storage.browse")}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>{" "}
                    <TooltipContent>
                      <p>{t("settings.storage.imageLocation.tooltip")}</p>
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
              {" "}
              <div className="space-y-0.5">
                <Label htmlFor="clear-cache-automatically">
                  {t("settings.storage.autoClearCache.label")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.storage.autoClearCache.description")}
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
                  aria-label={t("settings.storage.autoClearCache.ariaLabel")}
                />
              </motion.div>
            </motion.div>
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>
            <motion.div variants={slideUp} className="space-y-2">
              {" "}
              <div className="flex justify-between">
                <Label htmlFor="cache-size-limit">
                  {t("settings.storage.cacheSizeLimit.label")}
                </Label>
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
                  aria-label={t("settings.storage.cacheSizeLimit.ariaLabel")}
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
              {" "}
              <Label htmlFor="backup-frequency">
                {t("settings.storage.backupFrequency.label")}
              </Label>
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
                <SelectTrigger
                  id="backup-frequency"
                  aria-label={t("settings.storage.backupFrequency.ariaLabel")}
                >
                  <SelectValue
                    placeholder={t(
                      "settings.storage.backupFrequency.placeholder"
                    )}
                  />
                </SelectTrigger>{" "}
                <SelectContent>
                  <SelectItem value="daily">
                    {t("settings.storage.backupFrequency.options.daily")}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t("settings.storage.backupFrequency.options.weekly")}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t("settings.storage.backupFrequency.options.monthly")}
                  </SelectItem>
                  <SelectItem value="never">
                    {t("settings.storage.backupFrequency.options.never")}
                  </SelectItem>
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
                {t("settings.storage.clearCache.button")}
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
                {showSuccess
                  ? t("settings.storage.save.success")
                  : t("settings.storage.save.button")}
              </span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
