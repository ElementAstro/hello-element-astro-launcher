import { Grid, List, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { 
  Category, 
  ViewMode, 
  SortField, 
  SortDirection, 
  ChangeHandler 
} from "./types";

interface FilterControlsProps {
  currentTab: Category;
  viewMode: ViewMode;
  filterFeatured: boolean;
  filterInstalled: boolean;
  onTabChange: ChangeHandler<Category>;
  onViewModeChange: ChangeHandler<ViewMode>;
  onFeaturedFilterChange: ChangeHandler<boolean>;
  onInstalledFilterChange: ChangeHandler<boolean>;
  onSortChange: (by: SortField, direction: SortDirection) => void;
}

export function FilterControls({
  currentTab,
  viewMode,
  filterFeatured,
  filterInstalled,
  onTabChange,
  onViewModeChange,
  onFeaturedFilterChange,
  onInstalledFilterChange,
  onSortChange,
}: FilterControlsProps) {
  return (
    <div className="mt-4 flex flex-col md:flex-row gap-4">
      <Select value={currentTab} onValueChange={onTabChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="deepspace">Deep Space</SelectItem>
          <SelectItem value="planets">Planets</SelectItem>
          <SelectItem value="guiding">Guiding</SelectItem>
          <SelectItem value="analysis">Analysis</SelectItem>
          <SelectItem value="drivers">Drivers</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
          <SelectItem value="utilities">Utilities</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="featured-only"
            checked={filterFeatured}
            onCheckedChange={onFeaturedFilterChange}
          />
          <Label htmlFor="featured-only" className="text-sm cursor-pointer">
            Featured Only
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="installed-only"
            checked={filterInstalled}
            onCheckedChange={onInstalledFilterChange}
          />
          <Label htmlFor="installed-only" className="text-sm cursor-pointer">
            Installed Only
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange(viewMode === "list" ? "grid" : "list")}
          title={viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
        >
          {viewMode === "list" ? (
            <Grid className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Sort Options">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => onSortChange("name", "asc")}
              >
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("name", "desc")}
              >
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("downloads", "desc")}
              >
                Most Downloads
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("lastUpdated", "desc")}
              >
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("lastUpdated", "asc")}
              >
                Oldest Updated
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}