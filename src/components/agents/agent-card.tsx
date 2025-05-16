import {
  Calendar,
  Clock,
  Copy,
  Edit,
  MoreHorizontal,
  Pause,
  Play,
  Terminal,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { AgentStatusBadge } from "./agent-status-badge";
import { agentsApi } from "./agents-api";
import type { Agent } from "@/types/agent";
import { useTranslations } from "@/components/i18n/client";

interface AgentCardProps {
  agent: Agent;
  onRun?: (id: string) => Promise<void> | void;
  onStop?: (id: string) => Promise<void> | void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
  onDuplicate?: (id: string) => Promise<void> | void;
}

export function AgentCard({
  agent,
  onRun,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
  onDuplicate,
}: AgentCardProps) {
  const { t } = useTranslations();
  const [isRunning, setIsRunning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async (id: string) => {
    try {
      setIsRunning(true);
      setError(null);

      // 直接使用 agentsApi 服务运行代理
      await agentsApi.runAgent(id);

      // 如果提供了回调，也执行回调
      if (onRun) await onRun(id);

      toast.success(
        t("agent.run.success", {
          params: { name: agent.name },
          defaultValue: `代理 "${agent.name}" 启动成功`,
        })
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("agent.run.error", { defaultValue: "启动代理失败" });
      setError(errorMsg);
      toast.error(t("agent.run.error", { defaultValue: "启动代理失败" }), {
        description: errorMsg,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      setIsStopping(true);
      setError(null);

      // 直接使用 agentsApi 服务停止代理
      await agentsApi.stopAgent(id);

      // 如果提供了回调，也执行回调
      if (onStop) await onStop(id);

      toast.success(
        t("agent.stop.success", {
          params: { name: agent.name },
          defaultValue: `代理 "${agent.name}" 已停止`,
        })
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("agent.stop.error", { defaultValue: "停止代理失败" });
      setError(errorMsg);
      toast.error(t("agent.stop.error", { defaultValue: "停止代理失败" }), {
        description: errorMsg,
      });
    } finally {
      setIsStopping(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setIsDuplicating(true);
      setError(null);

      // 直接使用 agentsApi 服务复制代理
      await agentsApi.duplicateAgent(id);

      // 如果提供了回调，也执行回调
      if (onDuplicate) await onDuplicate(id);

      toast.success(
        t("agent.duplicate.success", {
          params: { name: agent.name },
          defaultValue: `代理 "${agent.name}" 复制成功`,
        })
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("agent.duplicate.error", { defaultValue: "复制代理失败" });
      toast.error(
        t("agent.duplicate.error", { defaultValue: "复制代理失败" }),
        {
          description: errorMsg,
        }
      );
    } finally {
      setIsDuplicating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date)
        ? format(date, "MMM d, yyyy HH:mm")
        : t("common.invalidDate", { defaultValue: "无效日期" });
    } catch {
      return t("common.invalidDateFormat", { defaultValue: "日期格式无效" });
    }
  };
  const lastRunFormatted = formatDate(agent.lastRun);
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
        duration: 0.2,
      },
    },
    hover: {
      scale: 1.005, // 缩小悬停效果
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.08)", // 减小阴影
      transition: { type: "spring", stiffness: 400, damping: 20 },
    },
    tap: { scale: 0.99 }, // 减小点击效果
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      data-testid={`agent-card-${agent.id}`}
      aria-label={t("agent.ariaLabel", {
        params: { name: agent.name },
        defaultValue: `代理: ${agent.name}`,
      })}
    >
      <Card className={`${error ? "border-destructive" : ""} border-[0.5px]`}>
        <CardHeader className="pb-0 pt-2 px-2.5">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-1.5 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {agent.name}
                <AgentStatusBadge status={agent.status} />
              </CardTitle>
              <CardDescription className="mt-0.5 line-clamp-1 text-xs max-w-[90%]">
                {agent.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1"
                        aria-label={t("common.moreOptions", {
                          defaultValue: "更多选项",
                        })}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs py-1">
                    <p>
                      {t("common.moreOptions", { defaultValue: "更多选项" })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
              <DropdownMenuContent align="end" className="min-w-[130px]">
                <DropdownMenuItem onClick={onEdit} className="py-1.5 text-xs">
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  {t("common.edit", { defaultValue: "编辑" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onViewLogs}
                  className="py-1.5 text-xs"
                >
                  <Terminal className="h-3.5 w-3.5 mr-1.5" />
                  {t("agent.viewLogs", { defaultValue: "查看日志" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDuplicate(agent.id)}
                  disabled={isDuplicating}
                  className="py-1.5 text-xs"
                >
                  {isDuplicating ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {isDuplicating
                    ? t("agent.duplicating", { defaultValue: "复制中..." })
                    : t("common.duplicate", { defaultValue: "复制" })}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5" />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive py-1.5 text-xs"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t("common.delete", { defaultValue: "删除" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>{" "}
        <CardContent className="pt-1 pb-1.5 px-2.5">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-1 p-1 bg-destructive/10 text-destructive rounded-md flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="text-[0.65rem]">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-1 items-center">
            <div className="space-y-0">
              <div className="flex items-center text-[0.65rem] text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[120px]">
                  {t("agent.type", { defaultValue: "类型" })}:{" "}
                  {t(`agent.types.${agent.type}`, {
                    defaultValue:
                      agent.type.charAt(0).toUpperCase() + agent.type.slice(1),
                  })}
                </span>
              </div>
              {agent.lastRun && (
                <div className="flex items-center text-[0.65rem] text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[120px]">
                    {t("agent.lastRun", { defaultValue: "上次运行" })}:{" "}
                    {lastRunFormatted}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-1 self-end">
              {agent.status === "running" ? (
                <Button
                  variant="outline"
                  onClick={() => handleStop(agent.id)}
                  disabled={isStopping}
                  size="sm"
                  className="h-6 text-[0.65rem] px-1.5 py-0"
                  aria-label={t("agent.stopAgent", {
                    defaultValue: "停止代理",
                  })}
                >
                  {isStopping ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Pause className="h-3 w-3 mr-1" />
                  )}
                  {isStopping
                    ? t("agent.stopping", { defaultValue: "停止中..." })
                    : t("agent.stop", { defaultValue: "停止" })}
                </Button>
              ) : (
                <Button
                  onClick={() => handleRun(agent.id)}
                  disabled={isRunning}
                  size="sm"
                  className="h-6 text-[0.65rem] px-1.5 py-0"
                  aria-label={t("agent.runAgent", { defaultValue: "运行代理" })}
                >
                  {isRunning ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  {isRunning
                    ? t("agent.starting", { defaultValue: "启动中..." })
                    : t("agent.run", { defaultValue: "运行" })}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
