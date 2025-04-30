import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentHeaderProps {
  onCreateAgent: () => void;
}

export function AgentHeader({ onCreateAgent }: AgentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
        <p className="text-muted-foreground">
          Create and manage automated agents for your astronomy workflow
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>
    </div>
  );
}