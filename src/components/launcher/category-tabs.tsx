import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, ChangeHandler } from "./types";

interface CategoryTabsProps {
  currentTab: Category;
  onTabChange: ChangeHandler<Category>;
}

export function CategoryTabs({ currentTab, onTabChange }: CategoryTabsProps) {
  const categories: Array<{ value: Category; label: string }> = [
    { value: "all", label: "All" },
    { value: "deepspace", label: "Deep Space" },
    { value: "planets", label: "Planets" },
    { value: "guiding", label: "Guiding" },
    { value: "analysis", label: "Analysis" },
    { value: "drivers", label: "Drivers" },
    { value: "vendor", label: "Vendor" },
    { value: "utilities", label: "Utilities" },
  ];

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value: string) => onTabChange(value as Category)}
      className="flex-1 overflow-hidden"
    >
      <div className="px-4 border-b overflow-x-auto">
        <TabsList className="h-14 w-full justify-start">
          {categories.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}