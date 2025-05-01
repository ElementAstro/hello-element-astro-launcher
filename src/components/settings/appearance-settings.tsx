"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { type SettingsSectionProps, type Theme, type Settings } from "./types"; // Assuming Settings type is also in types
import {
  AnimatedCard,
  LoadingIndicator,
  ErrorState,
  StatusBadge,
} from "./ui-components";
import {
  slideUp,
  staggeredContainer,
  switchVariants,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";

export function AppearanceSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeChange = (value: Theme) => {
    try {
      setSaveStatus("saving");
      onSettingChange("appearance", "theme", value);

      // Simulate successful save with delay
      setTimeout(() => {
        setSaveStatus("success");
        // Use toast(title, options) format
        toast("主题已更新", {
          description: "您的显示主题已成功更改。",
        });
        // Reset status after showing success
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 500);
    } catch {
      // Use _err as err is not used
      setSaveStatus("error");
      setError("更改主题时出错");
      // Use toast.error(title, options) format for errors
      toast.error("设置更新失败", {
        description: "无法更改主题，请重试。",
        // Removed unsupported 'variant' property
      });
    }
  };

  // Removed unnecessary 'extends unknown'
  const handleSettingChange = <
    T extends Settings["appearance"][K],
    K extends keyof Settings["appearance"]
  >(
    setting: K,
    value: T
  ) => {
    try {
      setSaveStatus("saving");
      // Removed 'as any' assertion - ensure onSettingChange type is correct
      onSettingChange("appearance", setting, value);

      setTimeout(() => {
        setSaveStatus("success");
        // Reset status after showing success
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 300);
    } catch {
      // Use _err as err is not used
      setSaveStatus("error");
      setError(`更改${setting}设置时出错`);
      // Use toast.error(title, options) format for errors
      toast.error("设置更新失败", {
        description: `无法更新${setting}设置，请重试。`,
        // Removed unsupported 'variant' property
      });
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="加载外观设置..." />;
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
    <AnimatedCard>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CardTitle>外观</CardTitle>
              <CardDescription>自定义应用程序的外观和感觉</CardDescription>
            </motion.div>

            {saveStatus === "saving" && (
              <StatusBadge status="info" message="保存中..." />
            )}
            {saveStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center text-green-600 dark:text-green-400"
              >
                <Check className="w-4 h-4 mr-1" />
                <span className="text-sm">已保存</span>
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="theme-selection">主题</Label>
              <div className="flex items-center gap-4">
                <RadioGroup
                  id="theme-selection"
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleThemeChange(value as Theme)}
                  className="flex flex-wrap gap-2"
                  aria-label="选择应用主题"
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: TRANSITION_DURATION.fast }}
                  >
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-1">
                      <Sun className="h-4 w-4" />
                      亮色
                    </Label>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: TRANSITION_DURATION.fast }}
                  >
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-1">
                      <Moon className="h-4 w-4" />
                      暗色
                    </Label>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: TRANSITION_DURATION.fast }}
                  >
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">跟随系统</Label>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: TRANSITION_DURATION.fast }}
                  >
                    <RadioGroupItem value="red-night" id="red-night" />
                    <Label
                      htmlFor="red-night"
                      className="flex items-center gap-1"
                    >
                      <Palette className="h-4 w-4" />
                      红色夜间
                    </Label>
                  </motion.div>
                </RadioGroup>

                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>

            {/* Wrap Separator in motion.div instead of using component prop */}
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size-slider">字体大小</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.appearance.fontSize === 1
                    ? "小"
                    : settings.appearance.fontSize === 2
                    ? "中"
                    : settings.appearance.fontSize === 3
                    ? "大"
                    : settings.appearance.fontSize === 4
                    ? "特大"
                    : "超大"}
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Slider
                  id="font-size-slider"
                  aria-label="调整字体大小"
                  value={[settings.appearance.fontSize]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) =>
                    handleSettingChange("fontSize", value[0])
                  }
                  className="cursor-pointer"
                />
              </motion.div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>小</span>
                <span>大</span>
              </div>
            </motion.div>

            {/* Wrap Separator in motion.div */}
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor="red-night-mode">红色夜间模式</Label>
                <p className="text-sm text-muted-foreground">
                  使用红色配色方案以保护夜视能力
                </p>
              </div>
              <motion.div
                variants={switchVariants}
                initial="unchecked"
                animate={
                  settings.appearance.redNightMode ? "checked" : "unchecked"
                }
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="red-night-mode"
                  checked={settings.appearance.redNightMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("redNightMode", checked)
                  }
                  aria-label="启用或禁用红色夜间模式"
                />
              </motion.div>
            </motion.div>

            {/* Wrap Separator in motion.div */}
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">紧凑视图</Label>
                <p className="text-sm text-muted-foreground">
                  使用更紧凑的布局以在屏幕上显示更多内容
                </p>
              </div>
              <motion.div
                variants={switchVariants}
                initial="unchecked"
                animate={
                  settings.appearance.compactView ? "checked" : "unchecked"
                }
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="compact-view"
                  checked={settings.appearance.compactView}
                  onCheckedChange={(checked) =>
                    handleSettingChange("compactView", checked)
                  }
                  aria-label="启用或禁用紧凑视图"
                />
              </motion.div>
            </motion.div>

            {/* Wrap Separator in motion.div */}
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor="show-status-bar">显示状态栏</Label>
                <p className="text-sm text-muted-foreground">
                  在窗口底部显示状态信息
                </p>
              </div>
              <motion.div
                variants={switchVariants}
                initial="unchecked"
                animate={
                  settings.appearance.showStatusBar ? "checked" : "unchecked"
                }
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="show-status-bar"
                  checked={settings.appearance.showStatusBar}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showStatusBar", checked)
                  }
                  aria-label="启用或禁用状态栏"
                />
              </motion.div>
            </motion.div>

            {/* Wrap Separator in motion.div */}
            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor="enable-animations">启用动画</Label>
                <p className="text-sm text-muted-foreground">
                  为转场和效果使用动画
                </p>
              </div>
              <motion.div
                variants={switchVariants}
                initial="unchecked"
                animate={
                  settings.appearance.animationsEnabled
                    ? "checked"
                    : "unchecked"
                }
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="enable-animations"
                  checked={settings.appearance.animationsEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("animationsEnabled", checked)
                  }
                  aria-label="启用或禁用动画效果"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
