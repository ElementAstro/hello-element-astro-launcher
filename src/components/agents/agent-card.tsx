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
      
      toast.success(`代理 "${agent.name}" 启动成功`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "启动代理失败";
      setError(errorMsg);
      toast.error("启动代理失败", {
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
      
      toast.success(`代理 "${agent.name}" 已停止`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "停止代理失败";
      setError(errorMsg);
      toast.error("停止代理失败", {
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
      
      toast.success(`代理 "${agent.name}" 复制成功`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "复制代理失败";
      toast.error("复制代理失败", {
        description: errorMsg,
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy HH:mm") : "无效日期";
    } catch {
      return "日期格式无效";
    }
  };

  const lastRunFormatted = formatDate(agent.lastRun);
  const nextRunFormatted = formatDate(agent.nextRun);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      data-testid={`agent-card-${agent.id}`}
      aria-label={`代理: ${agent.name}`}
    >
      <Card className={error ? "border-destructive" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {agent.name}
                <AgentStatusBadge status={agent.status} />
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {agent.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="更多选项"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>更多选项</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewLogs}>
                  <Terminal className="h-4 w-4 mr-2" />
                  查看日志
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDuplicate(agent.id)}
                  disabled={isDuplicating}
                >
                  {isDuplicating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isDuplicating ? "复制中..." : "复制"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-3 p-2 bg-destructive/10 text-destructive rounded-md flex items-center text-sm"
              >
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-xs">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <motion.div
                className="flex items-center text-sm text-muted-foreground"
                whileHover={{ scale: 1.01 }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  类型:{" "}
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </span>
              </motion.div>
              {agent.lastRun && (
                <motion.div
                  className="flex items-center text-sm text-muted-foreground"
                  whileHover={{ scale: 1.01 }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span>上次运行: {lastRunFormatted}</span>
                </motion.div>
              )}
              {agent.nextRun && (
                <motion.div
                  className="flex items-center text-sm text-muted-foreground"
                  whileHover={{ scale: 1.01 }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>下次运行: {nextRunFormatted}</span>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 self-end">
              {agent.status === "running" ? (
                <Button
                  variant="outline"
                  onClick={() => handleStop(agent.id)}
                  disabled={isStopping}
                  aria-label="停止代理"
                >
                  {isStopping ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  {isStopping ? "停止中..." : "停止"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleRun(agent.id)}
                  disabled={isRunning}
                  aria-label="运行代理"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? "启动中..." : "运行"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
