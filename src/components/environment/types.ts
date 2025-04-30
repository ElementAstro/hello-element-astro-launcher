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

export interface EquipmentProfile {
  name: string;
  description: string;
}