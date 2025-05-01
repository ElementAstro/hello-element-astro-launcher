import { format, parseISO } from "date-fns";
import { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  Info,
  XCircle,
  Download,
  RefreshCw,
  Filter,
  Loader2,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { AgentLog } from "@/types/agent";

interface AgentLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: AgentLog[];
  agentName?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function AgentLogsDialog({
  open,
  onOpenChange,
  logs,
  agentName = "Agent",
  isLoading = false,
  onRefresh,
}: AgentLogsDialogProps) {
  const [filteredLogs, setFilteredLogs] = useState<AgentLog[]>([]);
  const [levelFilter, setLevelFilter] = useState<string[]>([
    "info",
    "warning",
    "error",
    "debug",
  ]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  // Apply filters and sorting to logs
  useEffect(() => {
    setIsFiltering(true);

    try {
      // Filter logs by level
      const filtered = logs.filter((log) => levelFilter.includes(log.level));

      // Sort logs by timestamp
      const sorted = [...filtered].sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });

      setFilteredLogs(sorted);
    } catch (error) {
      console.error("Error filtering or sorting logs:", error);
      setFilteredLogs(logs); // Fallback to original logs
    } finally {
      setIsFiltering(false);
    }
  }, [logs, levelFilter, sortOrder]);

  // Auto-scroll to bottom on new logs if enabled
  useEffect(() => {
    if (autoScroll && logsContainerRef.current && open && !isFiltering) {
      const container = logsContainerRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }, [filteredLogs, autoScroll, open, isFiltering]);

  const handleLevelFilterChange = (level: string) => {
    setLevelFilter((current) =>
      current.includes(level)
        ? current.filter((l) => l !== level)
        : [...current, level]
    );
  };

  const downloadLogs = () => {
    try {
      // Format logs for download
      const content = JSON.stringify(logs, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `${agentName
        .toLowerCase()
        .replace(/\s+/g, "-")}-logs-${
        new Date().toISOString().split("T")[0]
      }.json`;

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up
      URL.revokeObjectURL(url);
      toast.success("Logs downloaded successfully");
    } catch (error) {
      console.error("Error downloading logs:", error);
      toast.error("Failed to download logs", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const logItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {agentName} Logs
              {isLoading && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-2 inline-block"
                >
                  <Loader2 className="h-4 w-4 animate-spin inline-block" />
                </motion.span>
              )}
            </DialogTitle>

            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  aria-label="Refresh logs"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              )}

              <Button
                ref={exportButtonRef}
                variant="ghost"
                size="sm"
                onClick={downloadLogs}
                aria-label="Download logs"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription>
            View the execution logs for this agent
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={levelFilter.includes("info")}
                onCheckedChange={() => handleLevelFilterChange("info")}
              >
                <Info className="h-3.5 w-3.5 mr-2 text-blue-500" />
                Info
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilter.includes("warning")}
                onCheckedChange={() => handleLevelFilterChange("warning")}
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-2 text-amber-500" />
                Warning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilter.includes("error")}
                onCheckedChange={() => handleLevelFilterChange("error")}
              >
                <XCircle className="h-3.5 w-3.5 mr-2 text-destructive" />
                Error
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilter.includes("debug")}
                onCheckedChange={() => handleLevelFilterChange("debug")}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                Debug
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as "newest" | "oldest")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Switch
              id="auto-scroll"
              checked={autoScroll}
              onCheckedChange={setAutoScroll}
            />
            <Label htmlFor="auto-scroll">Auto-scroll</Label>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto mt-2 border rounded-md"
          ref={logsContainerRef}
        >
          <AnimatePresence mode="wait">
            {isFiltering ? (
              <motion.div
                key="filtering"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center p-8"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Processing logs...</span>
              </motion.div>
            ) : filteredLogs.length === 0 ? (
              <motion.div
                key="no-logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No logs available for this agent</p>
                {logs.length > 0 && levelFilter.length < 4 && (
                  <p className="text-xs mt-2">
                    Try adjusting the filter settings
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="logs-list"
                className="p-4 space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    layout
                    variants={logItemVariants}
                    className={`p-2 rounded-md flex items-start gap-2 ${
                      log.level === "error"
                        ? "bg-destructive/10 text-destructive"
                        : log.level === "warning"
                        ? "bg-amber-500/10 text-amber-500"
                        : log.level === "debug"
                        ? "bg-green-500/10 text-green-700"
                        : "bg-muted"
                    }`}
                  >
                    {log.level === "error" ? (
                      <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : log.level === "warning" ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : log.level === "debug" ? (
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-center flex-wrap">
                        <span className="font-medium text-xs px-1.5 py-0.5 rounded bg-background/50">
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp
                            ? format(
                                parseISO(log.timestamp),
                                "MMM d, yyyy HH:mm:ss"
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {log.message}
                      </p>
                      {typeof log.details !== "undefined" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto max-h-[200px]">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <div className="mr-auto text-xs text-muted-foreground">
            {filteredLogs.length} of {logs.length} logs displayed
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="transition-all"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
