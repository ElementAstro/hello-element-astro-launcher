"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Plus,
  Calendar,
  Clock,
  MoreHorizontal,
  Search,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Info,
  Edit,
  Trash2,
  Copy,
  Terminal,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";

import { useAppStore } from "@/store/store";
import type { Agent, AgentLog } from "@/types/agent";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function AgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [selectedAgentLogs, setSelectedAgentLogs] = useState<AgentLog[]>([]);

  const {
    agents,
    isAgentLoading,
    fetchAgents,
    runAgent,
    stopAgent,
    deleteAgent,
  } = useAppStore();

  // Fetch agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        await fetchAgents();
      } catch (err) {
        toast("Failed to load agents. Please try again.", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    loadAgents();
  }, [fetchAgents]);

  // Filter agents based on search and tab
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "running" && agent.status === "running") ||
      (selectedTab === "idle" && agent.status === "idle") ||
      (selectedTab === "error" && agent.status === "error");

    return matchesSearch && matchesTab;
  });

  // Handle agent actions
  const handleRunAgent = async (id: string) => {
    try {
      await runAgent(id);
      toast("The agent has been started successfully.", {
        description: "The agent is now running.",
      });
    } catch (err) {
      toast("Failed to start agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleStopAgent = async (id: string) => {
    try {
      await stopAgent(id);
      toast("The agent has been stopped successfully.", {
        description: "The agent has been stopped.",
      });
    } catch (err) {
      toast("Failed to stop agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    try {
      await deleteAgent(agentToDelete);
      setIsDeleteDialogOpen(false);
      setAgentToDelete(null);
      toast("The agent has been deleted successfully.", {
        description: "All agent data has been removed.",
      });
    } catch (err) {
      toast("Failed to delete agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleViewLogs = (agent: Agent) => {
    setSelectedAgentLogs(agent.logs);
    setIsLogsDialogOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await fetchAgents();
      toast("Agent list refreshed", {
        description: "The agent list has been updated.",
      });
    } catch (err) {
      toast("Failed to refresh agents", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-auto pb-16 md:pb-0"
      >
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
              <p className="text-muted-foreground">
                Create and manage automated agents for your astronomy workflow
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/agents/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="running">Running</TabsTrigger>
                  <TabsTrigger value="idle">Idle</TabsTrigger>
                  <TabsTrigger value="error">Error</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isAgentLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : filteredAgents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Terminal className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No agents found</h3>
                <p className="text-muted-foreground mt-2 mb-4 max-w-md">
                  {searchQuery
                    ? "No agents match your search criteria. Try a different search term."
                    : "You haven't created any agents yet. Create your first agent to automate your astronomy workflow."}
                </p>
                <Button onClick={() => router.push("/agents/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Agent
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="agents"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {filteredAgents.map((agent) => (
                  <motion.div key={agent.id} variants={itemVariants} layout>
                    <AgentCard
                      agent={agent}
                      onRun={handleRunAgent}
                      onStop={handleStopAgent}
                      onEdit={() => router.push(`/agents/edit/${agent.id}`)}
                      onDelete={() => {
                        setAgentToDelete(agent.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      onViewLogs={() => handleViewLogs(agent)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              agent and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAgentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAgent}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logs Dialog */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Agent Logs</DialogTitle>
            <DialogDescription>
              View the execution logs for this agent
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto mt-4 border rounded-md">
            <div className="p-4 space-y-2">
              {selectedAgentLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No logs available for this agent
                </div>
              ) : (
                selectedAgentLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded-md flex items-start gap-2 ${
                      log.level === "error"
                        ? "bg-destructive/10 text-destructive"
                        : log.level === "warning"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-muted"
                    }`}
                  >
                    {log.level === "error" ? (
                      <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : log.level === "warning" ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp
                            ? format(
                                parseISO(log.timestamp as string),
                                "MMM d, yyyy HH:mm:ss"
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{log.message}</p>
                      {log.details && (
                        <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsLogsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </AppLayout>
  );
}

interface AgentCardProps {
  agent: Agent;
  onRun: (id: string) => void;
  onStop: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
}

function AgentCard({
  agent,
  onRun,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
}: AgentCardProps) {
  const getStatusBadge = () => {
    switch (agent.status) {
      case "running":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" />
            Running
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {agent.name}
                {getStatusBadge()}
              </CardTitle>
              <CardDescription className="mt-1">
                {agent.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewLogs}>
                  <Terminal className="h-4 w-4 mr-2" />
                  View Logs
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Type:{" "}
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </span>
              </div>
              {agent.lastRun && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Last run:{" "}
                    {format(parseISO(agent.lastRun), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              )}
              {agent.nextRun && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Next run:{" "}
                    {format(parseISO(agent.nextRun), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 self-end">
              {agent.status === "running" ? (
                <Button variant="outline" onClick={() => onStop(agent.id)}>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button onClick={() => onRun(agent.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
