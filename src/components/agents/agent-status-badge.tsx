import { AlertTriangle, Pause, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AgentStatusBadgeProps {
  status: "running" | "paused" | "error" | "idle";
  showTooltip?: boolean;
}

export function AgentStatusBadge({
  status,
  showTooltip = true,
}: AgentStatusBadgeProps) {
  const getStatusDescription = () => {
    switch (status) {
      case "running":
        return "Agent is currently running";
      case "paused":
        return "Agent is paused and will not execute tasks";
      case "error":
        return "Agent encountered an error during execution";
      case "idle":
        return "Agent is idle and waiting for scheduled execution";
      default:
        return "Unknown status";
    }
  };

  // Shared animation properties
  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Badge component with animations
  const BadgeComponent = () => {
    switch (status) {
      case "running":
        return (
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          >
            <Badge
              className="bg-green-500 hover:bg-green-600 transition-colors"
              aria-label="Agent status: running"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Running
            </Badge>
          </motion.div>
        );
      case "paused":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="outline"
              className="text-amber-500 border-amber-500 transition-all hover:bg-amber-500/10"
              aria-label="Agent status: paused"
            >
              <Pause className="h-3 w-3 mr-1" />
              Paused
            </Badge>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            animate={pulseAnimation}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          >
            <Badge
              variant="destructive"
              className="transition-all"
              aria-label="Agent status: error"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="outline"
              className="transition-all"
              aria-label="Agent status: idle"
            >
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              Idle
            </Badge>
          </motion.div>
        );
    }
  };

  // Conditional rendering based on showTooltip prop
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <BadgeComponent />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{getStatusDescription()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <BadgeComponent />
  );
}
