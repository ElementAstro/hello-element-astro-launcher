import { ApiService } from './api-service';
import { Equipment } from './types';

// 高级设置接口
interface AdvancedSettings {
  autoReconnect: boolean;
  highPrecisionMode: boolean;
  lowNoiseMode: boolean;
  debugMode: boolean;
}

// 固件更新接口
interface FirmwareUpdateResponse {
  success: boolean;
  newVersion?: string;
  message?: string;
}

// 固件更新进度接口
interface FirmwareUpdateProgress {
  progress: number;  // 0-100
  status: 'pending' | 'downloading' | 'installing' | 'verifying' | 'complete' | 'error';
  message?: string;
}

// 诊断结果接口
interface DiagnosticDetails {
  componentStatus: Record<string, 'ok' | 'warning' | 'error'>;
  readings?: Record<string, number>;
  errors?: string[];
  warnings?: string[];
}

interface DiagnosticsResult {
  result: 'success' | 'warning' | 'error';
  details?: DiagnosticDetails;
  message?: string;
}

// 连接全部设备响应
interface ConnectAllResult {
  success: boolean;
  connectedCount: number;
  failedCount: number;
  message?: string;
}

// 设备API服务类
class EquipmentApiService extends ApiService {
  private endpoint = '/equipment';

  // 获取所有设备
  public async getAllEquipment(): Promise<Equipment[]> {
    return this.get<Equipment[]>(`${this.endpoint}`);
  }

  // 获取单个设备
  public async getEquipment(id: number): Promise<Equipment> {
    return this.get<Equipment>(`${this.endpoint}/${id}`);
  }

  // 连接设备
  public async connectEquipment(id: number): Promise<Equipment> {
    return this.post<Equipment>(`${this.endpoint}/${id}/connect`);
  }

  // 断开设备连接
  public async disconnectEquipment(id: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`${this.endpoint}/${id}/disconnect`);
  }

  // 连接所有设备
  public async connectAllEquipment(): Promise<ConnectAllResult> {
    return this.post<ConnectAllResult>(`${this.endpoint}/connect-all`);
  }

  // 保存设备高级设置
  public async saveAdvancedSettings(id: number, settings: AdvancedSettings): Promise<{ success: boolean }> {
    return this.put<{ success: boolean }, AdvancedSettings>(
      `${this.endpoint}/${id}/settings`, 
      settings
    );
  }

  // 获取设备设置
  public async getAdvancedSettings(id: number): Promise<AdvancedSettings> {
    return this.get<AdvancedSettings>(`${this.endpoint}/${id}/settings`);
  }

  // 更新设备固件
  public async updateFirmware(id: number): Promise<FirmwareUpdateResponse> {
    return this.post<FirmwareUpdateResponse>(`${this.endpoint}/${id}/firmware/update`);
  }

  // 获取固件更新进度
  public async getFirmwareUpdateProgress(id: number): Promise<FirmwareUpdateProgress> {
    return this.get<FirmwareUpdateProgress>(`${this.endpoint}/${id}/firmware/progress`);
  }

  // 运行设备诊断
  public async runDiagnostics(id: number): Promise<DiagnosticsResult> {
    return this.post<DiagnosticsResult>(`${this.endpoint}/${id}/diagnostics`);
  }

  // 添加新设备（抽象接口，具体实现需要根据不同设备类型）
  public async addEquipment(equipmentData: Partial<Equipment>): Promise<Equipment> {
    return this.post<Equipment, Partial<Equipment>>(this.endpoint, equipmentData);
  }

  // 删除设备
  public async deleteEquipment(id: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  // 获取支持的设备类型和驱动
  public async getSupportedDrivers(): Promise<{ 
    types: string[]; 
    drivers: Record<string, string[]> 
  }> {
    return this.get<{ types: string[]; drivers: Record<string, string[]> }>(
      `${this.endpoint}/drivers`
    );
  }

  // 获取设备统计信息
  public async getEquipmentStats(): Promise<{
    total: number;
    connected: number;
    byType: Record<string, number>;
  }> {
    return this.get<{
      total: number;
      connected: number;
      byType: Record<string, number>;
    }>(`${this.endpoint}/stats`);
  }
}

// 导出单例
export const equipmentApi = new EquipmentApiService();