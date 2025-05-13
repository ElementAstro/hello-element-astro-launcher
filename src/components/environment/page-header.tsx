import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn, DURATION, EASE } from "./animation-constants";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslations();
  const { pageHeader } = translationKeys;

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success(t(pageHeader.refreshSuccess));
    } catch (error) {
      toast.error(t(pageHeader.refreshError));
      console.error("Error refreshing devices:", error);
    } finally {
      // 添加短暂延迟以确保动画流畅
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: DURATION.quick, ease: EASE.gentle }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t(pageHeader.title)}</h1>
        <p className="text-muted-foreground">{t(pageHeader.description)}</p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative overflow-hidden"
          >            {isRefreshing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t(pageHeader.refresh)}...
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t(pageHeader.refresh)}
              </motion.div>
            )}
            {isRefreshing && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-primary/30"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(pageHeader.refreshTooltip)}</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
