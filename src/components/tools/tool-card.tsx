import {
  Star,
  MoreHorizontal,
  Edit,
  History,
  Copy,
  Trash2,
  Play,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Tool } from "@/types/tool";
import { getCategoryIcon } from "./utils";
import { VARIANTS } from "./animation-constants";

interface ToolCardProps {
  tool: Tool;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  index?: number;
}

export function ToolCard({
  tool,
  onRun,
  onEdit,
  onDelete,
  onToggleFavorite,
  index = 0,
}: ToolCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setError(null);
      await onRun();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to run tool");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={VARIANTS.listItem}
      custom={index}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg"
    >
      <Card
        className={`h-full transition-shadow duration-300 ${
          isHovering ? "shadow-md" : ""
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {getCategoryIcon(tool.category)}
                </motion.div>
              </div>
              <div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={
                      tool.favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          tool.favorite ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {tool.favorite ? "Remove from favorites" : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Tool options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <History className="h-4 w-4 mr-2" />
                <span>View History</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Copy className="h-4 w-4 mr-2" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete "${tool.name}"?`
                    )
                  ) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="relative overflow-hidden"
          >
            {isRunning ? (
              <>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/20"
                  initial="initial"
                  animate="animate"
                  variants={VARIANTS.progressBar}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                </motion.div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                <span>Run</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
