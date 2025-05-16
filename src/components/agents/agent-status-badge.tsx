import { AlertTriangle, Pause, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/components/i18n/client";

interface AgentStatusBadgeProps {
  status: "running" | "paused" | "error" | "idle";
  showTooltip?: boolean;
}

export function AgentStatusBadge({
  status,
  showTooltip = true,
}: AgentStatusBadgeProps) {
  const { t } = useTranslations();

  const getStatusDescription = () => {
    switch (status) {
      case "running":
        return t("agent.status.running.description", {
          defaultValue: "Agent is currently running",
        });
      case "paused":
        return t("agent.status.paused.description", {
          defaultValue: "Agent is paused and will not execute tasks",
        });
      case "error":
        return t("agent.status.error.description", {
          defaultValue: "Agent encountered an error during execution",
        });
      case "idle":
        return t("agent.status.idle.description", {
          defaultValue: "Agent is idle and waiting for scheduled execution",
        });
      default:
        return t("agent.status.unknown", { defaultValue: "Unknown status" });
    }
  };

  // Shared animation properties
  const pulseAnimation = {
    scale: [1, 1.1, 1],
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
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          >
            <Badge
              className="bg-green-500 hover:bg-green-600 transition-colors text-[0.65rem] px-1.5 py-0 h-4"
              aria-label={t("agent.status.running.ariaLabel", {
                defaultValue: "Agent status: running",
              })}
            >
              <motion.div
                className="w-1 h-1 rounded-full bg-white mr-1"
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
              {t("agent.status.running.label", { defaultValue: "Running" })}
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
              className="text-amber-500 border-amber-500 transition-all hover:bg-amber-500/10 text-[0.65rem] px-1.5 py-0 h-4"
              aria-label={t("agent.status.paused.ariaLabel", {
                defaultValue: "Agent status: paused",
              })}
            >
              <Pause className="h-2.5 w-2.5 mr-0.5" />
              {t("agent.status.paused.label", { defaultValue: "Paused" })}
            </Badge>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            animate={pulseAnimation}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          >
            <Badge
              variant="destructive"
              className="transition-all text-[0.65rem] px-1.5 py-0 h-4"
              aria-label={t("agent.status.error.ariaLabel", {
                defaultValue: "Agent status: error",
              })}
            >
              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
              {t("agent.status.error.label", { defaultValue: "Error" })}
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
              className="transition-all text-[0.65rem] px-1.5 py-0 h-4"
              aria-label={t("agent.status.idle.ariaLabel", {
                defaultValue: "Agent status: idle",
              })}
            >
              <Clock className="h-2.5 w-2.5 mr-0.5 text-muted-foreground" />
              {t("agent.status.idle.label", { defaultValue: "Idle" })}
            </Badge>
          </motion.div>
        );
    }
  };
  // Conditional rendering based on showTooltip prop
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span>
            <BadgeComponent />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs py-1 px-2">
          <p>{getStatusDescription()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <BadgeComponent />
  );
}
