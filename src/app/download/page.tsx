"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import { toast } from "sonner";
import type { Software, DownloadItem } from "@/types";
import { TranslationProvider } from "@/components/i18n";
import { commonTranslations } from "@/components/i18n/common-translations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DownloadItem as DownloadItemComponent,
  AvailableSoftwareCard,
  ImportDialog,
  NoActiveDownloads,
  NoDownloadHistory,
  NoSearchResults,
  downloadListVariants,
  ImportableSoftware,
  FilterOption,
  DownloadFilter,
  DownloadStatsCard,
  SoftwareDetailsDialog,
  BatchDownloadDialog,
  DownloadSettingsDialog,
} from "@/components/download";
import {
  NoConnection,
  LoadingDownloads,
} from "@/components/download/empty-states";

// 下载设置默认值
const DEFAULT_DOWNLOAD_SETTINGS = {
  maxConcurrentDownloads: 3,
  downloadPath: "C:\\Users\\User\\Downloads",
  defaultPriority: "normal" as const,
  speedLimit: 0,
  autoInstall: true,
  notifyOnCompletion: true,
  autoUpdate: true,
  autoRetry: true,
  retryAttempts: 3,
  connectionType: "auto" as const,
};

// 定义设置类型
interface DownloadSettings {
  maxConcurrentDownloads: number;
  downloadPath: string;
  defaultPriority: "low" | "normal" | "high";
  speedLimit: number;
  autoInstall: boolean;
  notifyOnCompletion: boolean;
  autoUpdate: boolean;
  autoRetry: boolean;
  retryAttempts: number;
  connectionType: "auto" | "direct" | "proxy";
}

