import { useState, useEffect } from "react";
import { Download, DownloadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Software } from "@/types";
import { useAppStore } from "@/store/store";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

interface BatchDownloadDialogProps {
  onBatchDownload: (
    ids: number[],
    options?: { priority?: "low" | "normal" | "high" }
  ) => void;
  isDownloading?: boolean;
  trigger?: React.ReactNode;
}

interface SelectableSoftware extends Software {
  selected: boolean;
}

export function BatchDownloadDialog({
  onBatchDownload,
  isDownloading = false,
  trigger,
}: BatchDownloadDialogProps) {
  // 使用全局状态中的software
  const { software } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selectableSoftware, setSelectableSoftware] = useState<
    SelectableSoftware[]
  >([]);
  const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
  const [sortBy, setSortBy] = useState<"name" | "size" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { t } = useTranslations(); // 使用 i18n hook

  // 初始化可选择的软件列表
  useEffect(() => {
    if (open) {
      setSelectableSoftware(
        software
          .filter((s) => !s.installed) // 默认只显示未安装的软件
          .map((s) => ({ ...s, selected: false }))
      );
    }
  }, [software, open]);

  // 获取所选软件的总大小
  const getSelectedSize = () => {
    const selectedItems = selectableSoftware.filter((s) => s.selected);
    let totalSize = 0;

    selectedItems.forEach((item) => {
      // 从文本大小中提取数字部分
      const sizeMatch = item.size.match(/(\d+(\.\d+)?)/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[0]);
        const unit = item.size.toLowerCase();

        // 换算为MB
        if (unit.includes("kb")) {
          totalSize += size / 1024;
        } else if (unit.includes("gb")) {
          totalSize += size * 1024;
        } else {
          // 默认为MB
          totalSize += size;
        }
      }
    });

    // 格式化大小显示
    if (totalSize < 1) {
      return `${(totalSize * 1024).toFixed(0)} KB`;
    } else if (totalSize > 1024) {
      return `${(totalSize / 1024).toFixed(1)} GB`;
    } else {
      return `${totalSize.toFixed(1)} MB`;
    }
  };

  // 切换软件选择状态
  const toggleSoftwareSelection = (id: number) => {
    setSelectableSoftware((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 切换全选/取消全选
  const toggleSelectAll = (select: boolean) => {
    setSelectableSoftware((prev) =>
      prev.map((item) => ({ ...item, selected: select }))
    );
  };

  // 排序软件列表
  const sortSoftwareList = () => {
    setSelectableSoftware((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "size") {
          // 简单的大小排序，实际应用中可能需要更复杂的逻辑
          const sizeA = parseFloat(a.size.match(/(\d+(\.\d+)?)/)?.[0] || "0");
          const sizeB = parseFloat(b.size.match(/(\d+(\.\d+)?)/)?.[0] || "0");
          return sizeA - sizeB;
        } else if (sortBy === "category") {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });

      return sortDirection === "asc" ? sorted : sorted.reverse();
    });
  };

  // 当排序方式改变时，重新排序
  useEffect(() => {
    sortSoftwareList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortDirection]);

  // 启动批量下载
  const handleBatchDownload = () => {
    const selectedIds = selectableSoftware
      .filter((item) => item.selected)
      .map((item) => item.id);

    if (selectedIds.length > 0) {
      onBatchDownload(selectedIds, { priority });
      setOpen(false);
    }
  };

  // 计算选择的软件数量
  const selectedCount = selectableSoftware.filter((s) => s.selected).length;

  // 切换排序方向
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 更改排序字段
  const changeSortBy = (field: "name" | "size" | "category") => {
    if (sortBy === field) {
      toggleSortDirection();
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // 获取表格排序图标和样式
  const getSortIndicator = (field: string) => {
    if (sortBy === field) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 h-7 text-xs">
            <DownloadCloud className="h-3.5 w-3.5" />
            {t("download.batch.button", { defaultValue: "批量下载" })}
          </Button>
        )}{" "}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden p-3">
        <DialogHeader className="pb-1.5">
          <DialogTitle className="text-base">
            {t("download.batch.title", { defaultValue: "批量下载软件" })}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t("download.batch.description", {
              defaultValue:
                "选择要批量下载的软件，可以一次性添加多个下载任务到队列",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="select-all"
                checked={
                  selectableSoftware.length > 0 &&
                  selectableSoftware.every((s) => s.selected)
                }
                onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                className="h-3.5 w-3.5"
              />
              <label
                htmlFor="select-all"
                className="text-xs cursor-pointer select-none"
              >
                {t("download.batch.selectAll", { defaultValue: "全选" })}
              </label>

              <Separator orientation="vertical" className="mx-1.5 h-3.5" />

              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">
                  {t("download.batch.sort", { defaultValue: "排序:" })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeSortBy("name")}
                  className="h-6 px-1.5 text-xs font-normal"
                >
                  {t("download.batch.sortName", { defaultValue: "名称" })}{" "}
                  {getSortIndicator("name")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeSortBy("size")}
                  className="h-6 px-1.5 text-xs font-normal"
                >
                  {t("download.batch.sortSize", { defaultValue: "大小" })}{" "}
                  {getSortIndicator("size")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeSortBy("category")}
                  className="h-6 px-1.5 text-xs font-normal"
                >
                  {t("download.batch.sortCategory", { defaultValue: "分类" })}{" "}
                  {getSortIndicator("category")}
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-1.5">
              <span className="text-xs">
                {t("download.batch.priority", { defaultValue: "下载优先级:" })}
              </span>
              <div className="flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={priority === "low" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriority("low")}
                      className="rounded-r-none h-6 text-xs"
                    >
                      {t("download.batch.priorityLow", { defaultValue: "低" })}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("download.batch.priorityLowTip", {
                      defaultValue: "低优先级",
                    })}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={priority === "normal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriority("normal")}
                      className="rounded-none border-x-0 h-6 text-xs"
                    >
                      {t("download.batch.priorityNormal", {
                        defaultValue: "中",
                      })}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("download.batch.priorityNormalTip", {
                      defaultValue: "正常优先级",
                    })}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={priority === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriority("high")}
                      className="rounded-l-none h-6 text-xs"
                    >
                      {t("download.batch.priorityHigh", { defaultValue: "高" })}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("download.batch.priorityHighTip", {
                      defaultValue: "高优先级",
                    })}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>{" "}
          <ScrollArea className="h-[220px] border rounded-md">
            <div className="p-1.5 space-y-1">
              {selectableSoftware.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-center">
                  <DownloadCloud className="h-8 w-8 text-muted-foreground mb-1.5 opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    {t("download.batch.noSoftware", {
                      defaultValue: "没有可用的软件下载",
                    })}
                  </p>
                </div>
              ) : (
                selectableSoftware.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center p-1.5 rounded-md ${
                      item.selected
                        ? "bg-primary/5 border border-primary/30"
                        : "border"
                    } transition-colors hover:bg-accent`}
                  >
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => toggleSoftwareSelection(item.id)}
                      className="mr-2 h-3 w-3"
                    />
                    <div className="flex-1 flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-background rounded-md flex items-center justify-center border overflow-hidden">                        {item.icon ? (
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Download className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[11px]">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span>v{item.version}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="ml-auto text-[9px] h-4 px-1 py-0"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>{" "}
        <div className="mt-2">
          <Alert
            className={`${
              selectedCount > 0 ? "bg-primary/5" : "bg-muted"
            } py-1 px-2`}
          >
            <DownloadCloud className="h-3 w-3" />
            <AlertTitle className="text-[11px]">
              {t("download.batch.selectedCount", {
                params: { count: selectedCount },
                defaultValue: "已选择 {{count}} 个软件",
              })}
            </AlertTitle>
            <AlertDescription>
              {selectedCount > 0 ? (
                <div className="text-[10px]">
                  {t("download.batch.totalSize", { defaultValue: "总大小" })}:{" "}
                  {getSelectedSize()}，
                  {t("download.batch.queue", {
                    defaultValue: "将按队列顺序下载",
                  })}
                </div>
              ) : (
                <div className="text-[10px]">
                  {t("download.batch.selectPrompt", {
                    defaultValue: "请选择要下载的软件",
                  })}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter className="gap-1.5 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-7 text-xs"
          >
            {t("common.cancel", { defaultValue: "取消" })}
          </Button>
          <Button
            size="sm"
            onClick={handleBatchDownload}
            disabled={selectedCount === 0 || isDownloading}
            className="min-w-[100px] h-7 text-xs"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                {t("download.batch.downloading", { defaultValue: "处理中..." })}
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {t("download.batch.download", {
                  defaultValue: "开始下载",
                })}{" "}
                {selectedCount > 0 && `(${selectedCount})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
