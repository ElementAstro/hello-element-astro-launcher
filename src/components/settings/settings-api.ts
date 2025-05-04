import type {
  Settings,
  LogLevel,
  IAppearanceSettings,
  IGeneralSettings,
  ILanguageSettings,
  IAdvancedSettings,
  IAccountSettings,
} from "./types";

// 基础 API 请求封装函数，添加了错误处理和认证
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 默认选项，合并用户提供的选项
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`/api${endpoint}`, mergedOptions);

    // 处理状态错误
    if (!response.ok) {
      // 401 表示未授权，可能是 token 过期
      if (response.status === 401) {
        // 触发重新登录或刷新 token
        // 这里可能需要与认证管理代码集成
        console.error("Authentication token expired");
      }

      const errorData = await response.json().catch(() => ({
        message: "Unknown server error",
      }));

      throw new Error(
        errorData.message || `Server responded with ${response.status}`
      );
    }

    // 如果响应是 204 No Content 或其他可能没有响应体的情况
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    // 根据内容类型处理响应
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else if (
      contentType &&
      contentType.includes("application/octet-stream")
    ) {
      return (await response.blob()) as unknown as T;
    } else {
      return (await response.text()) as unknown as T;
    }
  } catch (error: unknown) {
    // 重新抛出带有详细信息的错误
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error("API request failed with unknown error");
  }
}

