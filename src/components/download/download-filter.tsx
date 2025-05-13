import { useState } from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type DownloadFilterProps = {
  categories: FilterOption[];
  statuses?: FilterOption[];
  selectedCategory: string;
  selectedStatus?: string;
  onCategoryChange: (category: string) => void;
  onStatusChange?: (status: string) => void;
  isLoading?: boolean;
};

export function DownloadFilter({
  categories,
  statuses,
  selectedCategory,
  selectedStatus = "all",
  onCategoryChange,
  onStatusChange,
  isLoading = false,
}: DownloadFilterProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const { t } = useTranslations(); // 使用 i18n hook

  const selectedCategoryLabel =
    categories.find((category) => category.value === selectedCategory)?.label ||
    t("download.filter.allCategories", { defaultValue: "所有分类" });

  const selectedStatusLabel =
    statuses?.find((status) => status.value === selectedStatus)?.label ||
    t("download.filter.allStatuses", { defaultValue: "所有状态" });

  // 根据当前选择计算激活的过滤器数量
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedStatus !== "all" && selectedStatus !== undefined ? 1 : 0);

  // 清除所有过滤器
  const clearFilters = () => {
    onCategoryChange("all");
    if (onStatusChange) onStatusChange("all");
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm sticky top-0 z-10 py-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="justify-between min-w-[150px]"
              disabled={isLoading}
            >
              <span className="truncate">{selectedCategoryLabel}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t("download.filter.searchCategories", {
                  defaultValue: "搜索分类...",
                })}
              />
              <CommandList>
                <CommandEmpty>
                  {t("download.filter.noResults", {
                    defaultValue: "没有找到结果",
                  })}
                </CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.value}
                      onSelect={() => {
                        onCategoryChange(category.value);
                        setCategoryOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory === category.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span>{category.label}</span>
                      {category.count !== undefined && (
                        <Badge
                          variant="secondary"
                          className="ml-auto font-mono"
                        >
                          {category.count}
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {statuses && (
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="justify-between min-w-[150px]"
                disabled={isLoading}
              >
                <span className="truncate">{selectedStatusLabel}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={t("download.filter.searchStatuses", {
                    defaultValue: "搜索状态...",
                  })}
                />
                <CommandList>
                  <CommandEmpty>
                    {t("download.filter.noResults", {
                      defaultValue: "没有找到结果",
                    })}
                  </CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        onSelect={() => {
                          if (onStatusChange) onStatusChange(status.value);
                          setStatusOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStatus === status.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>{status.label}</span>
                        {status.count !== undefined && (
                          <Badge
                            variant="secondary"
                            className="ml-auto font-mono"
                          >
                            {status.count}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-1"
            >
              <span>
                {t("download.filter.clearFilters", {
                  defaultValue: "清除过滤器",
                })}
              </span>
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        {isLoading ? (
          <span className="animate-pulse">
            {t("download.filter.loading", { defaultValue: "加载中..." })}
          </span>
        ) : categories.length > 0 ? (
          <>
            <span>
              {t("download.filter.showing", {
                params: {
                  count: categories.reduce(
                    (acc, cat) => acc + (cat.count || 0),
                    0
                  ),
                },
                defaultValue: "显示 {{count}} 个项目",
              })}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
