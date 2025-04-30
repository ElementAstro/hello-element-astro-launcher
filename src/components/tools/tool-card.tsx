import { Star, MoreHorizontal, Edit, History, Copy, Trash2, Play, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { Tool } from "@/types/tool";
import { getCategoryIcon } from "./utils";

interface ToolCardProps {
  tool: Tool;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function ToolCard({
  tool,
  onRun,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ToolCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">{getCategoryIcon(tool.category)}</div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {tool.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Star
              className={`h-4 w-4 ${
                tool.favorite ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          {tool.lastUsed ? (
            <>
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Last used: {format(parseISO(tool.lastUsed), "MMM d, yyyy")}
              </span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              <span>Never used</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onRun}>
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
      </CardFooter>
    </Card>
  );
}