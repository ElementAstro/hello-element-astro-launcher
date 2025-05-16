import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTranslations } from "@/components/i18n";

interface ProxySearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
}

export function ProxySearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTab,
  onTabChange,
  onRefresh,
}: ProxySearchAndFilterProps) {
  const { t } = useTranslations();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  // 处理刷新按钮动画
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 750);
  };
  return (
    <div className="flex flex-row gap-2 items-center">      <div className="relative w-full max-w-[160px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          type="search"
          placeholder={
            isMobile
              ? t("proxy.search.placeholder").substring(0, 4) + "..."
              : t("proxy.search.placeholder")
          }
          className="pl-7 h-7 text-[10px] rounded-md"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t("proxy.search.placeholder")}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={onTabChange}
          className="flex-initial"
        >
          <TabsList className="grid grid-cols-4 h-7 p-0.5 gap-0.5">
            <TabsTrigger
              value="all"
              className="text-[10px] px-1.5 h-6"
            >
              {t("proxy.search.allStatuses")}
            </TabsTrigger>
            <TabsTrigger
              value="running"
              className="text-[10px] px-1.5 h-6 flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
              {t("proxy.status.running")}
            </TabsTrigger>
            <TabsTrigger
              value="idle"
              className="text-[10px] px-1.5 h-6 flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block"></span>
              {t("proxy.status.idle")}
            </TabsTrigger>
            <TabsTrigger
              value="error"
              className="text-[10px] px-1.5 h-6 flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block"></span>
              {t("proxy.status.error")}
            </TabsTrigger>
          </TabsList>
        </Tabs>        <Button
          size="icon"
          variant="outline"
          onClick={handleRefresh}
          className={`h-7 w-7 flex-shrink-0 transition-all rounded-md ${
            isRefreshing ? "animate-spin" : ""
          }`}
          aria-label={t("proxy.search.placeholder")}
          disabled={isRefreshing}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
