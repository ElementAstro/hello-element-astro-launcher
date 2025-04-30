import { format, parseISO } from "date-fns";
import { AlertTriangle, Info, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AgentLog } from "@/types/agent";

interface AgentLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: AgentLog[];
}

export function AgentLogsDialog({
  open,
  onOpenChange,
  logs,
}: AgentLogsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Agent Logs</DialogTitle>
          <DialogDescription>
            View the execution logs for this agent
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4 border rounded-md">
          <div className="p-4 space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs available for this agent
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded-md flex items-start gap-2 ${
                    log.level === "error"
                      ? "bg-destructive/10 text-destructive"
                      : log.level === "warning"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted"
                  }`}
                >
                  {log.level === "error" ? (
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  ) : log.level === "warning" ? (
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp
                          ? format(
                              parseISO(log.timestamp as string),
                              "MMM d, yyyy HH:mm:ss"
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{log.message}</p>
                    {typeof log.details !== "undefined" && (
                      <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}