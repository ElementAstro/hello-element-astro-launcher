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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Languages,
  Check,
  CalendarDays,
  Clock,
  Thermometer,
  Ruler,
} from "lucide-react";
import {
  type SettingsSectionProps,
  type DateFormat,
  type TimeFormat,
  type TemperatureUnit,
  type DistanceUnit,
  type Settings,
} from "./types";
import { AnimatedCard, LoadingIndicator, ErrorState } from "./ui-components";
import {
  slideUp,
  staggeredContainer,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";
// 导入 API 服务
import { languageApi } from "./settings-api";

export function LanguageSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<
    { code: string; name: string }[]
  >([]);

  // 当前日期和时间预览
  const currentDate = new Date();

  // 从 API 加载语言设置和可用语言列表
  useEffect(() => {
    const fetchLanguageSettings = async () => {
      setIsLoading(true);
      try {
        // 获取语言设置
        const languageData = await languageApi.getLanguageSettings();

        // 更新父组件中的设置
        Object.entries(languageData).forEach(([key, value]) => {
          onSettingChange(
            "language",
            key as keyof Settings["language"],
            value as Settings["language"][keyof Settings["language"]]
          );
        });

        // 获取可用语言列表
        const languages = await languageApi.getAvailableLanguages();
        setAvailableLanguages(languages);
      } catch (err) {
        console.error("Error loading language settings:", err);
        setError("无法加载语言设置，请稍后重试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguageSettings();
  }, [onSettingChange]);

  // 基于选定格式的格式示例
  const getDateFormatExample = (format: DateFormat): string => {
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    switch (format) {
      case "mdy":
        return `${month}/${day}/${year}`;
      case "dmy":
        return `${day}/${month}/${year}`;
      case "ymd":
        return `${year}/${month}/${day}`;
    }
  };

  const getTimeFormatExample = (format: TimeFormat): string => {
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    if (format === "12h") {
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
  };

  const getTemperatureExample = (unit: TemperatureUnit): string => {
    // 示例温度 22°C / 71.6°F
    return unit === "celsius" ? "22°C" : "71.6°F";
  };

  const getDistanceExample = (unit: DistanceUnit): string => {
    // 示例距离
    return unit === "metric" ? "10 km / 100 m" : "6.2 mi / 328 ft";
  };

  // 处理语言设置更改
  const handleSettingChange = async <K extends keyof Settings["language"]>(
    setting: K,
    value: Settings["language"][K]
  ) => {
    try {
      // 更新本地状态
      onSettingChange("language", setting, value);

      // 将更改发送到 API
      await languageApi.updateLanguageSettings({
        ...settings.language,
        [setting]: value,
      });

      // 更改语言时显示预览提示
      if (setting === "appLanguage") {
        const languageNames: Record<string, string> = {
          en: "英语",
          fr: "法语",
          de: "德语",
          es: "西班牙语",
          it: "意大利语",
          zh: "中文",
          ja: "日语",
        };

        toast(`语言已更改为${languageNames[value as string] || value}`, {
          description: "需要重新启动应用程序以应用所有更改。",
        });
      }
    } catch {
      setError(`更改${setting}设置时出错`);
      toast.error("设置更新失败", {
        description: `无法更改${setting}设置，请重试。`,
      });
    }
  };

  // 应用所有语言设置
  const applySettings = async () => {
    setIsApplying(true);

    try {
      // 将所有语言设置保存到 API
      await languageApi.updateLanguageSettings(settings.language);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      toast("语言设置已应用", {
        description: "您的语言和本地化偏好已更新。",
        action: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Check className="h-5 w-5 text-green-500" />
          </motion.div>
        ),
      });
    } catch {
      setError("应用语言设置时出错");
      toast.error("设置应用失败", {
        description: "无法应用语言设置，请重试。",
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="加载语言设置..." />;
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
              <CardTitle>语言设置</CardTitle>
              <CardDescription>管理语言和本地化偏好</CardDescription>
            </div>
            <Languages className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="app-language">应用程序语言</Label>
                <div className="text-sm text-muted-foreground">
                  {settings.language.appLanguage === "en"
                    ? "English"
                    : settings.language.appLanguage === "fr"
                    ? "Français"
                    : settings.language.appLanguage === "de"
                    ? "Deutsch"
                    : settings.language.appLanguage === "es"
                    ? "Español"
                    : settings.language.appLanguage === "it"
                    ? "Italiano"
                    : settings.language.appLanguage === "zh"
                    ? "中文"
                    : settings.language.appLanguage === "ja"
                    ? "日本語"
                    : settings.language.appLanguage}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Select
                  value={settings.language.appLanguage}
                  onValueChange={(value) =>
                    handleSettingChange("appLanguage", value)
                  }
                >
                  <SelectTrigger
                    id="app-language"
                    aria-label="选择应用程序语言"
                  >
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.length > 0 ? (
                      availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="date-format">日期格式</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDateFormatExample(settings.language.dateFormat)}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Select
                  value={settings.language.dateFormat}
                  onValueChange={(value: DateFormat) =>
                    handleSettingChange("dateFormat", value)
                  }
                >
                  <SelectTrigger id="date-format" aria-label="选择日期格式">
                    <SelectValue placeholder="选择日期格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY (月/日/年)</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY (日/月/年)</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD (年/月/日)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="time-format">时间格式</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTimeFormatExample(settings.language.timeFormat)}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Select
                  value={settings.language.timeFormat}
                  onValueChange={(value: TimeFormat) =>
                    handleSettingChange("timeFormat", value)
                  }
                >
                  <SelectTrigger id="time-format" aria-label="选择时间格式">
                    <SelectValue placeholder="选择时间格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12小时制 (上午/下午)</SelectItem>
                    <SelectItem value="24h">24小时制</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="temperature-unit">温度单位</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTemperatureExample(settings.language.temperatureUnit)}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Select
                  value={settings.language.temperatureUnit}
                  onValueChange={(value: TemperatureUnit) =>
                    handleSettingChange("temperatureUnit", value)
                  }
                >
                  <SelectTrigger
                    id="temperature-unit"
                    aria-label="选择温度单位"
                  >
                    <SelectValue placeholder="选择温度单位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">摄氏度 (°C)</SelectItem>
                    <SelectItem value="fahrenheit">华氏度 (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            <motion.div variants={slideUp}>
              <Separator />
            </motion.div>

            <motion.div variants={slideUp} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="distance-unit">距离单位</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDistanceExample(settings.language.distanceUnit)}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: TRANSITION_DURATION.fast }}
              >
                <Select
                  value={settings.language.distanceUnit}
                  onValueChange={(value: DistanceUnit) =>
                    handleSettingChange("distanceUnit", value)
                  }
                >
                  <SelectTrigger id="distance-unit" aria-label="选择距离单位">
                    <SelectValue placeholder="选择距离单位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">公制 (千米、米)</SelectItem>
                    <SelectItem value="imperial">英制 (英里、英尺)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <div className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-700 dark:text-blue-300">
                <p>某些设置可能需要重新启动应用程序才能完全生效。</p>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            whileHover={{ scale: isApplying ? 1 : 1.02 }}
            whileTap={{ scale: isApplying ? 1 : 0.98 }}
            transition={{ duration: TRANSITION_DURATION.fast }}
          >
            <Button
              onClick={applySettings}
              disabled={isApplying}
              className="relative min-w-[150px]"
            >
              {isApplying ? (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Languages className="h-4 w-4 animate-pulse" />
                </motion.span>
              ) : showSuccess ? (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.span>
              ) : (
                <Languages className="h-4 w-4 mr-2" />
              )}
              <motion.span
                initial={false}
                animate={{ opacity: isApplying || showSuccess ? 0 : 1 }}
                transition={{ duration: 0.1 }}
              >
                应用语言设置
              </motion.span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
