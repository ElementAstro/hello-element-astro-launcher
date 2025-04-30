import Image from "next/image";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Software, ViewMode, ActionHandler } from "./types";

interface SoftwareItemProps {
  software: Software;
  viewMode: ViewMode;
  onAction: ActionHandler;
  onInfo: () => void;
}

export function SoftwareItem({
  software,
  viewMode,
  onAction,
  onInfo,
}: SoftwareItemProps) {
  const formattedDate = new Date(software.lastUpdated).toLocaleDateString();

  if (viewMode === "grid") {
    return (
      <div className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 flex items-center gap-3 border-b bg-muted/20">
          <Image
            src={software.icon || "/placeholder.svg"}
            alt={software.name}
            width={40}
            height={40}
            className="rounded"
          />
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfo}
              title="More Info"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant={
                software.actionLabel === "Launch" ? "default" : "outline"
              }
              size="sm"
              className="whitespace-nowrap"
              onClick={() => onAction(software)}
            >
              {software.actionLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mr-4">
        <Image
          src={software.icon || "/placeholder.svg"}
          alt={software.name}
          width={40}
          height={40}
          className="rounded"
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
        <Button variant="ghost" size="icon" onClick={onInfo} title="More Info">
          <Info className="h-4 w-4" />
        </Button>
        <Button
          variant={software.actionLabel === "Launch" ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => onAction(software)}
        >
          {software.actionLabel}
        </Button>
      </div>
    </div>
  );
}