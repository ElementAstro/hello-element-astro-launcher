import {
  Calendar,
  Clock,
  Copy,
  Edit,
  MoreHorizontal,
  Pause,
  Play,
  Terminal,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { AgentStatusBadge } from "./agent-status-badge";
import type { Agent } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  onRun: (id: string) => Promise<void> | void;
  onStop: (id: string) => Promise<void> | void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
  onDuplicate?: (id: string) => Promise<void> | void;
}

export function AgentCard({
  agent,
  onRun,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
  onDuplicate,
}: AgentCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async (id: string) => {
    try {
      setIsRunning(true);
      setError(null);
      await onRun(id);
      toast.success(`Agent "${agent.name}" started successfully`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to start agent";
      setError(errorMsg);
      toast.error("Failed to start agent", {
        description: errorMsg,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      setIsStopping(true);
      setError(null);
      await onStop(id);
      toast.success(`Agent "${agent.name}" stopped successfully`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to stop agent";
      setError(errorMsg);
      toast.error("Failed to stop agent", {
        description: errorMsg,
      });
    } finally {
      setIsStopping(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!onDuplicate) return;

    try {
      setIsDuplicating(true);
      setError(null);
      await onDuplicate(id);
      toast.success(`Agent "${agent.name}" duplicated successfully`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to duplicate agent";
      toast.error("Failed to duplicate agent", {
        description: errorMsg,
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy HH:mm") : "Invalid date";
    } catch {
      return "Invalid date format";
    }
  };

  const lastRunFormatted = formatDate(agent.lastRun);
  const nextRunFormatted = formatDate(agent.nextRun);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      data-testid={`agent-card-${agent.id}`}
      aria-label={`Agent: ${agent.name}`}
    >
      <Card className={error ? "border-destructive" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {agent.name}
                <AgentStatusBadge status={agent.status} />
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {agent.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewLogs}>
                  <Terminal className="h-4 w-4 mr-2" />
                  View Logs
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!onDuplicate || isDuplicating}
                  onClick={() => handleDuplicate(agent.id)}
                >
                  {isDuplicating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isDuplicating ? "Duplicating..." : "Duplicate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-3 p-2 bg-destructive/10 text-destructive rounded-md flex items-center text-sm"
              >
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-xs">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <motion.div
                className="flex items-center text-sm text-muted-foreground"
                whileHover={{ scale: 1.01 }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Type:{" "}
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </span>
              </motion.div>
              {agent.lastRun && (
                <motion.div
                  className="flex items-center text-sm text-muted-foreground"
                  whileHover={{ scale: 1.01 }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Last run: {lastRunFormatted}</span>
                </motion.div>
              )}
              {agent.nextRun && (
                <motion.div
                  className="flex items-center text-sm text-muted-foreground"
                  whileHover={{ scale: 1.01 }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Next run: {nextRunFormatted}</span>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 self-end">
              {agent.status === "running" ? (
                <Button
                  variant="outline"
                  onClick={() => handleStop(agent.id)}
                  disabled={isStopping}
                  aria-label="Stop agent"
                >
                  {isStopping ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  {isStopping ? "Stopping..." : "Stop"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleRun(agent.id)}
                  disabled={isRunning}
                  aria-label="Run agent"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? "Starting..." : "Run"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
