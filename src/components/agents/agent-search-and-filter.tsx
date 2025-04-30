import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
}

export function AgentSearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTab,
  onTabChange,
  onRefresh,
}: AgentSearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Tabs
          value={selectedTab}
          onValueChange={onTabChange}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="idle">Idle</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}