import { Loader2, RefreshCw, Server, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUp, DURATION, EASE, parallaxFadeIn, floatAnimation } from "./animation-constants";
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
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: DURATION.quick, ease: EASE.gentle }}
    >
      <div className="relative z-10">
        {/* 添加背景装饰元素 */}
        <motion.div 
          className="absolute -z-10 -left-4 -top-4 w-16 h-16 rounded-full bg-primary/5 blur-xl"
          variants={floatAnimation}
          animate="animate"
        />
        <motion.div
          variants={parallaxFadeIn}
          custom={0}
          className="flex items-center gap-2"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Server className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t(pageHeader.title)}
          </h1>
        </motion.div>
        <motion.p 
          variants={parallaxFadeIn} 
          custom={1} 
          className="text-muted-foreground mt-1"
        >
          {t(pageHeader.description)}
        </motion.p>
        
        {/* 添加状态指示器 */}
        <motion.div 
          variants={parallaxFadeIn} 
          custom={2}
          className="mt-2 flex items-center text-xs text-muted-foreground"
        >
          <div className="flex items-center mr-4">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
            <span>系统运行正常</span>
          </div>
          <div className="flex items-center">
            <Activity className="h-3 w-3 mr-1.5 text-primary/70" />
            <span>设备状态良好</span>
          </div>
        </motion.div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90"
          >
            {isRefreshing ? (
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
                className="absolute bottom-0 left-0 h-1 bg-primary-foreground/30"
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
