import { ApiService } from "./api-service";
import { EquipmentProfile } from "./types";

// Load profile response
interface LoadProfileResponse {
  success: boolean;
  message?: string;
}

// Export profile response
interface ExportProfileResponse {
  success: boolean;
  exportUrl: string;
}

// Equipment profile API service class
class ProfilesApiService extends ApiService {
  private endpoint = "/equipment/profiles";

  // Get all profiles
  public async getAllProfiles(): Promise<EquipmentProfile[]> {
    return this.get<EquipmentProfile[]>(this.endpoint);
  }

  // Get a single profile
  public async getProfile(name: string): Promise<EquipmentProfile> {
    return this.get<EquipmentProfile>(
      `${this.endpoint}/${encodeURIComponent(name)}`
    );
  }

  // Save current device settings as new profile
  public async saveCurrentSetup(
    name: string,
    description: string = ""
  ): Promise<EquipmentProfile> {
    return this.post<EquipmentProfile, { name: string; description: string }>(
      this.endpoint,
      { name, description }
    );
  }

  // Update profile
  public async updateProfile(
    originalName: string,
    profile: EquipmentProfile
  ): Promise<EquipmentProfile> {
    return this.put<EquipmentProfile, EquipmentProfile>(
      `${this.endpoint}/${encodeURIComponent(originalName)}`,
      profile
    );
  }

  // Delete profile
  public async deleteProfile(name: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(
      `${this.endpoint}/${encodeURIComponent(name)}`
    );
  }

  // Load profile
  public async loadProfile(name: string): Promise<LoadProfileResponse> {
    return this.post<LoadProfileResponse>(
      `${this.endpoint}/${encodeURIComponent(name)}/load`
    );
  }

  // Export profile
  public async exportProfile(name: string): Promise<ExportProfileResponse> {
    return this.get<ExportProfileResponse>(
      `${this.endpoint}/${encodeURIComponent(name)}/export`
    );
  }

  // Import profile
  public async importProfile(file: File): Promise<EquipmentProfile> {
    return this.uploadFile<EquipmentProfile>(
      `${this.endpoint}/import`,
      file,
      "profile"
    );
  }

  // Import profile (from URL)
  public async importProfileFromUrl(url: string): Promise<EquipmentProfile> {
    return this.post<EquipmentProfile, { url: string }>(
      `${this.endpoint}/import-url`,
      { url }
    );
  }
}

// Export singleton
export const profilesApi = new ProfilesApiService();
