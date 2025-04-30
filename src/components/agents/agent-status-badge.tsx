import { AlertTriangle, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentStatusBadgeProps {
  status: "running" | "paused" | "error" | "idle";
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  switch (status) {
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
}