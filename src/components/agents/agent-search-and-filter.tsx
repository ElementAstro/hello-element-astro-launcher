import { RefreshCw, Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/components/i18n/client";

interface AgentSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  totalAgents?: number;
  activeFilters?: string[];
  onFilterChange?: (filter: string, value: boolean) => void;
  showCounts?: {
    all: number;
    running: number;
    idle: number;
    error: number;
  };
}

export function AgentSearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTab,
  onTabChange,
  onRefresh,
  isRefreshing = false,
  activeFilters = [],
  onFilterChange,
  showCounts = { all: 0, running: 0, idle: 0, error: 0 },
}: AgentSearchAndFilterProps) {
  const { t } = useTranslations();
  const [hasTyped, setHasTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input changes with debounce
  const handleSearchChange = (value: string) => {
    if (!hasTyped && value.length > 0) {
      setHasTyped(true);
    } else if (value.length === 0) {
      setHasTyped(false);
    }
    onSearchChange(value);
  };

  // Clear search input
  const handleClearSearch = () => {
    onSearchChange("");
    inputRef.current?.focus();
    setHasTyped(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col space-y-1.5"
    >
      {/* Search and filter row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("agent.search.placeholder", {
              defaultValue: "搜索代理...",
            })}
            className="pl-8 h-8 text-sm"
            aria-label={t("agent.search.ariaLabel", {
              defaultValue: "搜索代理",
            })}
          />
          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label={t("agent.search.clear", {
                  defaultValue: "清除搜索",
                })}
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="h-8 px-2"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  <span className="sr-only">
                    {t("agent.refresh", { defaultValue: "刷新" })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("agent.refresh", { defaultValue: "刷新" })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onFilterChange && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          activeFilters.length > 0 ? "default" : "outline"
                        }
                        size="sm"
                        className="h-8 px-2 relative"
                      >
                        <Filter className="h-3.5 w-3.5" />
                        <span className="sr-only">
                          {t("agent.filter", { defaultValue: "过滤" })}
                        </span>
                        {activeFilters.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                          >
                            {activeFilters.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("agent.filter", { defaultValue: "过滤" })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent align="end" className="w-48">
                {/* Filter menu items... */}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div>
        <Tabs
          value={selectedTab}
          onValueChange={onTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 h-7">
            <TabsTrigger
              value="all"
              className="text-xs py-1"
              data-testid="agent-filter-all"
            >
              {t("agent.status.all", { defaultValue: "全部" })}
              {showCounts.all > 0 && (
                <Badge variant="secondary" className="ml-1.5 py-0 h-4 px-1">
                  {showCounts.all}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="running"
              className="text-xs py-1"
              data-testid="agent-filter-running"
            >
              {t("agent.status.running", { defaultValue: "运行中" })}
              {showCounts.running > 0 && (
                <Badge variant="secondary" className="ml-1.5 py-0 h-4 px-1">
                  {showCounts.running}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="idle"
              className="text-xs py-1"
              data-testid="agent-filter-idle"
            >
              {t("agent.status.idle", { defaultValue: "空闲" })}
              {showCounts.idle > 0 && (
                <Badge variant="secondary" className="ml-1.5 py-0 h-4 px-1">
                  {showCounts.idle}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="error"
              className="text-xs py-1"
              data-testid="agent-filter-error"
            >
              {t("agent.status.error", { defaultValue: "错误" })}
              {showCounts.error > 0 && (
                <Badge variant="secondary" className="ml-1.5 py-0 h-4 px-1">
                  {showCounts.error}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-1 pt-1"
        >
          {/* Filter badges... */}
        </motion.div>
      )}
    </motion.div>
  );
}
