import { motion } from "framer-motion";
import Image from "next/image";
import { Play, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogVariants, progressVariants } from "./animation-constants";
import type { Software, ActionHandler } from "./types";

interface SoftwareDetailsDialogProps {
  software: Software | null;
  isOpen: boolean;
  isInstalling: boolean;
  installProgress: number;
  onOpenChange: (open: boolean) => void;
  onAction: ActionHandler;
}

export function SoftwareDetailsDialog({
  software,
  isOpen,
  isInstalling,
  installProgress,
  onOpenChange,
  onAction,
}: SoftwareDetailsDialogProps) {
  if (!software) return null;

  const handleWebsiteClick = () => {
    if (software.website) {
      window.open(software.website, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Image
                src={software.icon || "/placeholder.svg"}
                alt={software.name}
                width={40}
                height={40}
                className="rounded"
              />
              <DialogTitle>{software.name}</DialogTitle>
            </div>
            <DialogDescription>{software.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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

            {isInstalling && software.actionLabel === "Install" && (
              <motion.div
                variants={progressVariants}
                initial="initial"
                animate="animate"
                custom={installProgress}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Installing...</span>
                  <span>{installProgress}%</span>
                </div>
                <Progress value={installProgress} />
              </motion.div>
            )}

            {software.releaseNotes && (
              <div className="space-y-2">
                <Label>Release Notes</Label>
                <div className="text-sm p-2 bg-muted rounded-md max-h-24 overflow-y-auto">
                  {software.releaseNotes}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {software.website && (
              <Button
                variant="outline"
                className="mr-auto"
                onClick={handleWebsiteClick}
              >
                Visit Website
              </Button>
            )}

            <Button
              onClick={() => onAction(software)}
              disabled={isInstalling}
            >
              {software.actionLabel === "Install" ? (
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