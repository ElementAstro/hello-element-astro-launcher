import { Plus, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tool } from "@/types/tool";
import { ToolCard } from "./tool-card";

interface ToolListProps {
  tools: Tool[];
  isLoading: boolean;
  searchQuery: string;
  onRunTool: (tool: Tool) => void;
  onDeleteTool: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function ToolList({
  tools,
  isLoading,
  searchQuery,
  onRunTool,
  onDeleteTool,
  onToggleFavorite,
}: ToolListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Calculator className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No tools found</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md">
          {searchQuery
            ? "No tools match your search criteria. Try a different search term."
            : "You haven't created any tools yet. Create your first tool to help with your astronomy calculations."}
        </p>
        <Button onClick={() => router.push("/tools/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tool
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onRun={() => onRunTool(tool)}
          onEdit={() => router.push(`/tools/edit/${tool.id}`)}
          onDelete={() => onDeleteTool(tool.id)}
          onToggleFavorite={() => onToggleFavorite(tool.id)}
        />
      ))}
    </div>
  );
}