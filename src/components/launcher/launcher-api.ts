import type { SoftwareFilter } from "./types";
import type { Software as GlobalSoftware } from "@/types";
export type { Software as GlobalSoftware } from "@/types";

// 定义通用的业务错误类
export class LauncherApiError extends Error {
  constructor(message: string, public statusCode: number, public data?: Record<string, unknown>) {
    super(message);
    this.name = 'LauncherApiError';
  }
}

// 定义API基本路径
const API_BASE_URL = '/api';

// 软件类型定义
interface ApiSoftware {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  requirements: {
    minMemory?: string;
    minCpu?: string;
    minStorage?: string;
    os?: string[];
  };
  downloadUrl: string;
  thumbnailUrl: string;
  screenshotUrls: string[];
  installationSteps?: string[];
  releaseDate: string;
  updatedAt: string;
  size: string;
  rating: number;
  downloads: number;
  isInstalled?: boolean;
  isRunning?: boolean;
  installationPath?: string;
}

// API软件类型转换为应用软件类型
function convertApiToAppSoftware(apiSoftware: ApiSoftware | GlobalSoftware): GlobalSoftware {
  if ('actionLabel' in apiSoftware) {
    // 如果已经是GlobalSoftware类型，直接返回
    return apiSoftware as GlobalSoftware;
  }
  
  return {
    id: parseInt(apiSoftware.id),
    name: apiSoftware.name,
    description: apiSoftware.description,
    icon: apiSoftware.thumbnailUrl,
    category: apiSoftware.category,
    actionLabel: apiSoftware.isInstalled ? "Launch" : "Install",
    featured: false, // 默认值，可以后续根据需要修改
    downloads: apiSoftware.downloads,
    lastUpdated: apiSoftware.updatedAt,
    version: apiSoftware.version,
    size: apiSoftware.size,
    developer: apiSoftware.author,
    website: apiSoftware.downloadUrl, // 使用downloadUrl作为website链接
    installed: !!apiSoftware.isInstalled,
    tags: apiSoftware.tags,
    rating: apiSoftware.rating,
    releaseNotes: "", // API数据中没有这个字段，可以根据需要填充
  };
}

// 批量转换API软件类型
function convertApiSoftwareList(apiSoftwareList: ApiSoftware[]): GlobalSoftware[] {
  return apiSoftwareList.map(convertApiToAppSoftware);
}

// 分类类型定义
interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  count: number;
}

// 版本类型定义
interface SoftwareVersion {
  version: string;
  releaseDate: string;
  changelog: string;
  downloadUrl: string;
  size: string;
}

// 安装状态定义
interface InstallationStatus {
  id: string;
  status: 'pending' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  eta?: string;
  speed?: string;
  completedAt?: string;
}

// 通用请求处理函数
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new LauncherApiError(
        data.message || '请求失败',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof LauncherApiError) {
      throw error;
    }
    throw new LauncherApiError(
      (error as Error).message || '网络请求失败',
      500
    );
  }
}

// === 软件相关 API ===

// 获取所有软件列表（不分页）
export async function getAllSoftware(): Promise<GlobalSoftware[]> {
  const result = await fetchApi<ApiSoftware[]>('/software/all');
  return convertApiSoftwareList(result);
}

// 获取软件列表
export async function getSoftwareList(
  filter?: SoftwareFilter, 
  page: number = 1, 
  pageSize: number = 10,
  search?: string
): Promise<{ items: GlobalSoftware[]; total: number; page: number; pageSize: number }> {
  const queryParams = new URLSearchParams();
  
  if (filter?.category) {
    queryParams.append('category', filter.category);
  }
  
  if (filter?.tags && filter.tags.length) {
    filter.tags.forEach((tag: string) => queryParams.append('tags', tag));
  }
  
  if (search) {
    queryParams.append('search', search);
  }
  
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());
  
  const result = await fetchApi<{ items: ApiSoftware[]; total: number; page: number; pageSize: number }>(`/software/list?${queryParams.toString()}`);
  
  // 转换API响应到应用软件类型
  return {
    ...result,
    items: convertApiSoftwareList(result.items)
  };
}

// 获取推荐软件
export async function getFeaturedSoftware(): Promise<GlobalSoftware[]> {
  const result = await fetchApi<ApiSoftware[]>('/software/featured');
  return convertApiSoftwareList(result);
}

// 获取软件详情
export async function getSoftwareDetails(id: string): Promise<GlobalSoftware> {
  const result = await fetchApi<ApiSoftware>(`/software/${id}`);
  return convertApiToAppSoftware(result);
}

// 获取软件版本历史
export async function getSoftwareVersions(id: string): Promise<SoftwareVersion[]> {
  return fetchApi<SoftwareVersion[]>(`/software/${id}/versions`);
}

