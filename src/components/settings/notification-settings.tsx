"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/components/i18n";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Volume2,
  Download,
  AlertCircle,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SettingsSectionProps, type Settings } from "./types"; // Added Settings import
import { AnimatedCard, LoadingIndicator, ErrorState } from "./ui-components";
import {
  slideUp,
  switchVariants,
  staggeredContainer,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";

// Type for notification update status tracking
type NotificationUpdateStatus = Record<
  keyof Settings["notifications"],
  "idle" | "updating" | "success" | "error"
>; // Use Settings["notifications"]

// Icons for each notification type
const notificationIcons: Record<
  keyof Settings["notifications"],
  React.ElementType
> = {
  // Use Settings["notifications"] and React.ElementType
  softwareUpdates: RefreshCw,
  equipmentEvents: Bell,
  downloadCompletion: Download,
  systemAlerts: AlertCircle,
  sessionReminders: Calendar,
  soundEffects: Volume2,
};

export function NotificationSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  // Initialize status based on Settings["notifications"] keys
  const [updateStatus, setUpdateStatus] = useState<NotificationUpdateStatus>(
    () =>
      Object.keys(notificationIcons).reduce((acc, key) => {
        acc[key as keyof Settings["notifications"]] = "idle";
        return acc;
      }, {} as NotificationUpdateStatus)
  );

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Handle notification setting change
  const handleNotificationChange = async (
    setting: keyof Settings["notifications"], // Use Settings["notifications"]
    checked: boolean
  ) => {
    try {
      // Set status to updating
      setUpdateStatus((prev) => ({ ...prev, [setting]: "updating" }));

      // Apply the change
      onSettingChange("notifications", setting, checked); // Show toast notification if in test mode
      if (testMode && checked) {
        const notificationTypes = {
          softwareUpdates: {
            title: t("settings.notifications.test.softwareUpdates.title"),
            description: t(
              "settings.notifications.test.softwareUpdates.description"
            ),
          },
          equipmentEvents: {
            title: t("settings.notifications.test.equipmentEvents.title"),
            description: t(
              "settings.notifications.test.equipmentEvents.description"
            ),
          },
          downloadCompletion: {
            title: t("settings.notifications.test.downloadCompletion.title"),
            description: t(
              "settings.notifications.test.downloadCompletion.description"
            ),
          },
          systemAlerts: {
            title: t("settings.notifications.test.systemAlerts.title"),
            description: t(
              "settings.notifications.test.systemAlerts.description"
            ),
          },
          sessionReminders: {
            title: t("settings.notifications.test.sessionReminders.title"),
            description: t(
              "settings.notifications.test.sessionReminders.description"
            ),
          },
          soundEffects: {
            title: t("settings.notifications.test.soundEffects.title"),
            description: t(
              "settings.notifications.test.soundEffects.description"
            ),
          },
        };

        const notification = notificationTypes[setting];
        const IconComponent = notificationIcons[setting]; // Assign component to a variable        // Correct toast usage: toast(title, options)
        toast(
          `${t("settings.notifications.test.prefix")} ${notification.title}`,
          {
            description: notification.description,
            icon: IconComponent ? (
              <IconComponent className="h-5 w-5" /> // Use the variable
            ) : undefined,
          }
        );
      }

      // Simulate a delay in processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update to success state
      setUpdateStatus((prev) => ({ ...prev, [setting]: "success" }));

      // Reset to idle after showing success
      setTimeout(() => {
        setUpdateStatus((prev) => ({ ...prev, [setting]: "idle" }));
      }, 1500);
    } catch {
      setUpdateStatus((prev) => ({ ...prev, [setting]: "error" }));
      setError(
        t("settings.notifications.errors.updateFailed", {
          params: { setting: String(setting) },
        })
      );

      // Correct toast.error usage: toast.error(title, options)
      toast.error(
        t("settings.notifications.notifications.updateFailed.title"),
        {
          description: t(
            "settings.notifications.notifications.updateFailed.description",
            { params: { setting: String(setting) } }
          ),
        }
      );

      // Reset to idle state after error
      setTimeout(() => {
        setUpdateStatus((prev) => ({ ...prev, [setting]: "idle" }));
      }, 3000);
    }
  };
  // Handle test mode toggle
  const toggleTestMode = () => {
    const newTestMode = !testMode;
    setTestMode(newTestMode);
    // Correct toast usage: toast(title, options)
    toast(
      newTestMode
        ? t("settings.notifications.testMode.enabled")
        : t("settings.notifications.testMode.disabled"),
      {
        description: newTestMode
          ? t("settings.notifications.testMode.enabledDescription")
          : t("settings.notifications.testMode.disabledDescription"),
      }
    );
  };
  if (isLoading) {
    return <LoadingIndicator message={t("settings.notifications.loading")} />;
  }

  // Ensure settings is checked before accessing its properties
  if (error && !settings) {
    return (
      <ErrorState
        title={t("settings.notifications.errors.loadingError")}
        message={error}
        onRetry={() => setError(null)}
      />
    ); // Added title prop
  }

  // Helper function to render notification setting with animation
  const renderNotificationSetting = (
    key: keyof Settings["notifications"], // Use Settings["notifications"]
    label: string,
    description: string,
    // Removed unused icon parameter
    index: number
  ) => {
    // Ensure settings is available before accessing properties
    if (!settings) return null;

    const status = updateStatus[key];
    const Icon = notificationIcons[key]; // Get the component type

    return (
      <React.Fragment key={key}>
        {" "}
        {/* Use React.Fragment with key */}
        <motion.div
          variants={slideUp}
          custom={index}
          className="space-y-4" // Apply space-y here if needed between items
        >
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <div className="mt-1 text-muted-foreground">
                {Icon && <Icon className="h-5 w-5" />}{" "}
                {/* Render the Icon component */}
              </div>
              <div className="space-y-0.5">
                <Label htmlFor={`notification-${key}`}>{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <motion.div
              variants={switchVariants}
              initial="unchecked"
              animate={settings.notifications[key] ? "checked" : "unchecked"}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Switch
                id={`notification-${key}`}
                checked={settings.notifications[key]}
                onCheckedChange={(checked) =>
                  handleNotificationChange(key, checked)
                }
                aria-label={t("settings.notifications.toggleAriaLabel", {
                  params: { label },
                })}
                disabled={status === "updating"}
                className={
                  status === "error" ? "border-red-500 ring-offset-red-500" : ""
                } // Use border/ring for error indication
              />
              {status === "updating" && (
                <motion.div
                  className="absolute -right-6 top-0 flex h-full items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
        {/* Wrap Separator in motion.div */}
        {index < Object.keys(settings.notifications).length - 1 && (
          <motion.div variants={slideUp} custom={index + 0.5}>
            <Separator />
          </motion.div>
        )}
      </React.Fragment>
    );
  };
  // Ensure settings is available before rendering content
  if (!settings) {
    return <LoadingIndicator message={t("settings.notifications.loading")} />; // Or some other placeholder
  }

  return (
    <AnimatedCard>
      <Card>
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            {" "}
            <div>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>
                {t("settings.notifications.description")}
              </CardDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTestMode}
                className={
                  testMode
                    ? "border-blue-500 text-blue-500 hover:bg-blue-500/10"
                    : ""
                } // Added hover style
              >
                {testMode
                  ? t("settings.notifications.testMode.disable")
                  : t("settings.notifications.testMode.enable")}
              </Button>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="show"
            className="space-y-4" // Apply spacing between items here
          >
            {/* Removed the icon element argument from calls */}
            {renderNotificationSetting(
              "softwareUpdates",
              t("settings.notifications.softwareUpdates.label"),
              t("settings.notifications.softwareUpdates.description"),
              0
            )}

            {renderNotificationSetting(
              "equipmentEvents",
              t("settings.notifications.equipmentEvents.label"),
              t("settings.notifications.equipmentEvents.description"),
              1
            )}

            {renderNotificationSetting(
              "downloadCompletion",
              t("settings.notifications.downloadCompletion.label"),
              t("settings.notifications.downloadCompletion.description"),
              2
            )}

            {renderNotificationSetting(
              "systemAlerts",
              t("settings.notifications.systemAlerts.label"),
              t("settings.notifications.systemAlerts.description"),
              3
            )}

            {renderNotificationSetting(
              "sessionReminders",
              t("settings.notifications.sessionReminders.label"),
              t("settings.notifications.sessionReminders.description"),
              4
            )}

            {renderNotificationSetting(
              "soundEffects",
              t("settings.notifications.soundEffects.label"),
              t("settings.notifications.soundEffects.description"),
              5
            )}

            {testMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/30 p-3"
              >
                {" "}
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t("settings.notifications.testMode.infoText")}
                </p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
