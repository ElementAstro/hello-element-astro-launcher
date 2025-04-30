import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DownloadItem as DownloadItemType } from "@/types";
import { cardVariants, progressVariants } from "./animation-variants";
import { getStatusIcon, getStatusText } from "./download-status-utils";

interface DownloadItemProps {
  download: DownloadItemType;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export function DownloadItem({
  download,
  onCancel,
  onPause,
  onResume,
}: DownloadItemProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="mr-4">
              <Image
                src={download.icon || "/placeholder.svg"}
                alt={download.name}
                width={40}
                height={40}
                className="rounded"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{download.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    Version {download.version} • {download.size}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(download.status)}
                    {getStatusText(download.status)}
                  </Badge>
                  {download.status !== "completed" &&
                    download.status !== "error" &&
                    onCancel && (
                      <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              </div>

              {download.status !== "completed" &&
                download.status !== "error" && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{download.progress.toFixed(0)}%</span>
                      {download.status === "downloading" &&
                        download.estimatedTimeRemaining && (
                          <span>
                            {download.estimatedTimeRemaining} remaining
                          </span>
                        )}
                    </div>
                    <motion.div
                      initial="start"
                      animate="animate"
                      custom={download.progress}
                      variants={progressVariants}
                    >
                      <Progress value={download.progress} />
                    </motion.div>

                    {(download.status === "downloading" ||
                      download.status === "paused") && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {download.speed}
                        </span>
                        <div>
                          {download.status === "downloading" && onPause && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onPause}
                            >
                              Pause
                            </Button>
                          )}
                          {download.status === "paused" && onResume && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onResume}
                            >
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}