import Image from "next/image";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { itemVariants } from "./animation-constants";
import type { Software, ViewMode, ActionHandler } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SoftwareItemProps {
  software: Software;
  viewMode: ViewMode;
  onAction: ActionHandler;
  onInfo: () => void;
  isLoading?: boolean;
}

export function SoftwareItem({
  software,
  viewMode,
  onAction,
  onInfo,
  isLoading = false,
}: SoftwareItemProps) {
  const [imageError, setImageError] = useState(false);
  const formattedDate = new Date(software.lastUpdated).toLocaleDateString();

  const handleAction = () => {
    if (isLoading) return;
    onAction(software);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        className="flex flex-col border rounded-lg overflow-hidden transition-all"
        layoutId={`software-${software.id}`}
      >
        <div className="p-4 flex items-center gap-3 border-b bg-muted/20">
          <div className="relative w-10 h-10">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded">
                <div className="h-5 w-5 border-2 border-r-transparent rounded-full animate-spin border-primary"></div>
              </div>
            )}

            <Image
              src={
                imageError
                  ? "/placeholder.svg"
                  : software.icon || "/placeholder.svg"
              }
              alt={software.name}
              width={40}
              height={40}
              className={cn("rounded", isLoading && "opacity-50")}
              onError={handleImageError}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium truncate">
                {software.name}
              </h3>
              {software.featured && (
                <Badge variant="secondary" className="ml-auto">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {software.description}
          </p>
        </div>
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>v{software.version}</span>
            <span>Updated: {formattedDate}</span>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onInfo}
                  title="More Info"
                  aria-label="More information about this software"
                  disabled={isLoading}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More Information</TooltipContent>
            </Tooltip>

            <Button
              variant={
                software.actionLabel === "Launch" ? "default" : "outline"
              }
              size="sm"
              className={cn(
                "whitespace-nowrap",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
              onClick={handleAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-1 h-3 w-3 border-2 border-r-transparent rounded-full animate-spin"></div>
                  {software.actionLabel === "Install"
                    ? "Installing..."
                    : "Loading..."}
                </>
              ) : (
                software.actionLabel
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="flex items-start p-4 border rounded-lg transition-all"
      layoutId={`software-${software.id}`}
    >
      <div className="flex-shrink-0 mr-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded">
            <div className="h-5 w-5 border-2 border-r-transparent rounded-full animate-spin border-primary"></div>
          </div>
        )}
        <Image
          src={
            imageError
              ? "/placeholder.svg"
              : software.icon || "/placeholder.svg"
          }
          alt={software.name}
          width={40}
          height={40}
          className={cn("rounded", isLoading && "opacity-50")}
          onError={handleImageError}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">{software.name}</h3>
          {software.featured && <Badge variant="secondary">Featured</Badge>}
          {software.installed && <Badge variant="outline">Installed</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {software.description}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>v{software.version}</span>
          <span>{software.downloads.toLocaleString()} downloads</span>
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0 flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfo}
              title="More Info"
              aria-label="More information about this software"
              disabled={isLoading}
            >
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>More Information</TooltipContent>
        </Tooltip>

        <Button
          variant={software.actionLabel === "Launch" ? "default" : "outline"}
          size="sm"
          className={cn(
            "whitespace-nowrap",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          onClick={handleAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-1 h-3 w-3 border-2 border-r-transparent rounded-full animate-spin"></div>
              {software.actionLabel === "Install"
                ? "Installing..."
                : "Loading..."}
            </>
          ) : (
            software.actionLabel
          )}
        </Button>
      </div>
    </motion.div>
  );
}
