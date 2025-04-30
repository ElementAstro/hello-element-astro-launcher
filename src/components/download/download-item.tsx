import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Info,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DownloadItem as DownloadItemType } from "@/types";
import {
  progressVariants,
  iconVariants,
  slideOutVariants,
  DURATION
} from "./animation-variants";
import {
  getStatusIcon,
  getStatusText,
  getStatusClass,
  formatTimeRemaining,
  formatSpeed,
} from "./download-status-utils";
import { cn } from "@/lib/utils";

interface DownloadItemProps {
  download: DownloadItemType;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
  onShowDetails?: () => void;
}

export function DownloadItem({
  download,
  onCancel,
  onPause,
  onResume,
  onRetry,
  onRemove,
  onShowDetails,
}: DownloadItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // 处理错误信息显示
  const errorMessage = "下载过程中出现错误";
  
  // 处理下载速度格式化
  const formattedSpeed = download.speed 
    ? (typeof download.speed === 'number' 
        ? formatSpeed(download.speed)
        : download.speed)
    : "";
    
  // 处理剩余时间格式化
  const formattedTimeRemaining = download.estimatedTimeRemaining
    ? (typeof download.estimatedTimeRemaining === 'number'
        ? formatTimeRemaining(download.estimatedTimeRemaining)
        : download.estimatedTimeRemaining)
    : "";
  
  // 处理移除操作
  const handleRemove = () => {
    if (onRemove) {
      setIsExiting(true);
      // 给动画足够的时间执行
      setTimeout(() => {
        onRemove();
      }, DURATION.normal * 1000);
    }
  };
  
  // 获取进度条动画类型
  const getProgressVariant = () => {
    if (download.status === 'paused') return 'paused';
    if (download.status === 'error') return 'error';
    if (download.status === 'waiting' || download.status === 'verification' || download.status === 'processing') {
      return 'indeterminate';
    }
    return 'animate';
  };
  
  // 是否为活跃下载状态
  const isActiveDownload = ['downloading', 'paused', 'waiting', 'verification', 'processing'].includes(download.status);
  
  // 是否为可取消状态
  const isCancellable = ['downloading', 'paused', 'waiting'].includes(download.status);
  
  // 根据下载状态获取合适的操作按钮
  const getActionButton = () => {
    if (download.status === 'error') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-1"
              aria-label="重试下载"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>重试</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>重试下载</TooltipContent>
        </Tooltip>
      );
    }
    
    if (download.status === 'paused' && onResume) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onResume}
              className="flex items-center gap-1"
              aria-label="恢复下载"
            >
              <Play className="h-3.5 w-3.5" />
              <span>恢复</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>恢复下载</TooltipContent>
        </Tooltip>
      );
    }
    
    if (download.status === 'downloading' && onPause) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="flex items-center gap-1"
              aria-label="暂停下载"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>暂停</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>暂停下载</TooltipContent>
        </Tooltip>
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence mode="wait">
      {!isExiting ? (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          variants={slideOutVariants}
          className="relative"
          layout
        >
          <Card className={cn(
            "overflow-hidden",
            download.status === 'error' && "border-red-200 dark:border-red-800"
          )}>
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="mr-4 relative">
                  <Image
                    src={download.icon || "/placeholder.svg"}
                    alt={download.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  {download.status === 'completed' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{download.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        版本 {download.version} • {download.size}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                      >
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "flex items-center gap-1",
                            getStatusClass(download.status)
                          )}
                        >
                          {getStatusIcon(download.status)}
                          {getStatusText(download.status)}
                        </Badge>
                      </motion.div>
                      
                      {isCancellable && onCancel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={onCancel}
                              aria-label="取消下载"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>取消下载</TooltipContent>
                        </Tooltip>
                      )}
                      
                      {!isCancellable && onRemove && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setShowRemoveDialog(true)}
                              aria-label="从列表中移除"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>从列表中移除</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {isActiveDownload && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>
                          {download.progress !== undefined ? `${download.progress.toFixed(0)}%` : '等待中'}
                        </span>
                        {download.status === "downloading" && formattedTimeRemaining && (
                          <span>
                            剩余 {formattedTimeRemaining}
                          </span>
                        )}
                      </div>
                      <div ref={progressBarRef} className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          custom={download.progress || 0}
                          variants={progressVariants}
                          initial="start"
                          animate={getProgressVariant()}
                          className="absolute h-full rounded-full bg-primary"
                          style={{ width: `${download.progress || 0}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {formattedSpeed && (
                          <span className="text-xs text-muted-foreground">
                            {formattedSpeed}
                          </span>
                        )}
                        
                        <div className="flex gap-2">
                          {getActionButton()}
                          
                          {onShowDetails && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={onShowDetails}
                                  className="h-8 w-8 p-0"
                                  aria-label="查看详情"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>查看详情</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 错误状态显示 */}
                  {download.status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: DURATION.normal }}
                      className="mt-2 bg-red-50 dark:bg-red-900/20 rounded-md p-2 text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                  
                  {/* 完成状态额外信息 */}
                  {download.status === 'completed' && onShowDetails && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex justify-end"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowDetails}
                        className="text-xs flex items-center gap-1 h-7"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>查看详情</span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 移除确认对话框 */}
          <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>移除下载记录</AlertDialogTitle>
                <AlertDialogDescription>
                  您确定要从下载列表中移除 &quot;{download.name}&quot; 吗？此操作不会删除已下载的文件。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemove}>移除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}