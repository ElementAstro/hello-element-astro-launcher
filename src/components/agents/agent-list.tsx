import { Plus, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentCard } from "./agent-card";
import { containerVariants, itemVariants } from "./constants";
import type { Agent } from "@/types/agent";

interface AgentListProps {
  agents: Agent[];
  isLoading: boolean;
  searchQuery: string;
  onRunAgent: (id: string) => void;
  onStopAgent: (id: string) => void;
  onEditAgent: (id: string) => void;
  onDeleteAgent: (id: string) => void;
  onViewLogs: (agent: Agent) => void;
  onCreateAgent: () => void;
}

export function AgentList({
  agents,
  isLoading,
  searchQuery,
  onRunAgent,
  onStopAgent,
  onEditAgent,
  onDeleteAgent,
  onViewLogs,
  onCreateAgent,
}: AgentListProps) {
  if (isLoading) {
    return (
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
    );
  }

  if (agents.length === 0) {
    return (
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
        <Button onClick={onCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="agents"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {agents.map((agent) => (
        <motion.div key={agent.id} variants={itemVariants} layout>
          <AgentCard
            agent={agent}
            onRun={() => onRunAgent(agent.id)}
            onStop={() => onStopAgent(agent.id)}
            onEdit={() => onEditAgent(agent.id)}
            onDelete={() => onDeleteAgent(agent.id)}
            onViewLogs={() => onViewLogs(agent)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}