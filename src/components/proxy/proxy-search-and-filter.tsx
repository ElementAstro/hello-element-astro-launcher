import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  // 处理刷新按钮动画
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 750);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-grow sm:flex-grow-0 sm:max-w-[260px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={isMobile ? "搜索..." : "搜索代理..."}
          className="pl-8 h-9 sm:h-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="搜索代理"
        />
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:ml-auto">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={onTabChange}
          className="flex-1 sm:flex-initial"
        >
          <TabsList className="grid grid-cols-4 h-9 sm:h-10 min-w-[280px]">
            <TabsTrigger
              value="all"
              className="text-xs sm:text-sm px-1 sm:px-3"
            >
              全部
            </TabsTrigger>
            <TabsTrigger
              value="running"
              className="text-xs sm:text-sm px-1 sm:px-3"
            >
              运行中
            </TabsTrigger>
            <TabsTrigger
              value="idle"
              className="text-xs sm:text-sm px-1 sm:px-3"
            >
              空闲
            </TabsTrigger>
            <TabsTrigger
              value="error"
              className="text-xs sm:text-sm px-1 sm:px-3"
            >
              错误
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          size="icon"
          variant="outline"
          onClick={handleRefresh}
          className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 transition-all ${
            isRefreshing ? "animate-spin" : ""
          }`}
          aria-label="刷新代理列表"
          disabled={isRefreshing}
        >
          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
