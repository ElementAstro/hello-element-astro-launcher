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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Lock,
  Shield,
  BarChart,
  BugPlay,
  KeyRound,
  FileDigit,
  FileWarning,
  Calendar,
  Check, // Added Check import
} from "lucide-react";
import { type SettingsSectionProps, type Settings } from "./types"; // Added Settings import
import { AnimatedCard, ErrorState, LoadingIndicator } from "./ui-components";
import {
  slideUp,
  staggeredContainer,
  switchVariants,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // Removed unused DialogTrigger import
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function PrivacySettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [sensitiveChange, setSensitiveChange] = useState<{
    setting: keyof Settings["privacy"]; // Use specific key type
    value: boolean;
    applied: boolean;
  } | null>(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Handle privacy setting change
  // Removed unnecessary 'extends unknown'
  const handleSettingChange = <T extends number | boolean>(
    setting: keyof Settings["privacy"], // Use specific key type
    value: T,
    sensitive = false
  ) => {
    try {
      // For sensitive settings, show confirmation dialog
      if (sensitive) {
        setSensitiveChange({
          setting: setting,
          value: value as boolean,
          applied: false,
        });
        return;
      }

      // Apply setting change
      // Removed 'as any' assertion
      onSettingChange("privacy", setting, value);

      // Show feedback toast for important settings
      if (setting === "encryptLocalData") {
        const toastTitle = value ? "已启用数据加密" : "已禁用数据加密";
        const toastOptions = {
          description: value
            ? "您的本地数据现在将被加密存储。"
            : "您的本地数据将不再加密。这可能会降低安全性。",
        };
        if (value) {
          toast(toastTitle, toastOptions);
        } else {
          // Use toast.error for destructive actions or warnings if appropriate
          // Or keep standard toast if it's just an info message
          toast.warning(toastTitle, toastOptions); // Using warning as an example
        }
      }
    } catch {
      setError(`更改${setting}设置时出错`);
      // Use toast.error for errors
      toast.error("设置更新失败", {
        description: `无法更改${setting}设置，请重试。`,
      });
    }
  };

  // Apply sensitive setting change
  const applySensitiveChange = () => {
    if (!sensitiveChange) return;

    try {
      // Removed 'as any' assertion
      onSettingChange(
        "privacy",
        sensitiveChange.setting,
        sensitiveChange.value
      );

      setSensitiveChange({
        ...sensitiveChange,
        applied: true,
      });

      // Close dialog and show success message after a brief delay
      setTimeout(() => {
        setSensitiveChange(null);
        // Use toast(title, options) format
        toast("隐私设置已更新", {
          description: "您的隐私偏好已成功保存。",
        });
      }, 1500);
    } catch {
      setError(`更改${sensitiveChange.setting}设置时出错`);
      // Use toast.error for errors
      toast.error("设置更新失败", {
        description: `无法应用隐私设置更改，请重试。`,
      });
      setSensitiveChange(null);
    }
  };

  // Handle opening privacy policy
  const handleOpenPrivacyPolicy = () => {
    setPrivacyPolicyOpen(true);
  };

  if (isLoading) {
    return <LoadingIndicator message="加载隐私设置..." />;
  }

  // Ensure settings is checked before accessing its properties
  if (error && !settings) {
    // Assuming ErrorState component accepts a title prop
    return <ErrorState title="加载错误" message={error} onRetry={() => setError(null)} />;
  }

  // Ensure settings is available before rendering content
  if (!settings) {
     return <LoadingIndicator message="加载隐私设置..." />; // Or some other placeholder
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
                <CardTitle>隐私设置</CardTitle>
                <CardDescription>管理您的隐私和安全偏好</CardDescription>
              </div>
              <Shield className="h-6 w-6 text-muted-foreground" />
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
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="usage-stats">使用统计</Label>
                    <p className="text-sm text-muted-foreground">
                      共享匿名使用数据以帮助改进软件
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.privacy.shareUsageData ? "checked" : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="usage-stats"
                    checked={settings.privacy.shareUsageData}
                    onCheckedChange={(checked) =>
                      handleSettingChange("shareUsageData", checked)
                    }
                    aria-label="启用或禁用使用统计数据共享"
                  />
                </motion.div>
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
                    <BugPlay className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="error-reporting">错误报告</Label>
                    <p className="text-sm text-muted-foreground">
                      自动发送错误报告以帮助修复问题
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.privacy.errorReporting ? "checked" : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="error-reporting"
                    checked={settings.privacy.errorReporting}
                    onCheckedChange={(checked) =>
                      handleSettingChange("errorReporting", checked)
                    }
                    aria-label="启用或禁用错误报告"
                  />
                </motion.div>
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
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="remember-login">记住登录</Label>
                    <p className="text-sm text-muted-foreground">
                      在会话之间保持登录状态
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.privacy.rememberLogin ? "checked" : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="remember-login"
                    checked={settings.privacy.rememberLogin}
                    onCheckedChange={(checked) =>
                      handleSettingChange("rememberLogin", checked)
                    }
                    aria-label="启用或禁用记住登录"
                  />
                </motion.div>
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
                    <FileDigit className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="encrypt-data">加密本地数据</Label>
                    <p className="text-sm text-muted-foreground">
                      加密设备上存储的敏感数据
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={
                    settings.privacy.encryptLocalData ? "checked" : "unchecked"
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="encrypt-data"
                    checked={settings.privacy.encryptLocalData}
                    onCheckedChange={(checked) =>
                      handleSettingChange("encryptLocalData", checked, true)
                    }
                    aria-label="启用或禁用本地数据加密"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="data-retention">数据保留期</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {settings.privacy.dataRetentionPeriod} 天
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  <Slider
                    id="data-retention"
                    value={[settings.privacy.dataRetentionPeriod]}
                    min={30}
                    max={365}
                    step={30}
                    onValueChange={(value) =>
                      handleSettingChange("dataRetentionPeriod", value[0])
                    }
                    aria-label="调整数据保留期"
                  />
                </motion.div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30 天</span>
                  <span>1 年</span>
                </div>
              </motion.div>

              <motion.div
                variants={slideUp}
                className="mt-4 rounded-md bg-amber-50 dark:bg-amber-900/20 p-3 border border-amber-200 dark:border-amber-800"
              >
                <div className="flex space-x-2">
                  <FileWarning className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-medium">数据隐私提示</p>
                    <p className="mt-1">
                      您可以随时通过隐私设置控制您的数据。更改加密设置后，应用程序可能需要重新启动。
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button variant="outline" onClick={handleOpenPrivacyPolicy}>
                <Lock className="h-4 w-4 mr-2" />
                隐私政策
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </AnimatedCard>

      {/* 确认对话框 - 用于敏感设置更改 */}
      {sensitiveChange && (
        <Dialog
          open={!!sensitiveChange}
          onOpenChange={() =>
            !sensitiveChange?.applied && setSensitiveChange(null)
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认隐私设置更改</DialogTitle>
              <DialogDescription>
                您确定要{sensitiveChange.value ? "启用" : "禁用"}
                本地数据加密吗？
                {sensitiveChange.value
                  ? " 启用加密将提高安全性，但可能会略微降低性能。"
                  : " 禁用加密将使您的数据更容易被访问，可能会降低安全性。"}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                {sensitiveChange.value
                  ? "加密后，您的本地数据将受到保护，未经授权的用户将无法访问。"
                  : "禁用加密后，您的本地数据将以未加密的形式存储。"}
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button
                onClick={applySensitiveChange}
                variant={sensitiveChange.value ? "default" : "destructive"}
              >
                {sensitiveChange.applied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                {sensitiveChange.applied
                  ? "已应用"
                  : `确认${sensitiveChange.value ? "启用" : "禁用"}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 隐私政策对话框 */}
      <Dialog open={privacyPolicyOpen} onOpenChange={setPrivacyPolicyOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>隐私政策</DialogTitle>
            <DialogDescription>
              我们如何收集、使用和保护您的数据
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-6 -mr-6">
            <div className="space-y-4 py-4 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-medium">信息收集</h3>
                <p className="mt-2 text-muted-foreground">
                  我们收集的信息类型取决于您在应用程序中启用的设置。当您启用使用统计时，
                  我们会收集匿名使用数据，包括功能使用频率、会话时长和系统规格。错误报告包括
                  应用程序崩溃信息、错误日志和相关的系统信息。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-medium">信息使用</h3>
                <p className="mt-2 text-muted-foreground">
                  我们使用收集的信息来改进应用程序功能、修复错误和提升用户体验。
                  匿名统计数据帮助我们了解哪些功能最受欢迎，以及如何更好地分配开发资源。
                  错误报告直接帮助我们识别和解决应用程序中的问题。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-medium">数据存储和保护</h3>
                <p className="mt-2 text-muted-foreground">
                  当启用本地数据加密时，存储在您设备上的所有敏感信息将使用高级加密标准（AES-256）进行加密。
                  这包括用户凭据、连接设置和其他个人信息。传输中的数据始终使用SSL/TLS加密。
                  数据保留期设置控制自动删除旧数据之前的时间长度。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-medium">您的控制权</h3>
                <p className="mt-2 text-muted-foreground">
                  您可以随时通过此隐私设置面板调整数据收集和存储选项。禁用使用统计和错误报告将
                  完全停止相关数据的收集。您可以请求删除我们存储的所有数据，方法是联系我们的
                  支持团队或使用应用程序中的&quot;删除我的数据&quot;功能。
                </p>
              </motion.div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>我已阅读并理解</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
