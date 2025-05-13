import {
  CheckCircle,
  Download,
  PauseCircle,
  AlertCircle,
  Clock,
  RotateCw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { iconVariants } from "./animation-variants";
import { DownloadStatus } from "./types";

// 定义翻译函数类型
type TFunction = (
  key: string,
  options?: { params?: Record<string, string | number>; defaultValue?: string }
) => string;

export const getStatusIcon = (status: DownloadStatus, className?: string) => {
  const commonClasses = className || "h-5 w-5";

  const IconMap = {
    completed: (
      <motion.div initial="initial" animate="success" variants={iconVariants}>
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
      <motion.div initial="initial" animate="animate" variants={iconVariants}>
        <PauseCircle className={cn(commonClasses, "text-amber-500")} />
      </motion.div>
    ),
    error: (
      <motion.div initial="initial" animate="error" variants={iconVariants}>
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
        <Clock className={cn(commonClasses, "text-slate-500")} />{" "}
        {/* Gray clock icon to indicate a neutral waiting state */}
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
      <motion.div initial="initial" animate="animate" variants={iconVariants}>
        <XCircle className={cn(commonClasses, "text-gray-500")} />
      </motion.div>
    ),
  };

  return (
    IconMap[status] || (
      <motion.div initial="initial" animate="animate" variants={iconVariants}>
        <Download className={cn(commonClasses, "text-muted-foreground")} />
      </motion.div>
    )
  );
};

export const getStatusText = (
  status: DownloadStatus,
  t?: TFunction
): string => {
  // 如果提供了t函数，使用i18n
  if (t) {
    const key = `download.status.${status}`;
    const statusTexts = {
      completed: t(key, { defaultValue: "已完成" }),
      downloading: t(key, { defaultValue: "下载中" }),
      paused: t(key, { defaultValue: "已暂停" }),
      error: t(key, { defaultValue: "失败" }),
      waiting: t(key, { defaultValue: "等待中" }),
      processing: t(key, { defaultValue: "处理中" }),
      verification: t(key, { defaultValue: "验证中" }),
      cancelled: t(key, { defaultValue: "已取消" }),
    };
    return statusTexts[status] || status;
  }

  // 没有t函数时的默认文本
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
    completed:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    downloading:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    paused:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    waiting:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    processing:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    verification:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    cancelled:
      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  };

  return (
    StatusClassMap[status] ||
    "bg-muted text-muted-foreground border-muted-foreground/20"
  );
};

export const formatTimeRemaining = (seconds: number, t?: TFunction): string => {
  if (t) {
    if (seconds < 60) {
      return t("download.timeRemaining.seconds", {
        params: { seconds: Math.ceil(seconds) },
        defaultValue: `${Math.ceil(seconds)}秒`,
      });
    }

    if (seconds < 3600) {
      return t("download.timeRemaining.minutes", {
        params: { minutes: Math.ceil(seconds / 60) },
        defaultValue: `${Math.ceil(seconds / 60)}分钟`,
      });
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds % 3600) / 60);

    if (minutes > 0) {
      return t("download.timeRemaining.hoursAndMinutes", {
        params: { hours, minutes },
        defaultValue: `${hours}小时 ${minutes}分钟`,
      });
    } else {
      return t("download.timeRemaining.hours", {
        params: { hours },
        defaultValue: `${hours}小时`,
      });
    }
  }

  // 默认的时间格式化逻辑
  if (seconds < 60) {
    return `${Math.ceil(seconds)}秒`;
  }

  if (seconds < 3600) {
    return `${Math.ceil(seconds / 60)}分钟`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ""}`;
};

export const formatSpeed = (bytesPerSecond: number, t?: TFunction): string => {
  if (t) {
    if (bytesPerSecond < 1024) {
      return t("download.speed.bytesPerSecond", {
        params: { speed: bytesPerSecond.toFixed(0) },
        defaultValue: `${bytesPerSecond.toFixed(0)} B/s`,
      });
    }

    if (bytesPerSecond < 1024 * 1024) {
      return t("download.speed.kilobytesPerSecond", {
        params: { speed: (bytesPerSecond / 1024).toFixed(1) },
        defaultValue: `${(bytesPerSecond / 1024).toFixed(1)} KB/s`,
      });
    }

    return t("download.speed.megabytesPerSecond", {
      params: { speed: (bytesPerSecond / (1024 * 1024)).toFixed(1) },
      defaultValue: `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`,
    });
  }

  // 默认情况
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond.toFixed(0)} B/s`;
  }

  if (bytesPerSecond < 1024 * 1024) {
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  }

  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
};

export const getDownloadErrorMessage = (
  errorCode: string,
  t?: TFunction
): string => {
  if (t) {
    const key = `download.errors.${
      errorCode?.replace(/[^a-zA-Z0-9-]/g, "") || "generic"
    }`;

    // 预定义错误消息
    const errorKeys = {
      "network-failure": key,
      "disk-space": key,
      "permission-denied": key,
      "file-corrupted": key,
      timeout: key,
      "server-error": key,
      "invalid-source": key,
      "hash-mismatch": key,
      generic: "download.errors.generic",
    };

    // 获取对应的错误消息键，如果不存在则用通用错误
    const messageKey =
      errorKeys[errorCode as keyof typeof errorKeys] || errorKeys.generic;

    // 对应的默认错误消息
    const defaultMessages = {
      "network-failure": "网络连接失败，请检查您的互联网连接",
      "disk-space": "磁盘空间不足，请清理存储空间",
      "permission-denied": "没有写入权限，请检查文件夹访问权限",
      "file-corrupted": "文件损坏，下载失败",
      timeout: "下载超时，服务器响应时间过长",
      "server-error": "服务器错误，请稍后重试",
      "invalid-source": "无效的下载源",
      "hash-mismatch": "文件哈希值不匹配，可能已被篡改",
      generic: "下载过程中出现错误",
    };

    const defaultValue =
      defaultMessages[errorCode as keyof typeof defaultMessages] ||
      defaultMessages.generic;

    return t(messageKey, { defaultValue });
  }

  // 默认错误消息逻辑
  const errorMessages = {
    "network-failure": "网络连接失败，请检查您的互联网连接",
    "disk-space": "磁盘空间不足，请清理存储空间",
    "permission-denied": "没有写入权限，请检查文件夹访问权限",
    "file-corrupted": "文件损坏，下载失败",
    timeout: "下载超时，服务器响应时间过长",
    "server-error": "服务器错误，请稍后重试",
    "invalid-source": "无效的下载源",
    "hash-mismatch": "文件哈希值不匹配，可能已被篡改",
  };

  return (
    errorMessages[errorCode as keyof typeof errorMessages] ||
    "下载过程中出现错误"
  );
};