function DownloadPageContent() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadSettings, setDownloadSettings] = useState<DownloadSettings>(
    DEFAULT_DOWNLOAD_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [statuses, setStatuses] = useState<FilterOption[]>([]);

  const {
    software,
    downloads,
    downloadHistory,
    addDownload,
    updateDownload,
    removeDownload,
    moveToHistory,
    importSoftware,
    clearDownloadHistory,
  } = useAppStore();

  // 模拟加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // 模拟网络请求延迟
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // 随机模拟连接状态
        const isConnected = Math.random() > 0.1;
        setIsConnected(isConnected);
        setIsLoading(false);
      } catch {
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 统计各类软件和下载状态数量
  useEffect(() => {
    // 统计分类
    const categoryMap = new Map<string, number>();
    software.forEach((item) => {
      const count = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, count + 1);
    });

    const categoryList: FilterOption[] = [
      { value: "all", label: "所有分类", count: software.length },
    ];

    categoryMap.forEach((count, category) => {
      categoryList.push({ value: category, label: category, count });
    });

    setCategories(categoryList);

    // 统计状态
    const statusMap = new Map<string, number>();
    downloads.forEach((item) => {
      const count = statusMap.get(item.status) || 0;
      statusMap.set(item.status, count + 1);
    });

    const statusList: FilterOption[] = [
      { value: "all", label: "所有状态", count: downloads.length },
    ];

    statusMap.forEach((count, status) => {
      const statusLabels: Record<string, string> = {
        completed: "已完成",
        downloading: "下载中",
        paused: "已暂停",
        error: "失败",
        waiting: "等待中",
        processing: "处理中",
        verification: "验证中",
        cancelled: "已取消",
      };

      statusList.push({
        value: status,
        label: statusLabels[status] || status,
        count,
      });
    });

    setStatuses(statusList);
  }, [software, downloads]);

  // Filter available downloads based on search and category
  const filteredSoftware = useMemo(() => {
    return software.filter(
      (item) =>
        (!item.installed || activeTab !== "available") &&
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );
  }, [software, searchQuery, selectedCategory, activeTab]);

  // Filter active downloads based on search and status
  const filteredDownloads = useMemo(() => {
    return downloads.filter(
      (item) =>
        (selectedStatus === "all" || item.status === selectedStatus) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [downloads, searchQuery, selectedStatus]);

  // Filter download history based on search
  const filteredHistory = useMemo(() => {
    return downloadHistory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [downloadHistory, searchQuery]);

  // 下载统计信息计算
  const downloadStats = useMemo(() => {
    const activeDownloads = downloads.filter((d) =>
      [
        "downloading",
        "paused",
        "waiting",
        "processing",
        "verification",
      ].includes(d.status)
    );

    const pausedDownloads = downloads.filter(
      (d) => d.status === "paused"
    ).length;
    const failedDownloads = downloads.filter(
      (d) => d.status === "error"
    ).length;
    const completedDownloads = downloadHistory.filter(
      (d) => d.status === "completed"
    ).length;

    // 计算总下载大小和进度
    let totalDownloaded = 0;
    let totalToDownload = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    downloads.forEach((download) => {
      // 提取数字大小
      const sizeMatch = download.size.match(/(\d+(\.\d+)?)/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[0]);
        const unit = download.size.toLowerCase();

        // 换算为字节
        let sizeInBytes = size;
        if (unit.includes("kb")) {
          sizeInBytes = size * 1024;
        } else if (unit.includes("mb")) {
          sizeInBytes = size * 1024 * 1024;
        } else if (unit.includes("gb")) {
          sizeInBytes = size * 1024 * 1024 * 1024;
        }

        totalToDownload += sizeInBytes;

        // 计算已下载的部分
        const progress = download.progress || 0;
        totalDownloaded += (sizeInBytes * progress) / 100;
      }

      // 计算平均速度
      if (
        download.status === "downloading" &&
        typeof download.speed === "string"
      ) {
        const speedMatch = download.speed.match(/(\d+(\.\d+)?)/);
        if (speedMatch) {
          const speed = parseFloat(speedMatch[0]);
          const unit = download.speed.toLowerCase();

          let speedInBytesPerSec = speed;
          if (unit.includes("kb/s")) {
            speedInBytesPerSec = speed * 1024;
          } else if (unit.includes("mb/s")) {
            speedInBytesPerSec = speed * 1024 * 1024;
          } else if (unit.includes("gb/s")) {
            speedInBytesPerSec = speed * 1024 * 1024 * 1024;
          }

          totalSpeed += speedInBytesPerSec;
          speedCount++;
        }
      }
    });

    const averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;

    return {
      activeDownloads,
      completedDownloads,
      pausedDownloads,
      failedDownloads,
      totalDownloaded,
      totalToDownload,
      averageSpeed,
    };
  }, [downloads, downloadHistory]);

  // Handle software download
  const handleDownload = useCallback(
    (
      softwareId: number,
      options?: { priority?: "low" | "normal" | "high"; installPath?: string }
    ) => {
      const softwareToDownload = software.find((s) => s.id === softwareId);
      if (!softwareToDownload) return;

      const newDownload: DownloadItem = {
        id: Date.now(),
        name: softwareToDownload.name,
        version: softwareToDownload.version,
        size: softwareToDownload.size,
        icon: softwareToDownload.icon,
        category: softwareToDownload.category,
        status: "downloading",
        progress: 0,
        date: new Date().toISOString().split("T")[0],
        speed: "2.5 MB/s",
        estimatedTimeRemaining: "5 min",
        priority: options?.priority || downloadSettings.defaultPriority,
        installPath: options?.installPath || downloadSettings.downloadPath,
      };

      addDownload(newDownload);

      // 设置活动标签页为下载中
      setActiveTab("active");

      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          moveToHistory(newDownload.id);

          if (downloadSettings.notifyOnCompletion) {
            toast.success("下载完成", {
              description: `${softwareToDownload.name} 已成功下载完成`,
            });
          }

          // 如果启用了自动安装
          if (downloadSettings.autoInstall) {
            toast.info("正在启动安装程序", {
              description: `正在为 ${softwareToDownload.name} 启动安装程序`,
            });
          }
        } else {
          updateDownload(newDownload.id, {
            progress,
            estimatedTimeRemaining: `${Math.ceil((100 - progress) / 20)} min`,
          });
        }
      }, 1000);
    },
    [software, downloadSettings, addDownload, moveToHistory, updateDownload]
  );

  // Handle batch download
  const handleBatchDownload = useCallback(
    (
      softwareIds: number[],
      options?: { priority?: "low" | "normal" | "high" }
    ) => {
      if (softwareIds.length === 0) return;

      // 设置活动标签页为下载中
      setActiveTab("active");

      // 下载多个软件
      softwareIds.forEach((id, index) => {
        // 延迟启动每个下载，避免同时启动
        setTimeout(() => {
          handleDownload(id, options);
        }, index * 500);
      });

      toast.success("批量下载已添加", {
        description: `已添加 ${softwareIds.length} 个下载任务到队列`,
      });
    },
    [handleDownload]
  );

  // Transform ImportableSoftware to Software for the store
  const handleImport = async (data: ImportableSoftware[]) => {
    const transformedSoftware: Software[] = data.map((item) => ({
      ...item,
      id: 0, // Will be assigned by the store
      actionLabel: "Download",
      featured: false,
      downloads: 0,
      lastUpdated: new Date().toISOString(),
      installed: false,
      rating: item.rating || 0,
      systemRequirements:
        item.systemRequirements ||
        ({
          length: 0,
          toString: () => "",
          valueOf: () => "",
        } as unknown as ArrayLike<unknown> & Record<string, string>),
    }));

    return importSoftware(transformedSoftware);
  };

  // 暂停所有下载
  const handlePauseAll = useCallback(() => {
    downloads.forEach((download) => {
      if (download.status === "downloading") {
        updateDownload(download.id, {
          status: "paused",
          speed: "0 MB/s",
        });
      }
    });

    toast.info("已暂停所有下载", {
      description: "您可以随时恢复下载任务",
    });
  }, [downloads, updateDownload]);

  // 恢复所有下载
  const handleResumeAll = useCallback(() => {
    downloads.forEach((download) => {
      if (download.status === "paused") {
        updateDownload(download.id, {
          status: "downloading",
          speed: "2.5 MB/s",
          estimatedTimeRemaining: "计算中...",
        });
      }
    });

    toast.info("已恢复所有下载", {
      description: "下载任务已重新开始",
    });
  }, [downloads, updateDownload]);

  // 取消所有下载
  const handleCancelAll = useCallback(() => {
    downloads.forEach((download) => {
      if (["downloading", "paused", "waiting"].includes(download.status)) {
        removeDownload(download.id);
      }
    });

    toast.info("已取消所有下载", {
      description: "所有活跃的下载任务已被取消",
    });
  }, [downloads, removeDownload]);

  // 保存下载设置
  const handleSaveSettings = useCallback((settings: DownloadSettings) => {
    setDownloadSettings(settings);
    toast.success("下载设置已更新", {
      description: "您的下载设置已成功保存并应用",
    });
  }, []);

  // 重试连接
  const handleRetryConnection = useCallback(async () => {
    setIsLoading(true);

    try {
      // 模拟网络请求
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 清除搜索和过滤器
  const clearSearchAndFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  }, []);

  // 渲染页面内容
  const renderPageContent = () => {
    if (isLoading) {
      return <LoadingDownloads />;
    }

    if (!isConnected) {
      return <NoConnection onRetry={handleRetryConnection} />;
    }

    return (
      <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">下载中心</h1>
            <p className="text-muted-foreground">管理您的下载并发现新软件</p>
          </div>
          <div className="w-full md:w-auto flex flex-wrap gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索软件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 md:w-[280px]"
              />
            </div>
            <ImportDialog
              onImport={handleImport}
              open={false}
              onOpenChange={() => {}}
            />
            <BatchDownloadDialog
              software={software.filter((s) => !s.installed)}
              onBatchDownload={handleBatchDownload}
            />
            <DownloadSettingsDialog
              settings={downloadSettings}
              onSaveSettings={handleSaveSettings}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  活跃下载
                  {downloads.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {downloads.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history">
                  下载历史
                  {downloadHistory.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {downloadHistory.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="available">可用软件</TabsTrigger>
              </TabsList>

              <div className="my-4">
                {activeTab === "active" && (
                  <DownloadFilter
                    categories={categories}
                    statuses={statuses}
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    onCategoryChange={setSelectedCategory}
                    onStatusChange={setSelectedStatus}
                  />
                )}
                {activeTab === "available" && (
                  <DownloadFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                )}
                {activeTab === "history" && searchQuery && (
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-muted">
                      搜索: {searchQuery}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="h-8 px-2 text-xs ml-2"
                    >
                      清除
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="active" className="space-y-4">
                {filteredDownloads.length === 0 ? (
                  <NoActiveDownloads
                    onBrowse={() => setActiveTab("available")}
                  />
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={downloadListVariants}
                    className="space-y-4"
                  >
                    {filteredDownloads.map((download) => (
                      <DownloadItemComponent
                        key={download.id}
                        download={download}
                        onCancel={() => removeDownload(download.id)}
                        onPause={() =>
                          updateDownload(download.id, {
                            status: "paused" as const,
                            speed: "0 MB/s",
                          })
                        }
                        onResume={() =>
                          updateDownload(download.id, {
                            status: "downloading" as const,
                            speed: "2.5 MB/s",
                            estimatedTimeRemaining: `${Math.ceil(
                              (100 - (download.progress || 0)) / 20
                            )} min`,
                          })
                        }
                        onRetry={() => {
                          updateDownload(download.id, {
                            status: "downloading" as const,
                            progress: 0,
                            speed: "2.5 MB/s",
                            estimatedTimeRemaining: "5 min",
                          });
                        }}
                        onRemove={() => removeDownload(download.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {downloadHistory.length === 0 ? (
                  <NoDownloadHistory
                    onBrowse={() => setActiveTab("available")}
                  />
                ) : filteredHistory.length === 0 ? (
                  <NoSearchResults
                    query={searchQuery}
                    onClear={clearSearchAndFilters}
                  />
                ) : (
                  <>
                    <div className="flex justify-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            清除历史
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>清除下载历史</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要清除所有下载历史记录吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={clearDownloadHistory}>
                              清除历史
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={downloadListVariants}
                      className="space-y-4"
                    >
                      {filteredHistory.map((download) => (
                        <DownloadItemComponent
                          key={download.id}
                          download={download}
                          onRemove={() => removeDownload(download.id)}
                          onShowDetails={() => {
                            // 查找对应的软件并显示详情
                            const relatedSoftware = software.find(
                              (s) =>
                                s.name === download.name &&
                                s.version === download.version
                            );

                            if (relatedSoftware) {
                              toast.info("功能开发中", {
                                description: `将显示 ${download.name} 的详细信息`,
                              });
                            }
                          }}
                        />
                      ))}
                    </motion.div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="available" className="mt-2">
                {filteredSoftware.length === 0 ? (
                  <div className="col-span-full">
                    <NoSearchResults
                      query={searchQuery}
                      onClear={clearSearchAndFilters}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSoftware.map((softwareItem) => (
                      <AvailableSoftwareCard
                        key={softwareItem.id}
                        software={softwareItem}
                        onDownload={() => handleDownload(softwareItem.id)}
                        onViewDetails={() => (
                          <SoftwareDetailsDialog
                            software={{
                              ...softwareItem,
                              systemRequirements:
                                (softwareItem.systemRequirements
                                  ? Object.fromEntries(
                                      Object.entries(
                                        softwareItem.systemRequirements
                                      ).map(([k, v]) => [k, String(v)])
                                    )
                                  : {}) as Record<string, string>,
                            }}
                            onDownload={(options) =>
                              handleDownload(softwareItem.id, options)
                            }
                          />
                        )}
                        alreadyDownloading={downloads.some(
                          (d) =>
                            d.name === softwareItem.name &&
                            d.version === softwareItem.version
                        )}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full md:w-1/4">
            <DownloadStatsCard
              activeDownloads={downloadStats.activeDownloads}
              completedDownloads={downloadStats.completedDownloads}
              pausedDownloads={downloadStats.pausedDownloads}
              failedDownloads={downloadStats.failedDownloads}
              totalDownloaded={downloadStats.totalDownloaded}
              totalToDownload={downloadStats.totalToDownload}
              averageSpeed={downloadStats.averageSpeed}
              onPauseAll={handlePauseAll}
              onResumeAll={handleResumeAll}
              onCancelAll={handleCancelAll}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">{renderPageContent()}</div>
      </div>
    </AppLayout>
  );
}

export default function DownloadPage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage = typeof navigator !== 'undefined' ? 
    (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US') : 'en-US';
  
  // 从用户区域确定地区
  const userRegion = userLanguage === 'zh-CN' ? 'CN' : 'US';
  
  return (
    <TranslationProvider 
      initialDictionary={commonTranslations[userLanguage] || commonTranslations['en-US']}
      lang={userLanguage.split('-')[0]}
      initialRegion={userRegion}
    >
      <DownloadPageContent />
    </TranslationProvider>
  );
}
