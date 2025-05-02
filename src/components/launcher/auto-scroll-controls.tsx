import { Play, Pause, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEMS_PER_PAGE_OPTIONS } from "./constants";
import { ANIMATION_DURATION } from "./animation-constants";
import type { ChangeHandler } from "./types";
import { cn } from "@/lib/utils";

interface AutoScrollControlsProps {
  autoScroll: boolean;
  scrollSpeed: number;
  itemsPerPage: number;
  onAutoScrollToggle: () => void;
  onScrollSpeedChange: ChangeHandler<number>;
  onItemsPerPageChange: ChangeHandler<number>;
  isLoading?: boolean;
}

export function AutoScrollControls({
  autoScroll,
  scrollSpeed,
  itemsPerPage,
  onAutoScrollToggle,
  onScrollSpeedChange,
  onItemsPerPageChange,
  isLoading = false,
}: AutoScrollControlsProps) {
  // 速度描述文本
  const getSpeedLabel = (speed: number) => {
    if (speed <= 2) return "很快";
    if (speed <= 5) return "中等";
    if (speed <= 8) return "较慢";
    return "很慢";
  };

  const speedLabel = getSpeedLabel(scrollSpeed);

  return (
    <motion.div
      className="px-4 py-2 border-b flex flex-wrap items-center gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: ANIMATION_DURATION.fast }}
            >
              <Button
                variant={autoScroll ? "default" : "outline"}
                size="sm"
                onClick={onAutoScrollToggle}
                disabled={isLoading}
                className={cn(isLoading && "opacity-70 cursor-not-allowed")}
                aria-label={autoScroll ? "暂停自动滚动" : "开始自动滚动"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {autoScroll ? (
                    <motion.div
                      key="pause"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: ANIMATION_DURATION.fast }}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      暂停
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: ANIMATION_DURATION.fast }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      自动滚动
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            {autoScroll ? "停止自动滚动页面" : "启用自动滚动页面"}
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {autoScroll && (
            <motion.div
              className="flex items-center gap-2 ml-2"
              initial={{ opacity: 0, width: 0, overflow: "hidden" }}
              animate={{ opacity: 1, width: "auto", overflow: "visible" }}
              exit={{ opacity: 0, width: 0, overflow: "hidden" }}
              transition={{ duration: ANIMATION_DURATION.normal }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[scrollSpeed]}
                      min={1}
                      max={10}
                      step={1}
                      className="w-24"
                      onValueChange={(value) => onScrollSpeedChange(value[0])}
                      disabled={isLoading}
                      aria-label="自动滚动速度"
                      aria-valuetext={`${scrollSpeed}秒，${speedLabel}`}
                    />
                    <div className="flex flex-col text-xs min-w-[40px]">
                      <span className="text-muted-foreground whitespace-nowrap">
                        {scrollSpeed}秒
                      </span>
                      <span className="text-muted-foreground/70 text-[10px]">
                        {speedLabel}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>调整自动滚动速度（秒/页）</TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
          每页项目:
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger
                id="items-per-page"
                className={cn(
                  "w-16",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                aria-label="设置每页显示的项目数"
              >
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: ANIMATION_DURATION.fast }}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </motion.div>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>设置每页显示的软件数量</TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
