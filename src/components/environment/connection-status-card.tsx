import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionStatus } from "./types";

interface ConnectionStatusCardProps {
  connections: ConnectionStatus[];
}

export function ConnectionStatusCard({ connections }: ConnectionStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          Connection Status
        </CardTitle>
        <CardDescription>
          Monitor and manage software connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    connection.status === "connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h4 className="font-medium">{connection.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {connection.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {connection.status === "connected" ? "Details" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}