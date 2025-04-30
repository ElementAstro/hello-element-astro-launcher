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

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("设备已成功刷新");
    } catch (error) {
      toast.error("刷新设备时出错");
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
        <h1 className="text-2xl font-bold tracking-tight">Environment</h1>
        <p className="text-muted-foreground">管理您的天文设备和系统设置</p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative overflow-hidden"
          >
            {isRefreshing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                更新中...
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新设备
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
          <p>刷新所有连接的设备和系统状态</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