// 外观设置 API
export const appearanceApi = {
  // 获取外观设置
  getAppearanceSettings: async (): Promise<IAppearanceSettings> => {
    return fetchApi<IAppearanceSettings>("/settings/appearance");
  },

  // 更新外观设置
  updateAppearanceSettings: async (
    settings: IAppearanceSettings
  ): Promise<IAppearanceSettings> => {
    return fetchApi<IAppearanceSettings>("/settings/appearance", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 获取可用主题列表
  getAvailableThemes: async (): Promise<
    { id: string; name: string; preview: string }[]
  > => {
    return fetchApi<{ id: string; name: string; preview: string }[]>(
      "/settings/appearance/themes"
    );
  },
};

// 通用设置 API
export const generalApi = {
  // 获取通用设置
  getGeneralSettings: async (): Promise<IGeneralSettings> => {
    return fetchApi<IGeneralSettings>("/settings/general");
  },

  // 更新通用设置
  updateGeneralSettings: async (
    settings: IGeneralSettings
  ): Promise<IGeneralSettings> => {
    return fetchApi<IGeneralSettings>("/settings/general", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 检查更新
  checkForUpdates: async (): Promise<{
    hasUpdate: boolean;
    version: string;
    changelog: string;
  }> => {
    return fetchApi<{ hasUpdate: boolean; version: string; changelog: string }>(
      "/system/update/check"
    );
  },
};

// 语言设置 API
export const languageApi = {
  // 获取语言设置
  getLanguageSettings: async (): Promise<ILanguageSettings> => {
    return fetchApi<ILanguageSettings>("/settings/language");
  },

  // 更新语言设置
  updateLanguageSettings: async (
    settings: ILanguageSettings
  ): Promise<ILanguageSettings> => {
    return fetchApi<ILanguageSettings>("/settings/language", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 获取可用语言列表
  getAvailableLanguages: async (): Promise<
    { code: string; name: string }[]
  > => {
    return fetchApi<{ code: string; name: string }[]>(
      "/settings/language/available"
    );
  },
};

// 高级设置 API
export const advancedApi = {
  // 获取高级设置
  getAdvancedSettings: async (): Promise<IAdvancedSettings> => {
    return fetchApi<IAdvancedSettings>("/settings/advanced");
  },

  // 更新高级设置
  updateAdvancedSettings: async (
    settings: IAdvancedSettings
  ): Promise<IAdvancedSettings> => {
    return fetchApi<IAdvancedSettings>("/settings/advanced", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 获取系统日志
  getSystemLogs: async (
    level: LogLevel
  ): Promise<{ timestamp: string; level: string; message: string }[]> => {
    return fetchApi<{ timestamp: string; level: string; message: string }[]>(
      `/system/logs?level=${level}`
    );
  },

  // 重置为默认设置
  resetToDefaults: async (): Promise<Settings> => {
    return fetchApi<Settings>("/settings/reset", {
      method: "POST",
    });
  },

  // 导出设置为 JSON 文件
  exportSettings: async (): Promise<Blob> => {
    return fetchApi<Blob>("/settings/export", {
      headers: {
        Accept: "application/octet-stream",
      },
    });
  },

  // 导入设置
  importSettings: async (file: File): Promise<Settings> => {
    const formData = new FormData();
    formData.append("settingsFile", file);

    return fetchApi<Settings>("/settings/import", {
      method: "POST",
      body: formData,
      headers: {}, // 清空 Content-Type，让浏览器自动设置包含 boundary 的值
    });
  },
};

// 账户设置 API
export const accountApi = {
  // 获取账户设置
  getAccountSettings: async (): Promise<IAccountSettings> => {
    return fetchApi<IAccountSettings>("/settings/account");
  },

  // 更新账户设置
  updateAccountSettings: async (
    settings: IAccountSettings
  ): Promise<IAccountSettings> => {
    return fetchApi<IAccountSettings>("/settings/account", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 更新账户头像
  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetchApi<{ avatarUrl: string }>("/settings/account/avatar", {
      method: "POST",
      body: formData,
      headers: {}, // 清空 Content-Type，让浏览器自动设置包含 boundary 的值
    });
  },

  // 验证当前密码
  verifyPassword: async (password: string): Promise<{ valid: boolean }> => {
    return fetchApi<{ valid: boolean }>("/auth/verify-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  // 更改密码
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    return fetchApi<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // 启用或禁用双因素认证
  toggleTwoFactorAuth: async (
    enabled: boolean
  ): Promise<{ secret?: string; qrCode?: string }> => {
    return fetchApi<{ secret?: string; qrCode?: string }>("/auth/2fa", {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    });
  },

  // 验证双因素认证码
  verifyTwoFactorAuthCode: async (
    code: string
  ): Promise<{ valid: boolean }> => {
    return fetchApi<{ valid: boolean }>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};

// 隐私设置 API
export const privacyApi = {
  // 获取隐私设置
  getPrivacySettings: async (): Promise<{
    dataCollection: boolean;
    crashReports: boolean;
    usageStatistics: boolean;
  }> => {
    return fetchApi<{
      dataCollection: boolean;
      crashReports: boolean;
      usageStatistics: boolean;
    }>("/settings/privacy");
  },

  // 更新隐私设置
  updatePrivacySettings: async (settings: {
    dataCollection: boolean;
    crashReports: boolean;
    usageStatistics: boolean;
  }): Promise<void> => {
    return fetchApi<void>("/settings/privacy", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 导出用户数据（GDPR 合规）
  exportUserData: async (): Promise<Blob> => {
    return fetchApi<Blob>("/settings/privacy/export-data", {
      headers: {
        Accept: "application/octet-stream",
      },
    });
  },

  // 删除用户账户和所有数据
  deleteAccount: async (password: string): Promise<void> => {
    return fetchApi<void>("/settings/privacy/delete-account", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
};

// 通知设置 API
export const notificationApi = {
  // 获取通知设置
  getNotificationSettings: async (): Promise<{
    enabled: boolean;
    softwareUpdates: boolean;
    systemAlerts: boolean;
    equipmentEvents: boolean;
    completedTasks: boolean;
    subscriptions: { id: string; name: string; enabled: boolean }[];
  }> => {
    return fetchApi<{
      enabled: boolean;
      softwareUpdates: boolean;
      systemAlerts: boolean;
      equipmentEvents: boolean;
      completedTasks: boolean;
      subscriptions: { id: string; name: string; enabled: boolean }[];
    }>("/settings/notifications");
  },

  // 更新通知设置
  updateNotificationSettings: async (settings: {
    enabled: boolean;
    softwareUpdates: boolean;
    systemAlerts: boolean;
    equipmentEvents: boolean;
    completedTasks: boolean;
    subscriptions?: { id: string; enabled: boolean }[];
  }): Promise<void> => {
    return fetchApi<void>("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // 测试通知
  testNotification: async (): Promise<void> => {
    return fetchApi<void>("/settings/notifications/test", {
      method: "POST",
    });
  },
};

// 统一设置 API：用于一次获取或更新所有设置
export const settingsApi = {
  // 获取所有设置
  getAllSettings: async (): Promise<Settings> => {
    return fetchApi<Settings>("/settings");
  },

  // 更新所有设置（不常用，通常使用单独的 API）
  updateAllSettings: async (settings: Settings): Promise<Settings> => {
    return fetchApi<Settings>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
};

export default settingsApi;
