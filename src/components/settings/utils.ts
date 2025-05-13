import type { Settings } from "./types";

/**
 * Type guard to check if a settings object conforms to our Settings interface
 */
export function isValidSettings(settings: unknown): settings is Settings {
  if (!settings || typeof settings !== "object") return false;

  const requiredCategories = [
    "general",
    "appearance",
    "account",
    "notifications",
    "storage",
    "privacy",
    "language",
    "advanced",
  ];

  // Check if all required categories exist
  for (const category of requiredCategories) {
    if (!(category in settings)) return false;
  }

  const s = settings as Settings;

  // Check general settings
  if (
    typeof s.general.startOnBoot !== "boolean" ||
    typeof s.general.checkForUpdates !== "boolean" ||
    typeof s.general.showTooltips !== "boolean" ||
    typeof s.general.confirmBeforeClosing !== "boolean" ||
    typeof s.general.autoConnectEquipment !== "boolean" ||
    !s.general.defaultApps ||
    typeof s.general.defaultApps.imaging !== "string" ||
    typeof s.general.defaultApps.planetarium !== "string" ||
    typeof s.general.defaultApps.guiding !== "string"
  )
    return false;

  // Check appearance settings
  if (
    !["light", "dark", "system", "red-night"].includes(s.appearance.theme) ||
    typeof s.appearance.fontSize !== "number" ||
    typeof s.appearance.redNightMode !== "boolean" ||
    typeof s.appearance.compactView !== "boolean" ||
    typeof s.appearance.showStatusBar !== "boolean" ||
    typeof s.appearance.animationsEnabled !== "boolean"
  )
    return false;

  // You can add more specific checks for other settings categories as needed

  return true;
}

/**
 * Safely cast unknown settings to our Settings type
 * Throws an error if the settings object is invalid
 */
export function assertSettings(settings: unknown): Settings {
  if (!isValidSettings(settings)) {
    throw new Error("Invalid settings object");
  }
  return settings;
}

/**
 * Safe version of settings type assertion that provides a default value
 */
export function getSettingsWithDefaults(settings: unknown): Settings {
  if (isValidSettings(settings)) return settings;

  // Return default settings if the provided settings are invalid
  return {
    general: {
      startOnBoot: false,
      checkForUpdates: true,
      updateFrequency: "weekly",
      showTooltips: true,
      confirmBeforeClosing: true,
      autoConnectEquipment: false,
      defaultApps: {
        imaging: "nina",
        planetarium: "stellarium",
        guiding: "phd2",
      },
    },
    appearance: {
      theme: "system",
      fontSize: 2,
      redNightMode: false,
      compactView: false,
      showStatusBar: true,
      animationsEnabled: true,
    },
    account: {
      name: "",
      email: "",
      organization: "",
      status: "active"
    },
    notifications: {
      softwareUpdates: true,
      equipmentEvents: true,
      downloadCompletion: true,
      systemAlerts: true,
      sessionReminders: true,
      soundEffects: true,
    },
    storage: {
      downloadLocation: "",
      imageLocation: "",
      clearCacheAutomatically: true,
      cacheSizeLimit: 2,
      backupFrequency: "weekly",
    },
    privacy: {
      shareUsageData: true,
      errorReporting: true,
      rememberLogin: true,
      encryptLocalData: true,
      dataRetentionPeriod: 90,
    },
    language: {
      appLanguage: "en",
      dateFormat: "mdy",
      timeFormat: "12h",
      temperatureUnit: "celsius",
      distanceUnit: "metric",
    },
    advanced: {
      debugMode: false,
      logLevel: "error",
      experimentalFeatures: false,
      apiEndpoints: {},
    },
  };
}
