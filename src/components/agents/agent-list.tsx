import { Plus, Terminal, ServerOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentCard } from "./agent-card";
import { useState, useEffect } from "react";
import { containerVariants, itemVariants } from "./constants";
import { agentsApi } from "./agents-api";
import { toast } from "sonner";
import type { Agent } from "@/types/agent";
import { useTranslations } from "@/components/i18n/client";

interface AgentListProps {
  agents: Agent[];
  isLoading: boolean;
  searchQuery: string;
  error?: string | null;
  onRunAgent?: (id: string) => Promise<void> | void;
  onStopAgent?: (id: string) => Promise<void> | void;
  onEditAgent: (id: string) => void;
  onDeleteAgent: (id: string) => void;
  onViewLogs: (agent: Agent) => void;
  onCreateAgent: () => void;
  onRetry?: () => void;
  onDuplicateAgent?: (id: string) => Promise<void> | void;
}

export function AgentList({
  agents,
  isLoading,
  searchQuery,
  error = null,
  onRunAgent,
  onStopAgent,
  onEditAgent,
  onDeleteAgent,
  onViewLogs,
  onCreateAgent,
  onRetry,
  onDuplicateAgent,
}: AgentListProps) {
  const { t } = useTranslations();
  const [expandedError, setExpandedError] = useState(false);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  
  // 初始化运行中的代理状态
  useEffect(() => {
    const running = new Set<string>();
    agents.forEach(agent => {
      if (agent.status === "running") {
        running.add(agent.id);
      }
    });
    setRunningAgents(running);
  }, [agents]);

  // 处理代理运行
  const handleRunAgent = async (id: string) => {
    try {
      setRunningAgents(prev => new Set(prev).add(id));
      
      // 调用代理 API
      await agentsApi.runAgent(id);
      
      // 如果提供了回调，调用回调
      if (onRunAgent) await onRunAgent(id);
      
    } catch (err) {
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      toast.error(t("agent.run.error", { defaultValue: "启动代理失败" }), {
        description: err instanceof Error ? err.message : t("common.tryAgain", { defaultValue: "请重试" }),
      });
    }
  };

  // 处理代理停止
  const handleStopAgent = async (id: string) => {
    try {
      // 调用代理 API
      await agentsApi.stopAgent(id);
      
      // 如果提供了回调，调用回调
      if (onStopAgent) await onStopAgent(id);
      
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      toast.error(t("agent.stop.error", { defaultValue: "停止代理失败" }), {
        description: err instanceof Error ? err.message : t("common.tryAgain", { defaultValue: "请重试" }),
      });
    }
  };

  // 处理代理复制
  const handleDuplicateAgent = async (id: string) => {
    try {
      // 调用代理 API
      const duplicatedAgent = await agentsApi.duplicateAgent(id);
      
      toast.success(t("agent.duplicate.success", { defaultValue: "代理复制成功" }), {
        description: t("agent.duplicate.description", { params: { name: duplicatedAgent.name }, defaultValue: `已创建代理副本 "${duplicatedAgent.name}"` }),
      });
      
      // 如果提供了回调，调用回调
      if (onDuplicateAgent) await onDuplicateAgent(id);
      
    } catch (err) {
      toast.error(t("agent.duplicate.error", { defaultValue: "复制代理失败" }), {
        description: err instanceof Error ? err.message : t("common.tryAgain", { defaultValue: "请重试" }),
      });
    }
  };

  // Animation variants for error state
  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: i * 0.1,
              duration: 0.4,
            },
          }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full max-w-xs" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="space-y-2 w-full md:w-auto">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-24 mt-4 md:mt-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-center text-sm text-muted-foreground mt-6"
      >
        {t("agent.list.loading", { defaultValue: "加载代理中..." })}
      </motion.div>
    </motion.div>
  );

  // Error state component
  const ErrorState = () => (
    <motion.div
      key="error"
      variants={errorVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="rounded-full bg-destructive/10 text-destructive p-3 mb-4">
        <ServerOff className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium">{t("agent.list.loadError", { defaultValue: "加载代理失败" })}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md">
        {t("agent.list.errorMessage", { defaultValue: "加载代理时发生错误，请重试。" })}
      </p>

      {error && (
        <motion.div
          className="mb-4 max-w-md"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expandedError ? "auto" : "0px",
            opacity: expandedError ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-left">
            <p className="font-mono text-xs overflow-auto max-h-32 whitespace-pre-wrap">
              {error}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {error && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedError(!expandedError)}
          >
            {expandedError ? 
              t("common.hideDetails", { defaultValue: "隐藏详情" }) : 
              t("common.showDetails", { defaultValue: "显示详情" })}
          </Button>
        )}
        {onRetry && <Button onClick={onRetry}>{t("common.retry", { defaultValue: "重试" })}</Button>}
      </div>
    </motion.div>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        className="rounded-full bg-muted p-3 mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Terminal className="h-6 w-6 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-medium">{t("agent.list.notFound", { defaultValue: "未找到代理" })}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md">
        {searchQuery
          ? t("agent.list.noMatchSearch", { defaultValue: "没有代理匹配您的搜索条件。请尝试不同的搜索词。" })
          : t("agent.list.noAgentsCreated", { defaultValue: "您尚未创建任何代理。创建您的第一个代理以自动化您的天文工作流程。" })}
      </p>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button onClick={onCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          {t("agent.create", { defaultValue: "创建代理" })}
        </Button>
      </motion.div>
    </motion.div>
  );

  // Agent list component
  const AgentsList = () => (
    <motion.div
      key="agents"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {agents.map((agent) => (
        <motion.div
          key={agent.id}
          variants={itemVariants}
          layout
          className="will-change-transform"
          data-testid={`agent-list-item-${agent.id}`}
        >
          <AgentCard
            agent={{
              ...agent,
              status: runningAgents.has(agent.id) ? "running" : agent.status,
            }}
            onRun={handleRunAgent}
            onStop={handleStopAgent}
            onEdit={() => onEditAgent(agent.id)}
            onDelete={() => onDeleteAgent(agent.id)}
            onViewLogs={() => onViewLogs(agent)}
            onDuplicate={handleDuplicateAgent}
          />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState />
      ) : agents.length === 0 ? (
        <EmptyState />
      ) : (
        <AgentsList />
      )}
    </AnimatePresence>
  );
}
