import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "@/components/i18n";
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
  const { t, formatDate: formatDateI18n } = useTranslations();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDateI18n(date, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base">{t("proxy.logsDialog.title")}</DialogTitle>
          <DialogDescription className="text-xs">
            {t("proxy.logsDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border p-3">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              {t("proxy.logsDialog.noLogs")}
            </div>
          ) : (
            <div className="space-y-1.5">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 pl-2 py-0.5"
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
                    <span className="text-muted-foreground text-[10px]">
                      {formatDate(log.time)}
                    </span>
                  </div>
                  <p className="mt-0.5">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
