export interface Equipment {
  id: number;
  name: string;
  type: string;
  status: "Connected" | "Disconnected";
  driver: string;
  details?: Record<string, string>;
  lastConnected?: string;
  connectionType?: "USB" | "Network" | "Serial" | "Bluetooth";
  firmwareVersion?: string;
  serialNumber?: string;
  batteryLevel?: number;
  lastConnectionTime?: string;
}

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
      free: string;
      total: string;
      percentUsed: number;
    };
    data: {
      free: string;
      total: string;
      percentUsed: number;
    };
  };
}

export interface ConnectionStatus {
  name: string;
  status: "connected" | "disconnected";
  description: string;
}

export interface LogEntry {
  type: "success" | "error";
  title: string;
  timestamp: string;
  errorMessage?: string;
}

export interface ConnectionLogEntry {
  level: string;
  message: string;
  timestamp: string;
}

export interface EquipmentProfile {
  name: string;
  description: string;
}

export interface DiagnosticsData {
  timestamp: string;
  systemMetrics: {
    cpuLoad: number;
    memoryUsage: number;
    diskIO: {
      read: number;
      write: number;
    };
    networkIO: {
      sent: number;
      received: number;
    };
  };
  processInfo: {
    pid: number;
    uptime: number;
    threadCount: number;
    memoryUsage: number;
  };
  errorCounts: {
    critical: number;
    warning: number;
    info: number;
  };
  performance: {
    responseTime: number;
    requestCount: number;
    errorRate: number;
  };
}

export interface SystemSettings {
  general: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    autoUpdate: boolean;
    startupBehavior: 'minimized' | 'normal';
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    errorAlerts: boolean;
    updateAlerts: boolean;
  };
  performance: {
    loggingLevel: 'debug' | 'info' | 'warning' | 'error';
    dataRetentionDays: number;
    maxConcurrentOperations: number;
  };
  security: {
    autoLock: boolean;
    lockTimeout: number;
    requirePasswordOnWake: boolean;
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    keepCount: number;
    location: string;
  };
}