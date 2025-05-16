import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Terminal, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, isValid } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { agentsApi } from "./agents-api";
import type { AgentLog } from "@/types/agent";
import { useTranslations } from "@/components/i18n/client";

interface AgentLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs?: AgentLog[];
  agentName?: string;
  agentId?: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

export function AgentLogsDialog({
  open,
  onOpenChange,
  logs: initialLogs = [],
  agentName = "代理",
  agentId,
  isLoading: externalLoading = false,
  onRefresh: externalRefresh,
}: AgentLogsDialogProps) {
  const { t } = useTranslations();
  const [logs, setLogs] = useState<AgentLog[]>(initialLogs);
  const [isLoading, setIsLoading] = useState<boolean>(externalLoading);
  const [error, setError] = useState<string | null>(null);

  // 更新useEffect以在initialLogs变化时更新logs状态
  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  // 使用useCallback包装fetchLogs函数
  const fetchLogs = useCallback(async () => {
    // 如果没有 agentId，不执行操作
    if (!agentId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 使用 agentsApi 获取最新日志
      const fetchedLogs = await agentsApi.getAgentLogs(agentId);
      setLogs(fetchedLogs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("agent.logs.fetchError", { defaultValue: "获取日志失败" })
      );
    } finally {
      setIsLoading(false);
    }
  }, [agentId, t]);

  // 当弹窗打开或 agentId 变化时，如果有 agentId 则获取日志
  useEffect(() => {
    if (open && agentId) {
      fetchLogs();
    }
  }, [open, agentId, fetchLogs]);

  // 处理刷新
  const handleRefresh = async () => {
    if (externalRefresh) {
      await externalRefresh();
    } else {
      await fetchLogs();
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date)
        ? format(date, "yyyy-MM-dd HH:mm:ss")
        : t("common.invalidDate", { defaultValue: "无效日期" });
    } catch {
      return t("common.invalidDateFormat", { defaultValue: "日期格式错误" });
    }
  };

  // 根据日志级别获取样式
  const getLevelStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-warning/10 text-warning";
      case "info":
        return "bg-primary/10 text-primary";
      case "debug":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] max-h-[32rem] flex flex-col">
        <DialogHeader className="pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-1.5 text-base">
              <Terminal className="h-4 w-4" />
              {t("agent.logs.title", {
                params: { name: agentName },
                defaultValue: `${agentName} 日志`,
              })}
            </DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-7 w-7"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-7 w-7"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <DialogDescription className="text-xs">
            {t("agent.logs.description", {
              defaultValue: "查看代理活动日志和状态变更记录",
            })}
          </DialogDescription>
        </DialogHeader>{" "}
        <ScrollArea className="flex-1 border rounded-md">
          {" "}
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-2 max-w-xs">
                <p className="text-destructive text-xs mb-1">
                  {t("agent.logs.error", { defaultValue: "获取日志时出错" })}
                </p>
                <p className="text-[0.65rem] text-muted-foreground mb-2">
                  {error}
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs px-2"
                >
                  {t("common.retry", { defaultValue: "重试" })}
                </Button>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-2">
                <p className="text-muted-foreground text-xs">
                  {t("agent.logs.empty", { defaultValue: "暂无日志记录" })}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px] py-1 text-[0.65rem]">
                    {t("agent.logs.time", { defaultValue: "时间" })}
                  </TableHead>
                  <TableHead className="w-[70px] py-1 text-[0.65rem]">
                    {t("agent.logs.level", { defaultValue: "级别" })}
                  </TableHead>
                  <TableHead className="py-1 text-[0.65rem]">
                    {t("agent.logs.message", { defaultValue: "消息" })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow
                    key={log.id || index}
                    className="group hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-[0.65rem] py-1 px-2">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <Badge
                        variant="outline"
                        className={`${getLevelStyle(
                          log.level
                        )} text-[0.65rem] px-1 py-0 h-3.5`}
                      >
                        {t(`agent.logs.levels.${log.level.toLowerCase()}`, {
                          defaultValue: log.level,
                        })}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 px-2 text-[0.65rem]">
                      {" "}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: index * 0.02,
                          duration: 0.15,
                        }}
                      >
                        {log.message}
                      </motion.div>
                      {log.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-0.5 text-[0.65rem] leading-tight text-muted-foreground bg-muted/50 p-1 rounded overflow-x-auto"
                        >
                          <pre className="whitespace-pre-wrap break-all text-[0.65rem] leading-tight max-h-16 overflow-y-auto">
                            {typeof log.details === "string"
                              ? log.details
                              : (JSON.stringify(
                                  log.details,
                                  null,
                                  2
                                ) as string)}
                          </pre>
                        </motion.div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
