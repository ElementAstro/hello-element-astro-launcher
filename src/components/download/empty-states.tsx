import { Download, Search, Clock, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DURATION, EASE, iconVariants } from "./animation-variants";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

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
  secondaryAction,
}: EmptyStateProps) {
  const { t } = useTranslations(); // 使用 i18n hook

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
                  {t("common.loading", { defaultValue: "加载中..." })}
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
  isLoading,
}: {
  onBrowse: () => void;
  isLoading?: boolean;
}) {
  const { t } = useTranslations(); // 使用 i18n hook

  return (
    <EmptyState
      icon={<Download className="h-16 w-16" />}
      title={t("download.emptyState.noActiveDownloads.title", {
        defaultValue: "无活跃下载",
      })}
      description={t("download.emptyState.noActiveDownloads.description", {
        defaultValue: "当前没有正在进行的下载任务。浏览可用软件开始下载安装。",
      })}
      action={{
        label: t("download.emptyState.browseSoftware", {
          defaultValue: "浏览可用软件",
        }),
        onClick: onBrowse,
        loading: isLoading,
      }}
    />
  );
}

export function NoDownloadHistory({ onBrowse }: { onBrowse?: () => void }) {
  const { t } = useTranslations(); // 使用 i18n hook

  return (
    <EmptyState
      icon={<Clock className="h-16 w-16" />}
      title={t("download.emptyState.noHistory.title", {
        defaultValue: "无下载历史",
      })}
      description={t("download.emptyState.noHistory.description", {
        defaultValue: "完成下载后，您的下载历史记录将会显示在这里。",
      })}
      action={
        onBrowse
          ? {
              label: t("download.emptyState.browseSoftware", {
                defaultValue: "浏览可用软件",
              }),
              onClick: onBrowse,
            }
          : undefined
      }
    />
  );
}

export function NoSearchResults({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  const { t } = useTranslations(); // 使用 i18n hook

  return (
    <EmptyState
      icon={<Search className="h-16 w-16" />}
      title={t("download.emptyState.noResults.title", {
        defaultValue: "未找到结果",
      })}
      description={t("download.emptyState.noResults.description", {
        params: { query },
        defaultValue: `没有找到与"${query}"匹配的软件。尝试使用不同的搜索词或浏览所有可用软件。`,
      })}
      action={{
        label: t("download.emptyState.clearSearch", {
          defaultValue: "清除搜索",
        }),
        onClick: onClear,
      }}
    />
  );
}

export function LoadingDownloads() {
  const { t } = useTranslations(); // 使用 i18n hook

  return (
    <EmptyState
      icon={<Loader2 className="h-16 w-16 animate-spin" />}
      title={t("download.emptyState.loading.title", { defaultValue: "加载中" })}
      description={t("download.emptyState.loading.description", {
        defaultValue: "正在获取下载列表，请稍候...",
      })}
    />
  );
}

export function NoConnection({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslations(); // 使用 i18n hook

  return (
    <EmptyState
      icon={<WifiOff className="h-16 w-16" />}
      title={t("download.emptyState.noConnection.title", {
        defaultValue: "连接错误",
      })}
      description={t("download.emptyState.noConnection.description", {
        defaultValue: "无法连接到下载服务器。请检查您的网络连接，然后重试。",
      })}
      action={{
        label: t("download.emptyState.retry", { defaultValue: "重试连接" }),
        onClick: onRetry,
      }}
    />
  );
}
