import { ApiService } from "./api-service";
import { SystemInfo, DiagnosticsData, SystemSettings } from "./types";

// System status response
interface SystemStatus {
  status: "normal" | "warning" | "error" | "maintenance";
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  temperature?: number;
  message?: string;
}

// System update information
interface SystemUpdateInfo {
  available: boolean;
  version?: string;
  releaseNotes?: string;
  isRequired?: boolean;
  downloadUrl?: string;
}

// System update status
interface SystemUpdateStatus {
  inProgress: boolean;
  progress?: number; // 0-100
  stage?: "downloading" | "installing" | "verifying" | "completed" | "failed";
  message?: string;
}

// System API service class
class SystemApiService extends ApiService {
  private endpoint = "/system";

  // Get system information
  public async getSystemInfo(): Promise<SystemInfo> {
    return this.get<SystemInfo>(this.endpoint);
  }

  // Get system status
  public async getSystemStatus(): Promise<SystemStatus> {
    return this.get<SystemStatus>(`${this.endpoint}/status`);
  }

  // Restart system
  public async restartSystem(): Promise<{
    success: boolean;
    message?: string;
  }> {
    return this.post<{ success: boolean; message?: string }>(
      `${this.endpoint}/restart`
    );
  }

  // Shutdown system
  public async shutdownSystem(): Promise<{
    success: boolean;
    message?: string;
  }> {
    return this.post<{ success: boolean; message?: string }>(
      `${this.endpoint}/shutdown`
    );
  }

  // Check for system updates
  public async checkForUpdates(): Promise<SystemUpdateInfo> {
    return this.get<SystemUpdateInfo>(`${this.endpoint}/updates`);
  }

  // Start system update
  public async startUpdate(): Promise<{ success: boolean; message?: string }> {
    return this.post<{ success: boolean; message?: string }>(
      `${this.endpoint}/updates/start`
    );
  }

  // Get update status
  public async getUpdateStatus(): Promise<SystemUpdateStatus> {
    return this.get<SystemUpdateStatus>(`${this.endpoint}/updates/status`);
  }

  // Get system logs
  public async getSystemLogs(limit: number = 100): Promise<string> {
    return this.get<string>(`${this.endpoint}/logs`, {
      limit: limit.toString(),
    });
  }

  // Get diagnostics data
  public async getDiagnosticsData(): Promise<DiagnosticsData> {
    return this.get<DiagnosticsData>(`${this.endpoint}/diagnostics`);
  }

  // Save system settings
  public async saveSettings(
    settings: SystemSettings
  ): Promise<{ success: boolean }> {
    return this.put<{ success: boolean }, SystemSettings>(
      `${this.endpoint}/settings`,
      settings
    );
  }

  // Get system settings
  public async getSettings(): Promise<SystemSettings> {
    return this.get<SystemSettings>(`${this.endpoint}/settings`);
  }

  // Reset system settings to defaults
  public async resetSettings(): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`${this.endpoint}/settings/reset`);
  }
}

// Export singleton
export const systemApi = new SystemApiService();
