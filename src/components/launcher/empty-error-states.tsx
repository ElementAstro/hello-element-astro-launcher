import { motion } from "framer-motion";
import {
  PackageSearch,
  AlertCircle,
  Database,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { emptyStateVariants, errorVariants } from "./animation-constants";
import { useTranslations } from "@/components/i18n";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon = <PackageSearch className="h-12 w-12 text-muted-foreground/70" />,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]"
    >
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline" className="mt-4">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  errorDetails?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  errorDetails,
}: ErrorStateProps) {
  const { t } = useTranslations();

  return (
    <motion.div
      variants={errorVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]"
    >
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {errorDetails && (
        <div className="mt-4 p-3 bg-muted text-sm rounded-md max-w-md overflow-auto text-left">
          <code>{errorDetails}</code>
        </div>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          {t("launcher.states.retry", { defaultValue: "重试" })}
        </Button>
      )}
    </motion.div>
  );
}

// 各种空状态的预设组件

export function NoResultsFound({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  const { t } = useTranslations();

  return (
    <EmptyState
      title={t("launcher.states.noResultsTitle", {
        defaultValue: "未找到结果",
      })}
      description={t("launcher.states.noResultsDesc", {
        defaultValue:
          "没有匹配当前搜索或过滤条件的软件。请尝试修改您的搜索条件。",
      })}
      icon={<Filter className="h-12 w-12 text-muted-foreground/70" />}
      action={{
        label: t("launcher.states.clearFilters", {
          defaultValue: "清除过滤器",
        }),
        onClick: onClearFilters,
      }}
    />
  );
}

export function NoSoftwareAvailable({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslations();

  return (
    <EmptyState
      title={t("launcher.states.noSoftwareTitle", {
        defaultValue: "没有可用软件",
      })}
      description={t("launcher.states.noSoftwareDesc", {
        defaultValue: "目前还没有任何可用的软件。请稍后再来查看或刷新列表。",
      })}
      icon={<Database className="h-12 w-12 text-muted-foreground/70" />}
      action={{
        label: t("launcher.states.refreshList", { defaultValue: "刷新列表" }),
        onClick: onRefresh,
      }}
    />
  );
}

export function LoadingState() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
      <Loader2 className="h-12 w-12 text-primary/70 animate-spin" />
      <h3 className="mt-4 text-lg font-medium">
        {t("launcher.states.loading", { defaultValue: "正在加载..." })}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("launcher.states.loadingDesc", {
          defaultValue: "请稍候，我们正在加载软件数据",
        })}
      </p>
    </div>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslations();

  return (
    <ErrorState
      title={t("launcher.states.networkErrorTitle", {
        defaultValue: "网络错误",
      })}
      description={t("launcher.states.networkErrorDesc", {
        defaultValue: "连接服务器时发生错误。请检查您的网络连接并重试。",
      })}
      onRetry={onRetry}
    />
  );
}

export function ServerErrorState({
  onRetry,
  details,
}: {
  onRetry: () => void;
  details?: string;
}) {
  const { t } = useTranslations();

  return (
    <ErrorState
      title={t("launcher.states.serverErrorTitle", {
        defaultValue: "服务器错误",
      })}
      description={t("launcher.states.serverErrorDesc", {
        defaultValue:
          "服务器处理您的请求时发生错误。我们已记录此问题，请稍后重试。",
      })}
      errorDetails={details}
      onRetry={onRetry}
    />
  );
}
