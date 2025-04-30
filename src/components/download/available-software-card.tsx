import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Info, Star, Tag, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
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
import { cardVariants, DURATION, EASE } from "./animation-variants";
import { cn } from "@/lib/utils";

interface AvailableSoftwareCardProps {
  software: {
    id: number;
    name: string;
    version: string;
    description: string;
    size: string;
    icon: string;
    category: string;
    installed: boolean;
    tags?: string[];
    rating?: number;
    isNew?: boolean;
    lastUpdated?: string;
  };
  onDownload: () => void;
  onViewDetails?: () => void;
  alreadyDownloading?: boolean;
}

export function AvailableSoftwareCard({
  software,
  onDownload,
  onViewDetails,
  alreadyDownloading = false,
}: AvailableSoftwareCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // 处理下载操作
  const handleDownload = () => {
    if (software.installed) {
      setShowConfirmDialog(true);
      return;
    }
    
    startDownload();
  };
  
  // 开始下载
  const startDownload = () => {
    setIsDownloading(true);
    
    // 模拟网络请求延迟
    setTimeout(() => {
      onDownload();
      setIsDownloading(false);
    }, 800);
  };
  
  // 渲染星级评分
  const renderRating = () => {
    if (!software.rating) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.floor(software.rating || 0)
                ? "text-amber-500 fill-amber-500"
                : "text-muted-foreground"
            )}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {software.rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
    >
      <Card className={cn(
        "overflow-hidden h-full flex flex-col",
        software.installed && "border-green-200 dark:border-green-800",
        hovered && "shadow-lg"
      )}>
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <div className="relative">
            <Image
              src={software.icon || "/placeholder.svg"}
              alt={software.name}
              width={40}
              height={40}
              className="rounded"
            />
            {software.installed && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{software.name}</CardTitle>
              {software.isNew && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: DURATION.normal,
                    ease: EASE.bounce
                  }}
                >
                  <Badge className="bg-blue-500 hover:bg-blue-600">新</Badge>
                </motion.div>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <span>版本 {software.version}</span>
              {software.lastUpdated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs ml-2 text-muted-foreground/70 cursor-help">
                      ({software.lastUpdated})
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>最后更新时间</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {renderRating()}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <CardDescription className="line-clamp-2 mb-2">
            {software.description}
          </CardDescription>
          
          {software.tags && software.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: DURATION.normal }}
              className="flex flex-wrap gap-1.5 mt-2"
            >
              {software.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs py-0 h-5 px-1.5 font-normal"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center border-t">
          <div className="text-sm text-muted-foreground">{software.size}</div>
          <div className="flex items-center gap-2">
            {onViewDetails && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onViewDetails}
                    aria-label="查看软件详情"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>查看详情</TooltipContent>
              </Tooltip>
            )}
            <Button 
              onClick={handleDownload}
              disabled={isDownloading || alreadyDownloading}
              aria-label={software.installed ? "重新下载" : "开始下载"}
            >
              {isDownloading || alreadyDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  下载中
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {software.installed ? "重新下载" : "下载"}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* 重新下载确认对话框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>重新下载软件？</AlertDialogTitle>
            <AlertDialogDescription>
              {software.name} 已经安装在您的系统上。您确定要重新下载吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={startDownload}>确认下载</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}