// 安装软件
export async function installSoftware(id: string, version?: string): Promise<{ installationId: string }> {
  const requestBody = version ? { version } : {};
  return fetchApi<{ installationId: string }>(`/software/${id}/install`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
}

// 卸载软件
export async function uninstallSoftware(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/software/${id}/uninstall`, {
    method: 'POST',
  });
}

// 启动软件
export async function launchSoftware(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/software/${id}/launch`, {
    method: 'POST',
  });
}

// 停止软件
export async function stopSoftware(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/software/${id}/stop`, {
    method: 'POST',
  });
}

// 获取安装状态
export async function getInstallationStatus(installationId: string): Promise<InstallationStatus> {
  return fetchApi<InstallationStatus>(`/software/installation/${installationId}`);
}

// === 分类相关 API ===

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>('/software/categories');
}

// 获取特定分类详情
export async function getCategoryDetails(id: string): Promise<Category> {
  return fetchApi<Category>(`/software/categories/${id}`);
}

// === 检查更新相关 API ===

// 检查软件更新
export async function checkSoftwareUpdates(ids?: string[]): Promise<{ id: string; hasUpdate: boolean; latestVersion: string }[]> {
  const queryParams = new URLSearchParams();
  
  if (ids && ids.length) {
    ids.forEach(id => queryParams.append('ids', id));
  }
  
  return fetchApi<{ id: string; hasUpdate: boolean; latestVersion: string }[]>(`/software/updates?${queryParams.toString()}`);
}

// 更新软件
export async function updateSoftware(id: string): Promise<{ installationId: string }> {
  return fetchApi<{ installationId: string }>(`/software/${id}/update`, {
    method: 'POST',
  });
}

// === 搜索相关 API ===

// 获取搜索建议
export async function getSearchSuggestions(query: string): Promise<string[]> {
  return fetchApi<string[]>(`/software/search/suggestions?query=${encodeURIComponent(query)}`);
}

// 执行高级搜索
export async function advancedSearch(
  query: string, 
  options: {
    categories?: string[];
    tags?: string[];
    author?: string;
    minRating?: number;
    sortBy?: 'name' | 'releaseDate' | 'rating' | 'downloads';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<{ items: GlobalSoftware[]; total: number }> {
  const result = await fetchApi<{ items: ApiSoftware[]; total: number }>('/software/search/advanced', {
    method: 'POST',
    body: JSON.stringify({
      query,
      ...options,
    }),
  });
  
  return {
    items: convertApiSoftwareList(result.items),
    total: result.total
  };
}

// === 用户偏好相关 API ===

// 获取用户偏好设置
export async function getUserPreferences(): Promise<{
  recentlyUsed: string[];
  favorites: string[];
  installPath: string;
  autoUpdate: boolean;
}> {
  return fetchApi<{
    recentlyUsed: string[];
    favorites: string[];
    installPath: string;
    autoUpdate: boolean;
  }>('/user/preferences/launcher');
}

// 更新用户偏好设置
export async function updateUserPreferences(preferences: {
  installPath?: string;
  autoUpdate?: boolean;
}): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>('/user/preferences/launcher', {
    method: 'PATCH',
    body: JSON.stringify(preferences),
  });
}

// 添加到收藏夹
export async function addToFavorites(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>('/user/favorites', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

// 从收藏夹移除
export async function removeFromFavorites(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>('/user/favorites', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// === 系统相关 API ===

// 获取系统信息
export async function getSystemInfo(): Promise<{
  memory: { total: string; available: string };
  cpu: { model: string; usage: number };
  storage: { total: string; available: string };
  os: { name: string; version: string };
}> {
  return fetchApi<{
    memory: { total: string; available: string };
    cpu: { model: string; usage: number };
    storage: { total: string; available: string };
    os: { name: string; version: string };
  }>('/system/info');
}

// === 额外的辅助方法 ===

// 搜索软件
export async function searchSoftware(query: string): Promise<GlobalSoftware[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const result = await getSoftwareList(undefined, 1, 10, query);
    return result.items;
  } catch (error) {
    console.error('搜索软件失败:', error);
    throw error;
  }
}

// 获取已安装的软件
export async function getInstalledSoftware(): Promise<GlobalSoftware[]> {
  try {
    const result = await fetchApi<{ items: ApiSoftware[]; total: number }>('/software/list?installed=true');
    return convertApiSoftwareList(result.items);
  } catch (error) {
    console.error('获取已安装软件失败:', error);
    throw error;
  }
}

// 获取软件使用统计
export async function getSoftwareStats(): Promise<{
  totalInstalled: number;
  recentlyUsed: number;
  pendingUpdates: number;
}> {
  return fetchApi<{
    totalInstalled: number;
    recentlyUsed: number;
    pendingUpdates: number;
  }>('/software/stats');
}