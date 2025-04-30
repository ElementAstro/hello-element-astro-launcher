import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEMS_PER_PAGE_OPTIONS } from "./constants";
import type { ChangeHandler } from "./types";

interface AutoScrollControlsProps {
  autoScroll: boolean;
  scrollSpeed: number;
  itemsPerPage: number;
  onAutoScrollToggle: () => void;
  onScrollSpeedChange: ChangeHandler<number>;
  onItemsPerPageChange: ChangeHandler<number>;
}

export function AutoScrollControls({
  autoScroll,
  scrollSpeed,
  itemsPerPage,
  onAutoScrollToggle,
  onScrollSpeedChange,
  onItemsPerPageChange,
}: AutoScrollControlsProps) {
  return (
    <div className="px-4 py-2 border-b flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={autoScroll ? "default" : "outline"}
          size="sm"
          onClick={onAutoScrollToggle}
        >
          {autoScroll ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Auto-Scroll
            </>
          )}
        </Button>

        {autoScroll && (
          <div className="flex items-center gap-2 ml-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[scrollSpeed]}
              min={1}
              max={10}
              step={1}
              className="w-24"
              onValueChange={(value) => onScrollSpeedChange(value[0])}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {scrollSpeed}s
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Label
          htmlFor="items-per-page"
          className="text-sm whitespace-nowrap"
        >
          Items per page:
        </Label>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger id="items-per-page" className="w-16">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}