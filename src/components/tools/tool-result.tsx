import {
  RefreshCw,
  Play,
  AlertCircle,
  Download,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
} from "@/components/ui/table";
import type {
  Tool,
  ToolOutput,
  ToolResult as ToolResultType,
} from "@/types/tool";
import { VARIANTS, DURATION } from "./animation-constants";

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

  const handleCopyOutput = (outputId: string, content: string) => {
    navigator.clipboard.writeText(
      typeof content === "string" ? content : JSON.stringify(content, null, 2)
    );
    setCopiedOutputId(outputId);
    setTimeout(() => setCopiedOutputId(null), 2000);
  };

  const renderEmptyState = () => (
    <motion.div
      className="border rounded-md p-8 flex items-center justify-center h-[300px]"
      initial="hidden"
      animate="visible"
      variants={VARIANTS.fadeIn}
    >
      <div className="text-center text-muted-foreground">
        {isRunning ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-10 w-10 mx-auto text-primary" />
            </motion.div>
            <p className="text-lg font-medium">正在处理...</p>
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
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 mx-auto w-16 h-16 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-red-600 dark:text-red-400">
                执行错误
              </p>
              <p className="mt-1 text-sm">{error}</p>
              {onRetry && (
                <Button onClick={onRetry} className="mt-4" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
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
          >
            <Play className="h-8 w-8 mx-auto" />
            <p>运行工具以查看结果</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (!result && !error) {
    return renderEmptyState();
  }

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="result"
          className="border rounded-md p-4 space-y-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={VARIANTS.fadeInUp}
          transition={{ duration: DURATION.normal }}
        >
          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className={
                result.status === "completed"
                  ? "text-green-500 border-green-500"
                  : "text-amber-500 border-amber-500"
              }
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
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
              <span className="text-xs text-muted-foreground">
                耗时: {(result.duration / 1000).toFixed(2)}秒
              </span>
              {onClear && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onClear}
                      >
                        <RefreshCw className="h-3 w-3" />
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

          <Separator />

          <div className="space-y-6">
            {result.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-400">
                      处理过程中出现错误
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {result.error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {tool?.outputs.map((output, index) => {
              const value = result.outputs[output.name];

              if (!value) return null;

              return (
                <motion.div
                  key={output.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <OutputDisplay
                    output={output}
                    value={value}
                    onCopy={(content) =>
                      handleCopyOutput(output.id, content as string)
                    }
                    isCopied={copiedOutputId === output.id}
                  />
                </motion.div>
              );
            })}
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

  // 判断是否为可扩展内容
  const isExpandable =
    output.type === "table" ||
    (typeof value === "object" && value !== null) ||
    (typeof value === "string" && value.length > 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{output.description}</Label>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onCopy(value)}
                >
                  {isCopied ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    </motion.div>
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCopied ? "已复制！" : "复制内容"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {output.type === "image" ||
          output.type === "file" ||
          output.type === "chart" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>下载</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </div>

      {isExpandable ? (
        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="border rounded-md"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-between p-3"
            >
              <span className="text-sm font-medium">
                {isExpanded ? "隐藏详细内容" : "查看详细内容"}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 pt-0">{renderOutputContent(output, value)}</div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="border rounded-md">
          {renderOutputContent(output, value)}
        </div>
      )}
    </div>
  );
}

function renderOutputContent(output: ToolOutput, value: unknown) {
  switch (output.type) {
    case "image":
      return (
        <div className="p-2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={typeof value === "string" ? value : "/placeholder.svg"}
              alt={output.name}
              width={300}
              height={200}
              className="object-contain rounded-md"
            />
          </motion.div>
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.isArray(value) &&
                  value.length > 0 &&
                  Object.keys(value[0] || {}).map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(value) &&
                value.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((cell, j) => (
                      <TableCell key={j}>{cell?.toString()}</TableCell>
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
            transition={{ duration: 0.3 }}
          >
            <Image
              src={typeof value === "string" ? value : "/placeholder.svg"}
              alt={output.name}
              width={400}
              height={200}
              className="object-contain rounded-md"
            />
          </motion.div>
        </div>
      );

    case "text":
      return (
        <motion.div
          className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
        </motion.div>
      );

    case "number":
      return (
        <motion.div
          className="p-3 bg-muted rounded-md text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === "number" ? value : parseFloat(String(value))}
        </motion.div>
      );

    default:
      return (
        <motion.div
          className="p-3 bg-muted rounded-md text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value?.toString()}
        </motion.div>
      );
  }
}
