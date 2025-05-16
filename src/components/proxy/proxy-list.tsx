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
  const { t } = useTranslations();  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-[105px] w-full rounded-md border border-border bg-card/50 animate-pulse"
          />
        ))}
      </div>
    );
  }  if (proxies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center h-[80px]">
        <div className="text-muted-foreground mb-1.5">
          {searchQuery ? (
            <>
              <h3 className="text-sm font-medium">
                {t("proxy.list.emptyFiltered")}
              </h3>
              <p className="text-[10px]">尝试使用不同的搜索词或过滤条件</p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-medium">{t("proxy.list.empty")}</h3>
              <p className="text-[10px]">添加您的第一个代理服务器以开始使用</p>
            </>
          )}
        </div>
        <Button onClick={onCreateProxy} size="sm" variant="outline" className="mt-1.5 h-7 text-[10px]">
          <PlusCircle className="h-3 w-3 mr-1" />
          {t("proxy.list.addNew")}
        </Button>
      </div>
    );
  }return (
    <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
