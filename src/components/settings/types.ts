// Types for update frequencies
export type UpdateFrequency = "startup" | "daily" | "weekly" | "monthly" | "never"
export type Theme = "light" | "dark" | "system" | "red-night"
export type DateFormat = "mdy" | "dmy" | "ymd"
export type TimeFormat = "12h" | "24h"
export type TemperatureUnit = "celsius" | "fahrenheit"
export type DistanceUnit = "metric" | "imperial"
export type LogLevel = "error" | "warning" | "info" | "debug" | "verbose"

// Settings section interfaces
export interface IGeneralSettings {
  startOnBoot: boolean
  checkForUpdates: boolean
  updateFrequency: UpdateFrequency
  showTooltips: boolean
  confirmBeforeClosing: boolean
  autoConnectEquipment: boolean
  defaultApps: {
    imaging: string
    planetarium: string
    guiding: string
  }
}

export interface IAppearanceSettings {
  theme: Theme
  fontSize: number
  redNightMode: boolean
  compactView: boolean
  showStatusBar: boolean
  animationsEnabled: boolean
}

export interface IAccountSettings {
  name: string
  email: string
  organization?: string
}

export interface INotificationSettings {
  softwareUpdates: boolean
  equipmentEvents: boolean
  downloadCompletion: boolean
  systemAlerts: boolean
  sessionReminders: boolean
  soundEffects: boolean
}

export interface IStorageSettings {
  downloadLocation: string
  imageLocation: string
  clearCacheAutomatically: boolean
  cacheSizeLimit: number
  backupFrequency: "daily" | "weekly" | "monthly" | "never"
}

export interface IPrivacySettings {
  shareUsageData: boolean
  errorReporting: boolean
  rememberLogin: boolean
  encryptLocalData: boolean
  dataRetentionPeriod: number
}

export interface ILanguageSettings {
  appLanguage: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  temperatureUnit: TemperatureUnit
  distanceUnit: DistanceUnit
}

export interface IAdvancedSettings {
  debugMode: boolean
  logLevel: LogLevel
  experimentalFeatures: boolean
  apiEndpoints: Record<string, string>
}

// Combined settings type
export interface Settings {
  general: IGeneralSettings
  appearance: IAppearanceSettings
  account: IAccountSettings
  notifications: INotificationSettings
  storage: IStorageSettings
  privacy: IPrivacySettings
  language: ILanguageSettings
  advanced: IAdvancedSettings
}

// Props for settings section components
export interface SettingsSectionProps {
  settings: Settings
  onSettingChange: <K extends keyof Settings, S extends keyof Settings[K]>(
    category: K,
    setting: S,
    value: Settings[K][S]
  ) => void
}