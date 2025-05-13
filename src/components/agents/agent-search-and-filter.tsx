import { RefreshCw, Search, X, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from "react";
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
  totalAgents = 0,
  activeFilters = [],
  onFilterChange,
  showCounts = { all: 0, running: 0, idle: 0, error: 0 },
}: AgentSearchAndFilterProps) {
  const { t } = useTranslations();
  const [isMounted, setIsMounted] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle animations after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const filterOptions = [
    {
      id: "scheduled",
      label: t("agent.filter.scheduled", { defaultValue: "Scheduled" }),
    },
    {
      id: "manual",
      label: t("agent.filter.manual", { defaultValue: "Manual Trigger" }),
    },
    {
      id: "observation",
      label: t("agent.filter.observation", {
        defaultValue: "Observation Type",
      }),
    },
    {
      id: "processing",
      label: t("agent.filter.processing", { defaultValue: "Processing Type" }),
    },
    {
      id: "analysis",
      label: t("agent.filter.analysis", { defaultValue: "Analysis Type" }),
    },
  ];

  const tabAnimation = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 },
    transition: { duration: 0.2 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input with animations */}
        <motion.div
          className="relative w-full md:w-96"
          initial={{ width: "100%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={t("agent.search.placeholder", {
              defaultValue: "Search agents by name, description, type...",
            })}
            className={`pl-10 pr-${searchQuery ? "9" : "4"} transition-all`}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t("agent.search.ariaLabel", {
              defaultValue: "Search agents",
            })}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleClearSearch}
                  aria-label={t("agent.search.clear", {
                    defaultValue: "Clear search",
                  })}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter and tabs */}
        <div className="flex gap-2 w-full md:w-auto items-center">
          <Tabs
            value={selectedTab}
            onValueChange={onTabChange}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">
                {t("agent.tabs.all", { defaultValue: "All" })}
                {showCounts.all > 0 && (
                  <motion.span
                    initial={isMounted ? tabAnimation.initial : undefined}
                    animate={isMounted ? tabAnimation.animate : undefined}
                    className="ml-1.5 text-xs bg-primary/10 rounded-full px-1.5 py-0.5"
                  >
                    {showCounts.all}
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger value="running">
                Running
                {showCounts.running > 0 && (
                  <motion.span
                    initial={isMounted ? tabAnimation.initial : undefined}
                    animate={isMounted ? tabAnimation.animate : undefined}
                    className="ml-1.5 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded-full px-1.5 py-0.5"
                  >
                    {showCounts.running}
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger value="idle">
                Idle
                {showCounts.idle > 0 && (
                  <motion.span
                    initial={isMounted ? tabAnimation.initial : undefined}
                    animate={isMounted ? tabAnimation.animate : undefined}
                    className="ml-1.5 text-xs bg-primary/10 rounded-full px-1.5 py-0.5"
                  >
                    {showCounts.idle}
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger value="error">
                Error
                {showCounts.error > 0 && (
                  <motion.span
                    initial={isMounted ? tabAnimation.initial : undefined}
                    animate={isMounted ? tabAnimation.animate : undefined}
                    className="ml-1.5 text-xs bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5"
                  >
                    {showCounts.error}
                  </motion.span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Additional filters dropdown */}
          {onFilterChange && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={
                          activeFilters.length > 0 ? "border-primary" : ""
                        }
                        aria-label="Additional filters"
                      >
                        <Filter
                          className={`h-4 w-4 ${
                            activeFilters.length > 0 ? "text-primary" : ""
                          }`}
                        />
                        {activeFilters.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFilters.length}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filterOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            onFilterChange(
                              option.id,
                              !activeFilters.includes(option.id)
                            )
                          }
                        >
                          {option.label}
                          {activeFilters.includes(option.id) && (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-primary"
                            >
                              <path
                                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </DropdownMenuItem>
                      ))}
                      {activeFilters.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center justify-center text-sm text-muted-foreground cursor-pointer hover:text-destructive"
                            onClick={() => {
                              activeFilters.forEach((filter) =>
                                onFilterChange(filter, false)
                              );
                            }}
                          >
                            Clear all filters
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter agents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Refresh button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh agent list"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh agent list</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Active filters display */}
      <AnimatePresence>
        {activeFilters.length > 0 && onFilterChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map((filter) => {
              const filterOption = filterOptions.find((o) => o.id === filter);
              return filterOption ? (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-primary/5"
                  >
                    {filterOption.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3.5 w-3.5 ml-1 p-0"
                      onClick={() => onFilterChange(filter, false)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                </motion.div>
              ) : null;
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {totalAgents > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-xs text-muted-foreground"
        >
          {totalAgents} agent{totalAgents === 1 ? "" : "s"} found
          {searchQuery && (
            <>
              {" "}
              for <span className="font-medium">&quot;{searchQuery}&quot;</span>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
