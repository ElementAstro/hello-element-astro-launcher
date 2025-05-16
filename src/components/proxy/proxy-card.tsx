import {
  Globe,
  PlayCircle,
  StopCircle,
  Pen,
  Trash2,
  BarChart,
  Shield,
  Network,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProxyStatusBadge } from "./proxy-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/components/i18n";
import type { Proxy } from "@/types/proxy";

interface ProxyCardProps {
  proxy: Proxy;
  onStartProxy: (id: string) => void;
  onStopProxy: (id: string) => void;
  onEditProxy: (id: string) => void;
  onDeleteProxy: (id: string) => void;
  onViewLogs: (proxy: Proxy) => void;
}

export function ProxyCard({
  proxy,
  onStartProxy,
  onStopProxy,
  onEditProxy,
  onDeleteProxy,
  onViewLogs,
}: ProxyCardProps) {
  const { t } = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >      <Card className="overflow-hidden hover:shadow-sm transition-shadow" style={{ height: '105px' }}><CardHeader className="flex flex-row items-start justify-between space-y-0 py-1.5 px-3">
          <div>            <CardTitle className="text-sm flex items-center font-medium">
              {proxy.type === "http" ? (
                <Globe className="h-3.5 w-3.5 mr-1 text-primary" />
              ) : proxy.type === "socks5" ? (
                <Network className="h-3.5 w-3.5 mr-1 text-indigo-500" />
              ) : (
                <Shield className="h-3.5 w-3.5 mr-1 text-amber-500" />
              )}
              {proxy.name}
            </CardTitle>
            <CardDescription className="text-[10px] line-clamp-1">{proxy.description}</CardDescription>
          </div>
          <ProxyStatusBadge status={proxy.status} />
        </CardHeader>
        <CardContent className="py-1.5 px-3">          <div className="grid gap-1">            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground/80">
                {t("proxy.card.type")}
              </span>
              <span className={`font-medium px-1.5 py-0.5 rounded text-[10px] ${
                proxy.type === "http" 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                  : proxy.type === "socks5" 
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>{proxy.type.toUpperCase()}</span>
            </div>            <div className="flex items-center text-xs">
              <span className="text-muted-foreground/80 w-12 flex-shrink-0">
                {t("proxy.card.address")}
              </span>
              <span className="font-mono text-[10px] truncate ml-1 bg-muted/30 px-1 py-0.5 rounded w-full text-center">{proxy.address}</span>
            </div><div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground/80">
                {t("proxy.card.latency")}
              </span>
              <span className={`font-medium text-[10px] px-1 py-0.5 rounded ${
                proxy.latency < 100 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : proxy.latency < 150 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {proxy.latency} ms
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between py-1 px-3">          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onViewLogs(proxy)}
                >
                  <BarChart className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("proxy.card.tooltips.viewLogs")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-1">
            {proxy.status !== "running" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onStartProxy(proxy.id)}
                    >
                      <PlayCircle className="h-3.5 w-3.5 text-green-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("proxy.card.tooltips.start")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onStopProxy(proxy.id)}
                    >
                      <StopCircle className="h-3.5 w-3.5 text-amber-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("proxy.card.tooltips.stop")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onEditProxy(proxy.id)}
                  >
                    <Pen className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("proxy.card.tooltips.edit")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onDeleteProxy(proxy.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t("proxy.card.tooltips.delete")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
