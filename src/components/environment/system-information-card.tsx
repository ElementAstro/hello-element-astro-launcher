import { Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { fadeIn } from "./animation-constants";
import { SystemInfo } from "./types";

interface SystemInformationCardProps {
  systemInfo: SystemInfo;
}

export function SystemInformationCard({ systemInfo }: SystemInformationCardProps) {
  return (
    <motion.div variants={fadeIn}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="h-5 w-5 mr-2" />
            System Information
          </CardTitle>
          <CardDescription>
            Details about your computer system and software environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Operating System</Label>
                <div className="font-medium">{systemInfo.os}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Processor</Label>
                <div className="font-medium">{systemInfo.processor}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Memory</Label>
                <div className="font-medium">{systemInfo.memory}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Graphics</Label>
                <div className="font-medium">{systemInfo.graphics}</div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">ASCOM Platform</Label>
                <div className="font-medium">
                  Version {systemInfo.ascomVersion} (Installed)
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">INDIGO Platform</Label>
                <div className="font-medium">
                  {systemInfo.indigoInstalled ? "Installed" : "Not Installed"}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">INDI Library</Label>
                <div className="font-medium">
                  {systemInfo.indiInstalled ? "Installed" : "Not Installed"}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">PHD2 Guiding</Label>
                <div className="font-medium">
                  Version {systemInfo.phd2Version} (Installed)
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-muted-foreground">Storage</Label>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">C: (System)</span>
                    <span>
                      {systemInfo.storage.system.free} free of{" "}
                      {systemInfo.storage.system.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${systemInfo.storage.system.percentUsed}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">D: (Data)</span>
                    <span>
                      {systemInfo.storage.data.free} free of{" "}
                      {systemInfo.storage.data.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${systemInfo.storage.data.percentUsed}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">System Report</Button>
          <Button variant="outline">Check for Updates</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}