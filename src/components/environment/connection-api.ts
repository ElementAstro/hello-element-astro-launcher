import { ApiService } from "./api-service";
import { ConnectionStatus, ConnectionLogEntry } from "./types";

// Connection API service class
class ConnectionApiService extends ApiService {
  private endpoint = "/system/connections";

  // Get all connection statuses
  public async getConnectionStatus(): Promise<ConnectionStatus[]> {
    return this.get<ConnectionStatus[]>(this.endpoint);
  }

  // Reconnect a service
  public async reconnectService(
    serviceName: string
  ): Promise<ConnectionStatus> {
    return this.post<ConnectionStatus>(
      `${this.endpoint}/${encodeURIComponent(serviceName)}/reconnect`
    );
  }

  // Disconnect a service
  public async disconnectService(
    serviceName: string
  ): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(
      `${this.endpoint}/${encodeURIComponent(serviceName)}/disconnect`
    );
  }

  // Get connection logs
  public async getConnectionLogs(
    limit: number = 50
  ): Promise<ConnectionLogEntry[]> {
    return this.get<ConnectionLogEntry[]>(`${this.endpoint}/logs`, {
      limit: limit.toString(),
    });
  }

  // Clear connection logs
  public async clearConnectionLogs(): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`${this.endpoint}/logs`);
  }

  // Get logs for a specific service
  public async getServiceLogs(
    serviceName: string,
    limit: number = 50
  ): Promise<ConnectionLogEntry[]> {
    return this.get<ConnectionLogEntry[]>(
      `${this.endpoint}/${encodeURIComponent(serviceName)}/logs`,
      { limit: limit.toString() }
    );
  }

  // Get connection statistics
  public async getConnectionStats(): Promise<{
    total: number;
    connected: number;
    disconnected: number;
    services: Record<string, { connected: boolean; uptime?: string }>;
  }> {
    return this.get<{
      total: number;
      connected: number;
      disconnected: number;
      services: Record<string, { connected: boolean; uptime?: string }>;
    }>(`${this.endpoint}/stats`);
  }
}

// Export singleton
export const connectionApi = new ConnectionApiService();
