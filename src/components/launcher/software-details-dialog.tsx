import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, DownloadIcon, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  dialogVariants,
  progressVariants,
  ANIMATION_DURATION,
} from "./animation-constants";
import type { Software, ActionHandler } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SoftwareDetailsDialogProps {
  software: Software | null;
  isOpen: boolean;
  isInstalling: boolean;
  installProgress: number;
  onOpenChange: (open: boolean) => void;
  onAction: ActionHandler;
  error?: string | null;
}

export function SoftwareDetailsDialog({
  software,
  isOpen,
  isInstalling,
  installProgress,
  onOpenChange,
  onAction,
  error = null,
}: SoftwareDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);

  if (!software) return null;

  const handleWebsiteClick = () => {
    if (software.website) {
      window.open(software.website, "_blank", "noopener,noreferrer");
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAction = () => {
    if (isInstalling) return;
    onAction(software);
  };

  const isActionDisabled = isInstalling || Boolean(error);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => {
          if (isInstalling) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isInstalling) {
            e.preventDefault();
          }
        }}
      >
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={
                    imageError
                      ? "/placeholder.svg"
                      : software.icon || "/placeholder.svg"
                  }
                  alt={software.name}
                  width={40}
                  height={40}
                  className="rounded"
                  onError={handleImageError}
                />
              </div>
              <DialogTitle>{software.name}</DialogTitle>
            </div>
            <DialogDescription>{software.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: ANIMATION_DURATION.normal }}
                >
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Version:</div>
              <div>{software.version}</div>

              <div className="text-muted-foreground">Size:</div>
              <div>{software.size}</div>

              <div className="text-muted-foreground">Developer:</div>
              <div>{software.developer}</div>

              <div className="text-muted-foreground">Downloads:</div>
              <div>{software.downloads.toLocaleString()}</div>

              <div className="text-muted-foreground">Last Updated:</div>
              <div>{new Date(software.lastUpdated).toLocaleDateString()}</div>

              <div className="text-muted-foreground">Status:</div>
              <div>
                {software.installed ? (
                  <Badge variant="default">Installed</Badge>
                ) : (
                  <Badge variant="secondary">Not Installed</Badge>
                )}
              </div>

              {software.dependencies && software.dependencies.length > 0 && (
                <>
                  <div className="text-muted-foreground">Dependencies:</div>
                  <div>{software.dependencies.join(", ")}</div>
                </>
              )}

              {software.tags && software.tags.length > 0 && (
                <>
                  <div className="text-muted-foreground">Tags:</div>
                  <div className="flex flex-wrap gap-1">
                    {software.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <AnimatePresence>
              {isInstalling && software.actionLabel === "Install" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: ANIMATION_DURATION.normal }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>Installing...</span>
                    <span>{installProgress}%</span>
                  </div>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    custom={installProgress}
                    variants={progressVariants}
                  >
                    <Progress value={installProgress} className="h-2" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {software.releaseNotes && (
              <div className="space-y-2">
                <Label htmlFor="release-notes">Release Notes</Label>
                <div
                  id="release-notes"
                  className="text-sm p-2 bg-muted rounded-md max-h-24 overflow-y-auto"
                  tabIndex={0}
                  role="region"
                  aria-label="Release notes"
                >
                  {software.releaseNotes}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {software.website && (
              <Button
                variant="outline"
                className="mr-auto"
                onClick={handleWebsiteClick}
                disabled={isInstalling}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            )}

            <Button
              onClick={handleAction}
              disabled={isActionDisabled}
              className={cn(isInstalling && "opacity-80 cursor-not-allowed")}
            >
              {isInstalling ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-r-transparent rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : software.actionLabel === "Install" ? (
                <>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Install
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Launch
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
