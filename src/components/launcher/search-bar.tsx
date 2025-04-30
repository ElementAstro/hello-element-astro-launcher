import { Search, EyeOff, Eye, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChangeHandler } from "./types";

interface SearchBarProps {
  searchQuery: string;
  searchVisible: boolean;
  onSearchChange: ChangeHandler<string>;
  onSearchVisibilityToggle: () => void;
  onRefresh: () => void;
}

export function SearchBar({
  searchQuery,
  searchVisible,
  onSearchChange,
  onSearchVisibilityToggle,
  onRefresh,
}: SearchBarProps) {
  return (
    <div className={cn("p-4 border-b", !searchVisible && "hidden")}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            id="search-input"
            placeholder="Search software..."
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => onSearchChange("")}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={onSearchVisibilityToggle}
          >
            {searchVisible ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Search
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Search
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}