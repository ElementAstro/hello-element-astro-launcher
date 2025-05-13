// Software types
export interface Software {
  systemRequirements: ArrayLike<unknown> | { [s: string]: unknown; };
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  actionLabel: string;
  featured: boolean;
  downloads: number;
  lastUpdated: string;
  version: string;
  size: string;
  developer: string;
  website: string;
  installed: boolean;
  defaultInstallPath?: string;
  dependencies?: { name: string; version: string; required: boolean; }[];
  tags?: string[];
  rating?: number;
  releaseNotes?: string;
  releaseDate?: string;
  verified?: boolean;
  license?: string;
}

// Download types
export interface DownloadItem {
  id: number;
  name: string;
  version: string;
  size: string;
  icon: string;
  category: string;
  status: "downloading" | "paused" | "completed" | "error" | "waiting" | "verification" | "processing";
  progress: number;
  date: string;
  estimatedTimeRemaining?: string;
  speed?: string;
  url?: string;
  checksum?: string;
}

// Equipment types
export interface EquipmentItem {
  id: number;
  name: string;
  type: string;
  status: "Connected" | "Disconnected";
  driver: string;
  details?: Record<string, string>;
  lastConnected?: string;
  connectionType?: "USB" | "Network" | "Serial" | "Bluetooth";
  firmwareVersion?: string;
}

// System information
export interface SystemInfo {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  ascomVersion: string;
  indigoInstalled: boolean;
  indiInstalled: boolean;
  phd2Version: string;
  storage: {
    system: {
      total: string;
      free: string;
      percentUsed: number;
    };
    data: {
      total: string;
      free: string;
      percentUsed: number;
    };
  };
  networkStatus?: "Online" | "Offline";
  uptime?: string;
  lastBootTime?: string;
}

// Theme type
export type AppTheme = "light" | "dark" | "system" | "red-night";

// User settings
export interface UserSettings {
  general: {
    startOnBoot: boolean;
    checkForUpdates: boolean;
    updateFrequency: "startup" | "daily" | "weekly" | "monthly" | "never";
    showTooltips: boolean;
    defaultApps: {
      imaging: string;
      planetarium: string;
      guiding: string;
    };
    confirmBeforeClosing: boolean;
    autoConnectEquipment: boolean;
  };
  appearance: {
    theme: AppTheme;
    fontSize: number;
    redNightMode: boolean;
    compactView: boolean;
    customAccentColor?: string;
    showStatusBar: boolean;
    animationsEnabled: boolean;
  };
  account: {
    name: string;
    email: string;
    avatar?: string;
    organization?: string;
    role?: string;
  };
  notifications: {
    softwareUpdates: boolean;
    equipmentEvents: boolean;
    downloadCompletion: boolean;
    systemAlerts: boolean;
    sessionReminders: boolean;
    soundEffects: boolean;
  };
  storage: {
    downloadLocation: string;
    imageLocation: string;
    clearCacheAutomatically: boolean;
    cacheSizeLimit: number;
    backupFrequency: "daily" | "weekly" | "monthly" | "never";
    backupLocation?: string;
  };
  privacy: {
    shareUsageData: boolean;
    errorReporting: boolean;
    rememberLogin: boolean;
    dataRetentionPeriod: number;
    encryptLocalData: boolean;
  };
  language: {
    appLanguage: string;
    dateFormat: "mdy" | "dmy" | "ymd";
    timeFormat: "12h" | "24h";
    temperatureUnit: "celsius" | "fahrenheit";
    distanceUnit: "metric" | "imperial";
  };
  advanced: {
    debugMode: boolean;
    logLevel: "error" | "warning" | "info" | "debug" | "verbose";
    experimentalFeatures: boolean;
    apiEndpoints: Record<string, string>;
  };
}

// Import/Export types
export interface SoftwareImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  updatedCount: number;
  failedCount: number;
  failedItems?: { name: string; reason: string }[];
}

// System control types
export type SystemAction = "reload" | "shutdown" | "sleep" | "restart";
