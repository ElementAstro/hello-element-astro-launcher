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
import { useTranslations } from "@/components/i18n";

export function LanguageSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const { t } = useTranslations();
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
        setError(t("settings.language.errors.loadFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguageSettings();
  }, [onSettingChange, t]);

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
          en: t("settings.language.languageNames.en"),
          fr: t("settings.language.languageNames.fr"),
          de: t("settings.language.languageNames.de"),
          es: t("settings.language.languageNames.es"),
          it: t("settings.language.languageNames.it"),
          zh: t("settings.language.languageNames.zh"),
          ja: t("settings.language.languageNames.ja"),
        };

        toast(
          t("settings.language.notifications.languageChanged", {
            params: { language: languageNames[value as string] || value },
          }),
          {
            description: t("settings.language.notifications.restartRequired"),
          }
        );
      }
    } catch {
      setError(
        t("settings.language.errors.updateFailed", { params: { setting } })
      );
      toast.error(t("settings.language.notifications.updateFailed.title"), {
        description: t(
          "settings.language.notifications.updateFailed.description",
          { params: { setting } }
        ),
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

      toast(t("settings.language.notifications.settingsApplied.title"), {
        description: t(
          "settings.language.notifications.settingsApplied.description"
        ),
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
      setError(t("settings.language.errors.applyFailed"));
      toast.error(t("settings.language.notifications.applyFailed.title"), {
        description: t(
          "settings.language.notifications.applyFailed.description"
        ),
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message={t("settings.language.loading")} />;
  }

  if (error && !settings) {
    return (
      <ErrorState
        title={t("settings.language.errors.loadErrorTitle")}
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
              <CardTitle>{t("settings.language.title")}</CardTitle>
              <CardDescription>
                {t("settings.language.description")}
              </CardDescription>
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
                <Label htmlFor="app-language">
                  {t("settings.language.appLanguage")}
                </Label>
                <div className="text-sm text-muted-foreground">
                  {settings.language.appLanguage === "en"
                    ? t("settings.language.languageNames.en")
                    : settings.language.appLanguage === "fr"
                    ? t("settings.language.languageNames.fr")
                    : settings.language.appLanguage === "de"
                    ? t("settings.language.languageNames.de")
                    : settings.language.appLanguage === "es"
                    ? t("settings.language.languageNames.es")
                    : settings.language.appLanguage === "it"
                    ? t("settings.language.languageNames.it")
                    : settings.language.appLanguage === "zh"
                    ? t("settings.language.languageNames.zh")
                    : settings.language.appLanguage === "ja"
                    ? t("settings.language.languageNames.ja")
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
                    aria-label={t("settings.language.selectAppLanguage")}
                  >
                    <SelectValue
                      placeholder={t("settings.language.selectLanguage")}
                    />
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
                        <SelectItem value="en">
                          {t("settings.language.languageNames.en")}
                        </SelectItem>
                        <SelectItem value="fr">
                          {t("settings.language.languageNames.fr")}
                        </SelectItem>
                        <SelectItem value="de">
                          {t("settings.language.languageNames.de")}
                        </SelectItem>
                        <SelectItem value="es">
                          {t("settings.language.languageNames.es")}
                        </SelectItem>
                        <SelectItem value="it">
                          {t("settings.language.languageNames.it")}
                        </SelectItem>
                        <SelectItem value="zh">
                          {t("settings.language.languageNames.zh")}
                        </SelectItem>
                        <SelectItem value="ja">
                          {t("settings.language.languageNames.ja")}
                        </SelectItem>
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
                  <Label htmlFor="date-format">
                    {t("settings.language.dateFormat")}
                  </Label>
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
                  <SelectTrigger
                    id="date-format"
                    aria-label={t("settings.language.selectDateFormat")}
                  >
                    <SelectValue
                      placeholder={t("settings.language.selectDateFormat")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">
                      {t("settings.language.dateFormats.mdy")}
                    </SelectItem>
                    <SelectItem value="dmy">
                      {t("settings.language.dateFormats.dmy")}
                    </SelectItem>
                    <SelectItem value="ymd">
                      {t("settings.language.dateFormats.ymd")}
                    </SelectItem>
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
                  <Label htmlFor="time-format">
                    {t("settings.language.timeFormat")}
                  </Label>
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
                  <SelectTrigger
                    id="time-format"
                    aria-label={t("settings.language.selectTimeFormat")}
                  >
                    <SelectValue
                      placeholder={t("settings.language.selectTimeFormat")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">
                      {t("settings.language.timeFormats.12h")}
                    </SelectItem>
                    <SelectItem value="24h">
                      {t("settings.language.timeFormats.24h")}
                    </SelectItem>
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
                  <Label htmlFor="temperature-unit">
                    {t("settings.language.temperatureUnit")}
                  </Label>
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
                    aria-label={t("settings.language.selectTemperatureUnit")}
                  >
                    <SelectValue
                      placeholder={t("settings.language.selectTemperatureUnit")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">
                      {t("settings.language.temperatureUnits.celsius")}
                    </SelectItem>
                    <SelectItem value="fahrenheit">
                      {t("settings.language.temperatureUnits.fahrenheit")}
                    </SelectItem>
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
                  <Label htmlFor="distance-unit">
                    {t("settings.language.distanceUnit")}
                  </Label>
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
                  <SelectTrigger
                    id="distance-unit"
                    aria-label={t("settings.language.selectDistanceUnit")}
                  >
                    <SelectValue
                      placeholder={t("settings.language.selectDistanceUnit")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">
                      {t("settings.language.distanceUnits.metric")}
                    </SelectItem>
                    <SelectItem value="imperial">
                      {t("settings.language.distanceUnits.imperial")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <div className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-700 dark:text-blue-300">
                <p>{t("settings.language.restartNotice")}</p>
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
                {t("settings.language.applyButton")}
              </motion.span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
