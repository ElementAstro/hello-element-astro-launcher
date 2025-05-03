import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProxyLog } from "@/types/proxy";

interface ProxyLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: ProxyLog[];
}

export function ProxyLogsDialog({
  open,
  onOpenChange,
  logs,
}: ProxyLogsDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>代理服务器日志</DialogTitle>
          <DialogDescription>
            查看代理服务器的运行日志和历史事件
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] rounded-md border p-4">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              暂无日志记录
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="text-sm border-l-2 pl-3 py-1"
                  style={{
                    borderColor:
                      log.level === "error"
                        ? "var(--destructive)"
                        : log.level === "warning"
                        ? "var(--warning)"
                        : "var(--primary)",
                  }}
                >
                  <div className="flex justify-between">
                    <span
                      className={`font-medium ${
                        log.level === "error"
                          ? "text-destructive"
                          : log.level === "warning"
                          ? "text-amber-500"
                          : ""
                      }`}
                    >
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(log.time)}
                    </span>
                  </div>
                  <p className="mt-1">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
