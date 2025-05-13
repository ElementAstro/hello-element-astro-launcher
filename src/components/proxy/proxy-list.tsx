import { PlusCircle } from "lucide-react";
import { ProxyCard } from "./proxy-card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n";
import type { Proxy } from "@/types/proxy";

interface ProxyListProps {
  proxies: Proxy[];
  isLoading: boolean;
  searchQuery: string;
  onStartProxy: (id: string) => void;
  onStopProxy: (id: string) => void;
  onEditProxy: (id: string) => void;
  onDeleteProxy: (id: string) => void;
  onViewLogs: (proxy: Proxy) => void;
  onCreateProxy: () => void;
}

export function ProxyList({
  proxies,
  isLoading,
  searchQuery,
  onStartProxy,
  onStopProxy,
  onEditProxy,
  onDeleteProxy,
  onViewLogs,
  onCreateProxy,
}: ProxyListProps) {
  const { t } = useTranslations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] w-full rounded-lg border border-border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (proxies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-4">
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium">
                {t("proxy.list.emptyFiltered")}
              </h3>
              <p>尝试使用不同的搜索词或过滤条件</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium">{t("proxy.list.empty")}</h3>
              <p>添加您的第一个代理服务器以开始使用</p>
            </>
          )}
        </div>
        <Button onClick={onCreateProxy} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("proxy.list.addNew")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {proxies.map((proxy) => (
        <ProxyCard
          key={proxy.id}
          proxy={proxy}
          onStartProxy={onStartProxy}
          onStopProxy={onStopProxy}
          onEditProxy={onEditProxy}
          onDeleteProxy={onDeleteProxy}
          onViewLogs={onViewLogs}
        />
      ))}
    </div>
  );
}
