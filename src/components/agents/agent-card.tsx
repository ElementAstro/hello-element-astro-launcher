import { Calendar, Clock, Copy, Edit, MoreHorizontal, Pause, Play, Terminal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AgentStatusBadge } from "./agent-status-badge";
import type { Agent } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  onRun: (id: string) => void;
  onStop: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
}

export function AgentCard({
  agent,
  onRun,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
}: AgentCardProps) {
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
                <AgentStatusBadge status={agent.status} />
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
                  Type: {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </span>
              </div>
              {agent.lastRun && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Last run: {format(parseISO(agent.lastRun), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              )}
              {agent.nextRun && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Next run: {format(parseISO(agent.nextRun), "MMM d, yyyy HH:mm")}
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