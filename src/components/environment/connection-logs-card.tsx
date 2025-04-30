import { AlertCircle, Check, FileText, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogEntry } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInScale,
  expandContent,
  skeletonPulse,
  DURATION,
} from "./animation-constants";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shouldReduceMotion } from "@/lib/utils";

interface ConnectionLogsCardProps {
  logs: LogEntry[];
  isLoading?: boolean;
}

export function ConnectionLogsCard({
  logs,
  isLoading = false,
}: ConnectionLogsCardProps) {
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.type === filter;
  });

  const toggleExpand = (index: number) => {
    setExpandedLog(expandedLog === index ? null : index);
  };

  // 没有日志时的空状态
  if (!isLoading && logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            连接日志
          </CardTitle>
          <CardDescription>最近的连接事件和错误</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.normal }}
          >
            <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">无连接日志</h3>
            <p className="text-sm text-muted-foreground">
              尚未记录任何连接活动。连接设备后，相关日志将显示在此处。
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              连接日志
            </div>
            <div className="flex gap-1">
              <Badge
                variant={filter === "all" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setFilter("all")}
              >
                全部
              </Badge>
              <Badge
                variant={filter === "success" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setFilter("success")}
              >
                成功
              </Badge>
              <Badge
                variant={filter === "error" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setFilter("error")}
              >
                错误
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>最近的连接事件和错误</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[300px] pr-3">
            <div className="space-y-2 text-sm">
              <AnimatePresence>
                {isLoading ? (
                  // 加载状态
                  Array.from({ length: 3 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      variants={skeletonPulse}
                      initial="initial"
                      animate="animate"
                      className="h-14 rounded-lg bg-muted/50"
                    />
                  ))
                ) : filteredLogs.length > 0 ? (
                  // 日志列表
                  filteredLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      layout
                      variants={fadeInScale}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        expandedLog === index ? "bg-muted" : "bg-muted/50"
                      } hover:bg-muted cursor-pointer transition-colors`}
                      onClick={() => toggleExpand(index)}
                      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                      whileTap={{ scale: shouldReduceMotion() ? 1 : 0.99 }}
                    >
                      <div className="pt-0.5">
                        {log.type === "success" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">{log.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {log.timestamp}
                        </div>

                        <AnimatePresence>
                          {expandedLog === index && log.errorMessage && (
                            <motion.div
                              variants={expandContent}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="mt-2 text-xs bg-red-50 dark:bg-red-950/50 p-2 rounded text-red-500 font-mono"
                            >
                              {log.errorMessage}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {log.errorMessage && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-red-500 text-xs font-medium flex items-center gap-1 select-none">
                              <span>详情</span>
                              <motion.span
                                animate={{ y: [0, 2, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  repeatDelay: 1,
                                  duration: 0.5,
                                }}
                                className="inline-block"
                              >
                                ↓
                              </motion.span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>点击查看错误详情</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </motion.div>
                  ))
                ) : (
                  // 无符合筛选条件的日志
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-muted-foreground"
                  >
                    没有符合当前筛选条件的日志
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">查看完整日志</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("all")}
            className={filter !== "all" ? "visible" : "invisible"}
          >
            清除筛选
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
