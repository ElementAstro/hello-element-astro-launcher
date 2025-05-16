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
import { useCallback } from "react";
import { useTranslations } from "@/components/i18n";

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
  const { t } = useTranslations();
  
  // 速度描述文本
  const getSpeedLabel = useCallback((speed: number) => {
    if (speed <= 2) return t("launcher.autoScroll.veryFast", { defaultValue: "很快" });
    if (speed <= 5) return t("launcher.autoScroll.medium", { defaultValue: "中等" });
    if (speed <= 8) return t("launcher.autoScroll.slow", { defaultValue: "较慢" });
    return t("launcher.autoScroll.verySlow", { defaultValue: "很慢" });
  }, [t]);

  const speedLabel = getSpeedLabel(scrollSpeed);

  return (
    <motion.div
      className="px-1 py-0.5 border-b flex flex-wrap items-center justify-between gap-1.5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      <div className="flex items-center gap-1.5">
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
                className={cn(
                  "h-6 px-1.5 text-xs",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                aria-label={autoScroll 
                  ? t("launcher.autoScroll.pauseAutoScroll", { defaultValue: "暂停自动滚动" }) 
                  : t("launcher.autoScroll.enableAutoScroll", { defaultValue: "开始自动滚动" })
                }
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
                      <Pause className="h-3 w-3 mr-1" />
                      {t("launcher.autoScroll.pause", { defaultValue: "暂停" })}
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
                      <Play className="h-3 w-3 mr-1" />
                      {t("launcher.autoScroll.auto", { defaultValue: "自动" })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {autoScroll 
              ? t("launcher.autoScroll.pauseAutoScroll", { defaultValue: "停止自动滚动页面" })
              : t("launcher.autoScroll.enableAutoScroll", { defaultValue: "启用自动滚动页面" })
            }
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {autoScroll && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, width: 0, overflow: "hidden" }}
              animate={{ opacity: 1, width: "auto", overflow: "visible" }}
              exit={{ opacity: 0, width: 0, overflow: "hidden" }}
              transition={{ duration: ANIMATION_DURATION.normal }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground hidden xs:block" />
                    <Slider
                      value={[scrollSpeed]}
                      min={1}
                      max={10}
                      step={1}
                      className="w-14 xs:w-16"
                      onValueChange={(value) => onScrollSpeedChange(value[0])}
                      disabled={isLoading}
                      aria-label={t("launcher.autoScroll.adjustSpeed", { defaultValue: "自动滚动速度" })}
                      aria-valuetext={`${scrollSpeed}${t("launcher.autoScroll.seconds", { defaultValue: "秒" })}，${speedLabel}`}
                    />
                    <div className="flex flex-row xs:flex-col text-[9px] xs:text-[10px] min-w-[30px]">
                      <span className="text-muted-foreground whitespace-nowrap">
                        {scrollSpeed}{t("launcher.autoScroll.seconds", { defaultValue: "秒" })}
                      </span>
                      <span className="text-muted-foreground/70 text-[9px] hidden xs:block">
                        {speedLabel}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {t("launcher.autoScroll.adjustSpeed", { defaultValue: "调整自动滚动速度（秒/页）" })}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1">
        <Label htmlFor="items-per-page" className="text-[10px] whitespace-nowrap">
          {t("launcher.autoScroll.itemsPerPage", { defaultValue: "每页:" })}
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
                  "w-10 h-6 text-xs pl-1.5 pr-1",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                aria-label={t("launcher.autoScroll.setItemsCount", { defaultValue: "设置每页显示的项目数" })}
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
                    <SelectItem
                      key={option}
                      value={option.toString()}
                      className="text-xs"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </motion.div>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {t("launcher.autoScroll.setItemsPerPage", { defaultValue: "设置每页显示的软件数量" })}
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
