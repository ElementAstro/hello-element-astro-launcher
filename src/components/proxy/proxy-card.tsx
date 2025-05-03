import {
  Globe,
  PlayCircle,
  StopCircle,
  Pen,
  Trash2,
  BarChart,
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary" />
              {proxy.name}
            </CardTitle>
            <CardDescription>{proxy.description}</CardDescription>
          </div>
          <ProxyStatusBadge status={proxy.status} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">类型:</span>
              <span className="font-medium">{proxy.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">地址:</span>
              <span className="font-medium">{proxy.address}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">延迟:</span>
              <span className="font-medium">{proxy.latency} ms</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onViewLogs(proxy)}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>查看日志</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex space-x-2">
            {proxy.status !== "running" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onStartProxy(proxy.id)}
                    >
                      <PlayCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>启动</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onStopProxy(proxy.id)}
                    >
                      <StopCircle className="h-4 w-4 text-amber-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>停止</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditProxy(proxy.id)}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>编辑</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteProxy(proxy.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>删除</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
