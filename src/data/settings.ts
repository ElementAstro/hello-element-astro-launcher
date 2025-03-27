export const DEFAULT_USER_SETTINGS = {
  general: {
    startOnBoot: false,
    checkForUpdates: true,
    updateFrequency: "daily" as const,
    showTooltips: true,
    defaultApps: {
      imaging: "nina",
      planetarium: "stellarium",
      guiding: "phd2",
    },
  },
  appearance: {
    theme: "system" as const,
    fontSize: 2,
    redNightMode: false,
    compactView: false,
  },
  account: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  notifications: {
    softwareUpdates: true,
    equipmentEvents: true,
    downloadCompletion: true,
    systemAlerts: true,
  },
  storage: {
    downloadLocation: "C:\\Users\\John\\Downloads\\Astronomy",
    imageLocation: "D:\\AstroImages",
    clearCacheAutomatically: true,
    cacheSizeLimit: 1,
  },
  privacy: {
    shareUsageData: true,
    errorReporting: true,
    rememberLogin: true,
  },
  language: {
    appLanguage: "en",
    dateFormat: "mdy" as const,
    timeFormat: "12h" as const,
  },
};
