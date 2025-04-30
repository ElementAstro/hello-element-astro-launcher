import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogEntry } from "./types";

interface ConnectionLogsCardProps {
  logs: LogEntry[];
}

export function ConnectionLogsCard({ logs }: ConnectionLogsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Connection Logs
        </CardTitle>
        <CardDescription>
          Recent connection events and errors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
            >
              {log.type === "success" ? (
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              )}
              <div>
                <div className="font-medium">{log.title}</div>
                <div className="text-muted-foreground">{log.timestamp}</div>
                {log.errorMessage && (
                  <div className="text-xs text-red-500">{log.errorMessage}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View Full Logs</Button>
      </CardFooter>
    </Card>
  );
}