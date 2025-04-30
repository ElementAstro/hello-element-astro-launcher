import { Download, Search, Clock, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DURATION, EASE, iconVariants } from "./animation-variants";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: DURATION.normal, ease: EASE.decelerate }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto"
    >
      <motion.div 
        initial="initial"
        animate="animate"
        variants={iconVariants}
        className="text-muted-foreground mb-6"
      >
        {icon}
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: DURATION.normal }}
        className="text-xl font-medium"
      >
        {title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: DURATION.normal }}
        className="text-muted-foreground mt-2 max-w-sm"
      >
        {description}
      </motion.p>
      {(action || secondaryAction) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: DURATION.normal }}
          className="mt-6 flex flex-wrap gap-3 justify-center"
        >
          {action && (
            <Button
              variant="default"
              onClick={action.onClick}
              disabled={action.loading}
              className="min-w-[140px]"
            >
              {action.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                action.label
              )}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="min-w-[140px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function NoActiveDownloads({ 
  onBrowse, 
  isLoading 
}: { 
  onBrowse: () => void;
  isLoading?: boolean;
}) {
  return (
    <EmptyState
      icon={<Download className="h-16 w-16" />}
      title="无活跃下载"
      description="当前没有正在进行的下载任务。浏览可用软件开始下载安装。"
      action={{
        label: "浏览可用软件",
        onClick: onBrowse,
        loading: isLoading,
      }}
    />
  );
}

export function NoDownloadHistory({ 
  onBrowse 
}: { 
  onBrowse?: () => void 
}) {
  return (
    <EmptyState
      icon={<Clock className="h-16 w-16" />}
      title="无下载历史"
      description="完成下载后，您的下载历史记录将会显示在这里。"
      action={onBrowse ? {
        label: "浏览可用软件",
        onClick: onBrowse,
      } : undefined}
    />
  );
}

export function NoSearchResults({ 
  query,
  onClear
}: { 
  query: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="h-16 w-16" />}
      title="未找到结果"
      description={`没有找到与"${query}"匹配的软件。尝试使用不同的搜索词或浏览所有可用软件。`}
      action={{
        label: "清除搜索",
        onClick: onClear,
      }}
    />
  );
}

export function LoadingDownloads() {
  return (
    <EmptyState
      icon={<Loader2 className="h-16 w-16 animate-spin" />}
      title="加载中"
      description="正在获取下载列表，请稍候..."
    />
  );
}

export function NoConnection({ 
  onRetry 
}: { 
  onRetry: () => void 
}) {
  return (
    <EmptyState
      icon={<WifiOff className="h-16 w-16" />}
      title="连接错误"
      description="无法连接到下载服务器。请检查您的网络连接，然后重试。"
      action={{
        label: "重试连接",
        onClick: onRetry,
      }}
    />
  );
}