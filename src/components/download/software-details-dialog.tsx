import { useState } from "react";
import {
  Download,
  ExternalLink,
  Copy,
  CheckCircle2,
  Calendar,
  Package,
  AlertCircle,
  Star,
  Tag,
  History,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Software } from "@/types";
import { useTranslations } from "@/components/i18n/client";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface AdditionalOption {
  label: string;
  value: string;
  type: string;
  description?: string;
}

interface SoftwareDetailsDialogProps {
  software: Software & {
    changelog?: ChangelogEntry[];
    additionalOptions?: AdditionalOption[];
    systemRequirements?: Record<string, string>;
  };
  onDownload: (options?: { priority?: string; installPath?: string }) => void;
  isDownloading?: boolean;
  trigger?: React.ReactNode;
}

export function SoftwareDetailsDialog({
  software,
  onDownload,
  isDownloading = false,
  trigger,
}: SoftwareDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [installPath, setInstallPath] = useState<string>(
    software.defaultInstallPath || ""
  );
  const [downloadPriority, setDownloadPriority] = useState<string>("normal");
  const [copied, setCopied] = useState(false);
  const { t } = useTranslations(); // 使用 i18n hook

  // 处理复制软件信息
  const handleCopy = () => {
    const softwareInfo = `
${software.name} (${software.version})
${software.description}
${t("download.software.size", { defaultValue: "大小" })}: ${software.size}
${t("download.software.developer", { defaultValue: "开发者" })}: ${
      software.developer
    }
${t("download.software.releaseDate", { defaultValue: "发布日期" })}: ${
      software.releaseDate
    }
    `;

    navigator.clipboard.writeText(softwareInfo.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 处理下载按钮点击
  const handleDownload = () => {
    onDownload({
      priority: downloadPriority,
      installPath: installPath || software.defaultInstallPath,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            {t("download.software.viewDetails", { defaultValue: "查看详情" })}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <img
                src={software.icon || "/placeholder.svg"}
                alt={software.name}
                className="w-10 h-10 rounded-md"
              />
              <div className="space-y-1">
                <DialogTitle className="text-xl flex items-center gap-2">
                  {software.name}
                  <Badge variant="outline" className="text-xs font-mono ml-1">
                    {software.version}
                  </Badge>
                  {software.verified && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("download.software.verified", {
                          defaultValue: "已验证的软件",
                        })}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </DialogTitle>
                <DialogDescription className="text-sm flex items-center gap-2">
                  <span>{software.developer}</span>
                  {software.website && (
                    <a
                      href={software.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-blue-500 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {t("download.software.website", { defaultValue: "官网" })}
                    </a>
                  )}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(software.rating || 0)
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                {software.rating && (
                  <span className="ml-1 text-sm font-medium">
                    {software.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t("download.software.copyInfo", {
                    defaultValue: "复制软件信息",
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6 flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">
              {t("download.software.tabs.overview", { defaultValue: "概述" })}
            </TabsTrigger>
            <TabsTrigger value="requirements">
              {t("download.software.tabs.requirements", {
                defaultValue: "系统需求",
              })}
            </TabsTrigger>
            <TabsTrigger value="changelog">
              {t("download.software.tabs.changelog", {
                defaultValue: "更新日志",
              })}
            </TabsTrigger>
            <TabsTrigger value="additional">
              {t("download.software.tabs.additional", {
                defaultValue: "其他信息",
              })}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-4">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-4">
                <p>{software.description}</p>

                {software.tags && software.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t("download.software.tags", { defaultValue: "标签" })}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {software.tags.map((tag, index) => (
                        <Badge
                          variant="outline"
                          key={index}
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t("download.software.details", {
                        defaultValue: "详细信息",
                      })}
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">
                            {t("download.software.category", {
                              defaultValue: "分类",
                            })}
                          </div>
                          <div>{software.category}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">
                            {t("download.software.size", {
                              defaultValue: "大小",
                            })}
                          </div>
                          <div>{software.size}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">
                            {t("download.software.releaseDate", {
                              defaultValue: "发布日期",
                            })}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 inline" />
                            {software.releaseDate ||
                              t("download.software.unknown", {
                                defaultValue: "未知",
                              })}
                          </div>
                        </div>
                        {software.license && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">
                              {t("download.software.license", {
                                defaultValue: "许可证",
                              })}
                            </div>
                            <div>{software.license}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {software.dependencies &&
                    software.dependencies.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          {t("download.software.dependencies", {
                            defaultValue: "依赖项",
                          })}
                        </h3>
                        <Card>
                          <CardContent className="p-4 max-h-[150px] overflow-auto">
                            <ul className="space-y-2">
                              {software.dependencies.map((dep, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <Package className="h-3 w-3 mr-1.5 text-muted-foreground" />
                                    <span>{dep.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {dep.version}
                                    </Badge>
                                    {dep.required && (
                                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">
                                        {t("download.software.required", {
                                          defaultValue: "必需",
                                        })}
                                      </Badge>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-0">
              <div className="space-y-4">
                {software.systemRequirements ? (
                  <>
                    <h3 className="text-sm font-medium mb-2">
                      {t("download.software.minimumRequirements", {
                        defaultValue: "最低系统要求",
                      })}
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        {Object.entries(software.systemRequirements || {}).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="grid grid-cols-2 gap-2 text-sm"
                            >
                              <div className="text-muted-foreground">{key}</div>
                              <div>{String(value)}</div>
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">
                      {t("download.software.noRequirementsInfo", {
                        defaultValue: "没有提供系统需求信息",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="changelog" className="mt-0">
              <div className="space-y-4">
                {software.changelog && software.changelog.length > 0 ? (
                  <>
                    <h3 className="text-sm font-medium mb-2">
                      {t("download.software.releaseNotes", {
                        defaultValue: "发布说明",
                      })}
                    </h3>
                    <div className="space-y-4">
                      {software.changelog?.map((release: ChangelogEntry, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="flex items-center gap-1">
                                <History className="h-3 w-3" />
                                {t("download.software.version", {
                                  defaultValue: "版本",
                                })}{" "}
                                {release.version}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {release.date}
                              </span>
                            </div>
                            <ul className="text-sm space-y-1 mt-2">
                              {release.changes.map((change: string, changeIndex: number) => (
                                <li
                                  key={changeIndex}
                                  className="flex items-start"
                                >
                                  <span className="mr-2">•</span>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">
                      {t("download.software.noChangelogInfo", {
                        defaultValue: "没有提供更新日志信息",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="additional" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium mb-2">
                  {t("download.software.downloadOptions", {
                    defaultValue: "下载选项",
                  })}
                </h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="installPath">
                        {t("download.software.installPath", {
                          defaultValue: "安装路径",
                        })}
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div className="md:col-span-3">
                          <input
                            id="installPath"
                            value={installPath}
                            onChange={(e) => setInstallPath(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={software.defaultInstallPath}
                          />
                        </div>
                        <Button variant="outline" className="h-9">
                          {t("download.software.browse", {
                            defaultValue: "浏览...",
                          })}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="priority">
                        {t("download.software.downloadPriority", {
                          defaultValue: "下载优先级",
                        })}
                      </Label>
                      <Select
                        value={downloadPriority}
                        onValueChange={setDownloadPriority}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            {t("download.software.priorityHigh", {
                              defaultValue: "高",
                            })}
                          </SelectItem>
                          <SelectItem value="normal">
                            {t("download.software.priorityNormal", {
                              defaultValue: "中",
                            })}
                          </SelectItem>
                          <SelectItem value="low">
                            {t("download.software.priorityLow", {
                              defaultValue: "低",
                            })}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {software.additionalOptions && (
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Settings className="h-3.5 w-3.5 mr-1.5" />
                          {t("download.software.advancedOptions", {
                            defaultValue: "高级选项",
                          })}
                        </h4>
                        <div className="grid gap-4">
                          {software.additionalOptions?.map((option: AdditionalOption, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id={`option-${index}`}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <div>
                                <label
                                  htmlFor={`option-${index}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {option.label}
                                </label>
                                {option.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel", { defaultValue: "取消" })}
          </Button>

          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                {t("download.software.downloading", {
                  defaultValue: "下载中...",
                })}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t("download.software.downloadNow", {
                  defaultValue: "立即下载",
                })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
