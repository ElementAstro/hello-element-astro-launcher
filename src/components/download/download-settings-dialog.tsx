import { useState, useEffect } from "react";
import { Settings, Gauge, FolderOpen, RefreshCw, Sliders } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

interface DownloadSettings {
  maxConcurrentDownloads: number;
  downloadPath: string;
  defaultPriority: "high" | "normal" | "low";
  speedLimit: number;
  autoInstall: boolean;
  notifyOnCompletion: boolean;
  autoUpdate: boolean;
  autoRetry: boolean;
  retryAttempts: number;
  connectionType: "auto" | "direct" | "proxy";
}

interface DownloadSettingsDialogProps {
  settings: DownloadSettings;
  onSaveSettings: (settings: DownloadSettings) => void;
  trigger?: React.ReactNode;
}

export function DownloadSettingsDialog({
  settings,
  onSaveSettings,
  trigger,
}: DownloadSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] =
    useState<DownloadSettings>(settings);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslations(); // 使用 i18n hook

  // 当对话框打开时，重置本地设置
  useEffect(() => {
    if (open) {
      setLocalSettings(settings);
    }
  }, [open, settings]);

  // 更新设置字段
  const updateSetting = <K extends keyof DownloadSettings>(
    key: K,
    value: DownloadSettings[K]
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 保存设置
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // 这里可以添加设置验证逻辑

      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSaveSettings(localSettings);
      toast.success(
        t("download.settings.saveSuccess", { defaultValue: "下载设置已保存" }),
        {
          description: t("download.settings.saveSuccessDescription", {
            defaultValue: "您的下载设置更改已成功保存",
          }),
        }
      );
      setOpen(false);
    } catch {
      toast.error(
        t("download.settings.saveError", { defaultValue: "保存设置失败" }),
        {
          description: t("download.settings.saveErrorDescription", {
            defaultValue: "无法保存下载设置，请重试",
          }),
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 浏览下载目录
  const handleBrowseDirectory = () => {
    // 在实际应用中，这里会调用系统的目录选择器
    // 现在模拟一个路径选择
    const samplePaths = [
      "C:\\Users\\User\\Downloads",
      "D:\\Software Downloads",
      "E:\\Program Files\\Applications",
    ];

    const randomPath =
      samplePaths[Math.floor(Math.random() * samplePaths.length)];
    updateSetting("downloadPath", randomPath);
    toast.info(
      t("download.settings.directorySelected", {
        defaultValue: "已选择下载目录",
      }),
      {
        description: randomPath,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            {t("download.settings.title", { defaultValue: "下载设置" })}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t("download.settings.title", { defaultValue: "下载设置" })}
          </DialogTitle>
          <DialogDescription>
            {t("download.settings.description", {
              defaultValue:
                "配置下载行为和偏好设置。这些设置将应用于所有新的下载任务。",
            })}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          {" "}
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">
              <Sliders className="h-4 w-4 mr-2" />
              {t("download.settings.tabs.general", {
                defaultValue: "一般设置",
              })}
            </TabsTrigger>
            <TabsTrigger value="connection">
              <Gauge className="h-4 w-4 mr-2" />
              {t("download.settings.tabs.connection", {
                defaultValue: "连接设置",
              })}
            </TabsTrigger>
            <TabsTrigger value="automation">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("download.settings.tabs.automation", {
                defaultValue: "自动化设置",
              })}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="p-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {" "}
                <Label htmlFor="download-path">
                  {t("download.settings.downloadDir", {
                    defaultValue: "下载目录",
                  })}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="download-path"
                    value={localSettings.downloadPath}
                    onChange={(e) =>
                      updateSetting("downloadPath", e.target.value)
                    }
                    placeholder={t("download.settings.selectDownloadPath", {
                      defaultValue: "选择下载保存路径",
                    })}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleBrowseDirectory}
                    className="shrink-0"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>{" "}
                <p className="text-xs text-muted-foreground">
                  {t("download.settings.downloadDirDesc", {
                    defaultValue: "所有下载的文件将保存到此目录",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-concurrent-downloads">
                  {t("download.settings.concurrentDownloads", {
                    defaultValue: "同时下载任务数",
                  })}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="max-concurrent-downloads"
                    min={1}
                    max={10}
                    step={1}
                    value={[localSettings.maxConcurrentDownloads]}
                    onValueChange={(values) =>
                      updateSetting("maxConcurrentDownloads", values[0])
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-6 text-center">
                    {localSettings.maxConcurrentDownloads}
                  </span>
                </div>{" "}
                <p className="text-xs text-muted-foreground">
                  {t("download.settings.concurrentDownloadsDesc", {
                    defaultValue: "设置可同时进行的最大下载任务数",
                  })}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label>
                {t("download.settings.defaultPriority", {
                  defaultValue: "默认下载优先级",
                })}
              </Label>
              <RadioGroup
                value={localSettings.defaultPriority}
                onValueChange={(value) =>
                  updateSetting(
                    "defaultPriority",
                    value as "high" | "normal" | "low"
                  )
                }
                className="flex gap-4 flex-wrap"
              >
                {" "}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high" className="cursor-pointer">
                    {t("download.settings.priorityHigh", {
                      defaultValue: "高",
                    })}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="priority-normal" />{" "}
                  <Label htmlFor="priority-normal" className="cursor-pointer">
                    {t("download.settings.priorityNormal", {
                      defaultValue: "中（推荐）",
                    })}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low" className="cursor-pointer">
                    {t("download.settings.priorityLow", { defaultValue: "低" })}
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {t("download.settings.defaultPriorityDesc", {
                  defaultValue: "设置新下载任务的默认优先级",
                })}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="connection" className="p-2 space-y-4">
            {" "}
            <div className="space-y-2">
              <Label htmlFor="speed-limit">
                {t("download.settings.speedLimit", {
                  defaultValue: "下载速度限制 (MB/s)",
                })}
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="speed-limit"
                  min={0}
                  max={100}
                  step={1}
                  value={[localSettings.speedLimit]}
                  onValueChange={(values) =>
                    updateSetting("speedLimit", values[0])
                  }
                  className="flex-1"
                />{" "}
                <span className="text-sm font-medium w-10 text-center">
                  {localSettings.speedLimit === 0
                    ? t("download.settings.unlimited", { defaultValue: "无限" })
                    : localSettings.speedLimit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("download.settings.speedLimitDesc", {
                  defaultValue: "设置为 0 表示无限制，根据您的网络情况调整此值",
                })}
              </p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              {" "}
              <Label>
                {t("download.settings.connectionType", {
                  defaultValue: "连接方式",
                })}
              </Label>
              <Select
                value={localSettings.connectionType}
                onValueChange={(value) =>
                  updateSetting(
                    "connectionType",
                    value as "auto" | "direct" | "proxy"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("download.settings.selectConnection", {
                      defaultValue: "选择连接方式",
                    })}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("download.settings.connectionType", {
                        defaultValue: "连接方式",
                      })}
                    </SelectLabel>
                    <SelectItem value="auto">
                      {t("download.settings.autoConnection", {
                        defaultValue: "自动选择最佳连接",
                      })}
                    </SelectItem>
                    <SelectItem value="direct">
                      {t("download.settings.directConnection", {
                        defaultValue: "直接连接",
                      })}
                    </SelectItem>
                    <SelectItem value="proxy">
                      {t("download.settings.proxyConnection", {
                        defaultValue: "使用代理服务器",
                      })}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t("download.settings.connectionDesc", {
                  defaultValue: "设置下载时使用的连接方式，可能影响下载速度",
                })}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="auto-retry"
                  checked={localSettings.autoRetry}
                  onCheckedChange={(checked) =>
                    updateSetting("autoRetry", checked === true)
                  }
                />{" "}
                <Label htmlFor="auto-retry" className="cursor-pointer">
                  {t("download.settings.autoRetry", {
                    defaultValue: "自动重试失败的下载",
                  })}
                </Label>
              </div>

              {localSettings.autoRetry && (
                <div className="pl-6">
                  <Label htmlFor="retry-attempts" className="text-sm">
                    {t("download.settings.retryAttempts", {
                      defaultValue: "重试次数",
                    })}
                  </Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="retry-attempts"
                      min={1}
                      max={10}
                      step={1}
                      value={[localSettings.retryAttempts]}
                      onValueChange={(values) =>
                        updateSetting("retryAttempts", values[0])
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-6 text-center">
                      {localSettings.retryAttempts}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="automation" className="p-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="auto-install"
                  checked={localSettings.autoInstall}
                  onCheckedChange={(checked) =>
                    updateSetting("autoInstall", checked === true)
                  }
                />{" "}
                <Label htmlFor="auto-install" className="cursor-pointer">
                  {t("download.settings.autoInstall", {
                    defaultValue: "下载完成后自动安装",
                  })}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {t("download.settings.autoInstallDesc", {
                  defaultValue: "启用后，下载完成的软件将自动启动安装程序",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="notify-completion"
                  checked={localSettings.notifyOnCompletion}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyOnCompletion", checked === true)
                  }
                />{" "}
                <Label htmlFor="notify-completion" className="cursor-pointer">
                  {t("download.settings.notifyCompletion", {
                    defaultValue: "下载完成时通知",
                  })}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {t("download.settings.notifyCompletionDesc", {
                  defaultValue: "启用后，下载完成时会显示系统通知",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="auto-update"
                  checked={localSettings.autoUpdate}
                  onCheckedChange={(checked) =>
                    updateSetting("autoUpdate", checked === true)
                  }
                />{" "}
                <Label htmlFor="auto-update" className="cursor-pointer">
                  {t("download.settings.autoUpdate", {
                    defaultValue: "自动检查软件更新",
                  })}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {t("download.settings.autoUpdateDesc", {
                  defaultValue: "启用后，系统将定期检查已安装软件的更新",
                })}
              </p>
            </div>
          </TabsContent>
        </Tabs>{" "}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel", { defaultValue: "取消" })}
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                {t("common.saving", { defaultValue: "保存中..." })}
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                {t("download.settings.saveButton", {
                  defaultValue: "保存设置",
                })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
