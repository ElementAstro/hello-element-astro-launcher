import { 
  CheckCircle, 
  Download, 
  PauseCircle, 
  AlertCircle,
  Clock,
  RotateCw,
  ShieldAlert,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { iconVariants } from "./animation-variants";
import { DownloadStatus } from "./types";

export const getStatusIcon = (status: DownloadStatus) => {
  const commonClasses = "h-5 w-5";
  
  const IconMap = {
    completed: (
      <motion.div
        initial="initial"
        animate="success"
        variants={iconVariants}
      >
        <CheckCircle className={cn(commonClasses, "text-green-500")} />
      </motion.div>
    ),
    downloading: (
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <Download className={cn(commonClasses, "text-blue-500")} />
      </motion.div>
    ),
    paused: (
      <motion.div
        initial="initial"
        animate="animate"
        variants={iconVariants}
      >
        <PauseCircle className={cn(commonClasses, "text-amber-500")} />
      </motion.div>
    ),
    error: (
      <motion.div
        initial="initial"
        animate="error"
        variants={iconVariants}
      >
        <AlertCircle className={cn(commonClasses, "text-red-500")} />
      </motion.div>
    ),
    // The 'waiting' status icon represents a pending state.
    // It uses a subtle scaling animation to convey that the process is in a holding pattern.
    waiting: (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }} // Smooth scaling animation for a pulsating effect
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} // Repeats indefinitely with ease-in-out timing
      >
        <Clock className={cn(commonClasses, "text-slate-500")} /> {/* Gray clock icon to indicate a neutral waiting state */}
      </motion.div>
    ),
    processing: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <RotateCw className={cn(commonClasses, "text-purple-500")} />
      </motion.div>
    ),
    verification: (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ShieldAlert className={cn(commonClasses, "text-blue-500")} />
      </motion.div>
    ),
    cancelled: (
      <motion.div
        initial="initial"
        animate="animate"
        variants={iconVariants}
      >
        <XCircle className={cn(commonClasses, "text-gray-500")} />
      </motion.div>
    ),
  };

  return IconMap[status] || (
    <motion.div
      initial="initial"
      animate="animate"
      variants={iconVariants}
    >
      <Download className={cn(commonClasses, "text-muted-foreground")} />
    </motion.div>
  );
};

export const getStatusText = (status: DownloadStatus): string => {
  const StatusTextMap = {
    completed: "已完成",
    downloading: "下载中",
    paused: "已暂停",
    error: "失败",
    waiting: "等待中",
    processing: "处理中",
    verification: "验证中",
    cancelled: "已取消",
  };

  return StatusTextMap[status] || status;
};

export const getStatusClass = (status: DownloadStatus): string => {
  const StatusClassMap = {
    completed: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    downloading: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    paused: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    waiting: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    processing: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    verification: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    cancelled: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  };

  return StatusClassMap[status] || "bg-muted text-muted-foreground border-muted-foreground/20";
};

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.ceil(seconds)}秒`;
  }
  
  if (seconds < 3600) {
    return `${Math.ceil(seconds / 60)}分钟`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`;
};

export const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond.toFixed(0)} B/s`;
  }
  
  if (bytesPerSecond < 1024 * 1024) {
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  }
  
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
};

export const getDownloadErrorMessage = (errorCode: string): string => {
  const errorMessages = {
    'network-failure': '网络连接失败，请检查您的互联网连接',
    'disk-space': '磁盘空间不足，请清理存储空间',
    'permission-denied': '没有写入权限，请检查文件夹访问权限',
    'file-corrupted': '文件损坏，下载失败',
    'timeout': '下载超时，服务器响应时间过长',
    'server-error': '服务器错误，请稍后重试',
    'invalid-source': '无效的下载源',
    'hash-mismatch': '文件哈希值不匹配，可能已被篡改'
  };
  
  return errorMessages[errorCode as keyof typeof errorMessages] || '下载过程中出现错误';
};