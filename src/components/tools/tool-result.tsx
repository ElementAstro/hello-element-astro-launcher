import {
  RefreshCw,
  Play,
  AlertCircle,
  Download,
  Check,
  Copy,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import type {
  Tool,
  ToolOutput,
  ToolResult as ToolResultType,
} from "@/types/tool";
import { VARIANTS, DURATION, EASE } from "./animation-constants";

interface ToolResultProps {
  tool: Tool | null;
  result: ToolResultType | null;
  isRunning: boolean;
  progress?: number;
  error?: string;
  onRetry?: () => void;
  onClear?: () => void;
}

export function ToolResult({
  tool,
  result,
  isRunning,
  progress = 0,
  error,
  onRetry,
  onClear,
}: ToolResultProps) {
  const [copiedOutputId, setCopiedOutputId] = useState<string | null>(null);

  // 使用 useCallback 优化复制函数
  const handleCopyOutput = useCallback(
    (outputId: string, content: string | unknown) => {
      const textToCopy =
        typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2);

      navigator.clipboard.writeText(textToCopy);
      setCopiedOutputId(outputId);

      setTimeout(() => setCopiedOutputId(null), 2000);
    },
    []
  );

  // 渲染空状态组件 - 无结果时显示
  const renderEmptyState = () => (
    <motion.div
      className="border rounded-md p-4 md:p-8 flex items-center justify-center h-[200px] md:h-[280px]"
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeIn}
    >
      <div className="text-center text-muted-foreground">
        {isRunning ? (
          <motion.div
            className="space-y-3 md:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-8 w-8 mx-auto text-primary" />
            </motion.div>
            <p className="text-base md:text-lg font-medium">正在处理...</p>
            {progress > 0 && (
              <div className="w-full max-w-xs mx-auto space-y-1">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">
                  {Math.round(progress)}%
                </p>
              </div>
            )}
          </motion.div>
        ) : error ? (
          <motion.div
            className="space-y-3 md:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 md:p-4 mx-auto w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-base md:text-lg font-medium text-red-600 dark:text-red-400">
                执行错误
              </p>
              <p className="mt-1 text-xs md:text-sm">{error}</p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="mt-3 md:mt-4"
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  重试
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Play className="h-7 w-7 md:h-8 md:w-8 mx-auto text-muted-foreground" />
            <p className="text-sm md:text-base">运行工具以查看结果</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // 如果没有结果或有错误，显示空状态
  if (!result && !error) {
    return renderEmptyState();
  }

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="result"
          className="border rounded-md overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={VARIANTS.fadeInUp}
          transition={{ duration: DURATION.normal }}
        >
          <div className="p-3 md:p-4 space-y-3 md:space-y-4">
            {/* 结果状态栏 */}
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className={`
                  ${
                    result.status === "completed"
                      ? "text-green-600 dark:text-green-500 border-green-500"
                      : "text-amber-600 dark:text-amber-500 border-amber-500"
                  }
                  font-medium
                `}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: EASE.bounce }}
                  className="flex items-center"
                >
                  {result.status === "completed" ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {result.status === "completed" ? "已完成" : "失败"}
                </motion.div>
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                  耗时: {(result.duration / 1000).toFixed(2)}秒
                </span>
                {onClear && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-muted"
                          onClick={onClear}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>清除结果</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <Separator className="my-1" />

            {/* 错误信息显示 */}
            {result.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.normal, ease: EASE.smooth }}
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-2 md:p-3"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-400 text-sm">
                      处理过程中出现错误
                    </p>
                    <p className="text-xs md:text-sm text-red-700 dark:text-red-300 mt-1">
                      {result.error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 结果输出列表 */}
            <div className="space-y-4">
              {tool?.outputs.map((output, index) => {
                const value = result.outputs[output.name];

                if (!value) return null;

                return (
                  <motion.div
                    key={output.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: DURATION.normal,
                      ease: EASE.smooth,
                    }}
                  >
                    <OutputDisplay
                      output={output}
                      value={value}
                      onCopy={(content) => handleCopyOutput(output.id, content)}
                      isCopied={copiedOutputId === output.id}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={VARIANTS.fadeIn}
        >
          {renderEmptyState()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface OutputDisplayProps {
  output: ToolOutput;
  value: unknown;
  onCopy: (content: string | unknown) => void;
  isCopied: boolean;
}

function OutputDisplay({
  output,
  value,
  onCopy,
  isCopied,
}: OutputDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 使用 useMemo 优化判断逻辑
  const isExpandable = useMemo(() => {
    return (
      output.type === "table" ||
      (typeof value === "object" && value !== null) ||
      (typeof value === "string" && value.length > 100)
    );
  }, [output.type, value]);

  // 使用 useMemo 优化 URL 判断逻辑
  const isUrl = useMemo(() => {
    if (typeof value !== "string") return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      {/* 输出标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <Label className="text-xs md:text-sm font-medium truncate max-w-[70%]">
          {output.description}
        </Label>
        <div className="flex items-center gap-1">
          {/* 复制按钮 */}
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-muted"
                  onClick={() => onCopy(value)}
                  aria-label="复制内容"
                >
                  {isCopied ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, ease: EASE.bounce }}
                    >
                      <Check className="h-3 w-3 text-green-500" />
                    </motion.div>
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isCopied ? "已复制！" : "复制内容"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 下载按钮（对于图片和文件） */}
          {(output.type === "image" ||
            output.type === "file" ||
            output.type === "chart") && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted"
                    aria-label="下载内容"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>下载</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* URL 链接按钮 */}
          {isUrl && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted"
                    onClick={() => window.open(value as string, "_blank")}
                    aria-label="打开链接"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>在新标签页打开</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* 输出内容显示 */}
      {isExpandable ? (
        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-between p-2 md:p-3 text-xs md:text-sm hover:bg-muted/50"
            >
              <span className="font-medium truncate">
                {isExpanded ? "隐藏详细内容" : "查看详细内容"}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-2 md:p-3 pt-0">
              <RenderOutputContent output={output} value={value} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <RenderOutputContent output={output} value={value} />
        </div>
      )}
    </div>
  );
}

interface RenderOutputContentProps {
  output: ToolOutput;
  value: unknown;
}

// 提取为单独组件以提高可维护性
function RenderOutputContent({ output, value }: RenderOutputContentProps) {
  switch (output.type) {
    case "image":
      return (
        <div className="p-2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.normal, ease: EASE.smooth }}
          >
            <Image
              src={typeof value === "string" ? value : "/placeholder.svg"}
              alt={output.name}
              width={300}
              height={200}
              className="object-contain rounded-md max-h-[300px] w-auto"
            />
          </motion.div>
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <Table>
            {output.description && (
              <TableCaption className="text-xs">
                {output.description}
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                {Array.isArray(value) &&
                  value.length > 0 &&
                  Object.keys(value[0] || {}).map((key) => (
                    <TableHead
                      key={key}
                      className="text-xs md:text-sm whitespace-nowrap"
                    >
                      {key}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(value) &&
                value.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((cell, j) => (
                      <TableCell key={j} className="text-xs md:text-sm">
                        {cell?.toString()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      );

    case "chart":
      return (
        <div className="p-2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.normal, ease: EASE.smooth }}
          >
            <Image
              src={typeof value === "string" ? value : "/placeholder.svg"}
              alt={output.name}
              width={400}
              height={200}
              className="object-contain rounded-md max-w-full h-auto"
            />
          </motion.div>
        </div>
      );

    case "text":
      const textValue =
        typeof value === "string" ? value : JSON.stringify(value, null, 2);

      // 检查是否为 URL
      const isUrl =
        typeof value === "string" &&
        (() => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        })();

      return (
        <motion.div
          className={`p-2 md:p-3 bg-muted/50 text-xs md:text-sm break-words ${
            isUrl
              ? "text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
              : "whitespace-pre-wrap"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.normal }}
          onClick={
            isUrl ? () => window.open(value as string, "_blank") : undefined
          }
          role={isUrl ? "link" : undefined}
          style={isUrl ? { cursor: "pointer" } : undefined}
        >
          {textValue}
        </motion.div>
      );

    case "number":
      return (
        <motion.div
          className="p-2 md:p-3 bg-muted/50 text-xs md:text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.normal }}
        >
          {typeof value === "number" ? value : parseFloat(String(value))}
        </motion.div>
      );

    default:
      // 处理对象类型的数据
      if (typeof value === "object" && value !== null) {
        return (
          <motion.pre
            className="p-2 md:p-3 bg-muted/50 text-xs md:text-sm overflow-x-auto whitespace-pre-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.normal }}
          >
            {JSON.stringify(value, null, 2)}
          </motion.pre>
        );
      }

      return (
        <motion.div
          className="p-2 md:p-3 bg-muted/50 text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.normal }}
        >
          {String(value || "")}
        </motion.div>
      );
  }
}
