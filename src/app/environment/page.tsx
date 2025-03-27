"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Monitor,
  MoreHorizontal,
  RefreshCw,
  Save,
  Settings,
  Telescope,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";

export default function EnvironmentPage() {
  const [activeTab, setActiveTab] = useState("system");
  const { equipment, systemInfo } = useAppStore();

  // Group equipment by type
  const equipmentByType = equipment.reduce((acc, item) => {
    const type = item.type.toLowerCase().includes("camera")
      ? "cameras"
      : item.type.toLowerCase().includes("mount") ||
        item.type.toLowerCase().includes("telescope")
      ? "telescopes"
      : item.type.toLowerCase().includes("focuser") ||
        item.type.toLowerCase().includes("filter")
      ? "focusers"
      : "other";

    if (!acc[type]) {
      acc[type] = [];
    }

    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof equipment>);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Environment</h1>
              <p className="text-muted-foreground">
                Manage your astronomy equipment and system settings
              </p>
            </div>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Devices
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-6 mt-6">
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
                        <Label className="text-muted-foreground">
                          Operating System
                        </Label>
                        <div className="font-medium">{systemInfo.os}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          Processor
                        </Label>
                        <div className="font-medium">
                          {systemInfo.processor}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Memory</Label>
                        <div className="font-medium">{systemInfo.memory}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          Graphics
                        </Label>
                        <div className="font-medium">{systemInfo.graphics}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          ASCOM Platform
                        </Label>
                        <div className="font-medium">
                          Version {systemInfo.ascomVersion} (Installed)
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          INDIGO Platform
                        </Label>
                        <div className="font-medium">
                          {systemInfo.indigoInstalled
                            ? "Installed"
                            : "Not Installed"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          INDI Library
                        </Label>
                        <div className="font-medium">
                          {systemInfo.indiInstalled
                            ? "Installed"
                            : "Not Installed"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">
                          PHD2 Guiding
                        </Label>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide settings for astronomy software
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode for All Applications</Label>
                        <p className="text-sm text-muted-foreground">
                          Force dark mode for all compatible astronomy
                          applications
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Red Light Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use red color scheme to preserve night vision
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Default Data Location</Label>
                      <div className="flex gap-2">
                        <Input
                          value="D:\AstroData"
                          readOnly
                          className="flex-1"
                        />
                        <Button variant="outline">Browse</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Temperature Units</Label>
                      <Select defaultValue="celsius">
                        <SelectTrigger>
                          <SelectValue placeholder="Select temperature units" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celsius">Celsius (°C)</SelectItem>
                          <SelectItem value="fahrenheit">
                            Fahrenheit (°F)
                          </SelectItem>
                          <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Telescope className="h-5 w-5 mr-2" />
                    Connected Equipment
                  </CardTitle>
                  <CardDescription>
                    Manage your astronomy equipment and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="telescopes">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Telescope className="h-4 w-4 mr-2" />
                          Telescopes & Mounts
                          <Badge variant="outline" className="ml-2">
                            {equipmentByType.telescopes?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {equipmentByType.telescopes?.map((item) => (
                            <EquipmentItem
                              key={item.id}
                              name={item.name}
                              type={item.type}
                              status={item.status}
                              driver={item.driver}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cameras">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          Cameras
                          <Badge variant="outline" className="ml-2">
                            {equipmentByType.cameras?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {equipmentByType.cameras?.map((item) => (
                            <EquipmentItem
                              key={item.id}
                              name={item.name}
                              type={item.type}
                              status={item.status}
                              driver={item.driver}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="focusers">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2" />
                          Focusers & Filter Wheels
                          <Badge variant="outline" className="ml-2">
                            {equipmentByType.focusers?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {equipmentByType.focusers?.map((item) => (
                            <EquipmentItem
                              key={item.id}
                              name={item.name}
                              type={item.type}
                              status={item.status}
                              driver={item.driver}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="other">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 mr-2" />
                          Other Devices
                          <Badge variant="outline" className="ml-2">
                            {equipmentByType.other?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {equipmentByType.other?.map((item) => (
                            <EquipmentItem
                              key={item.id}
                              name={item.name}
                              type={item.type}
                              status={item.status}
                              driver={item.driver}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Add Equipment</Button>
                  <Button>Connect All</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Equipment Profiles
                  </CardTitle>
                  <CardDescription>
                    Save and load equipment configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Deep Sky Setup</h4>
                        <p className="text-sm text-muted-foreground">
                          Celestron CGX + ED80 + ASI294MC Pro
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Load
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Planetary Setup</h4>
                        <p className="text-sm text-muted-foreground">
                          Celestron CGX + C8 SCT + ASI224MC
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Load
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Current Setup</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="connections" className="space-y-6 mt-6">
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
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                        <div>
                          <h4 className="font-medium">ASCOM Platform</h4>
                          <p className="text-sm text-muted-foreground">
                            Connected to all devices
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                        <div>
                          <h4 className="font-medium">PHD2 Guiding</h4>
                          <p className="text-sm text-muted-foreground">
                            Connected to guide camera and mount
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                        <div>
                          <h4 className="font-medium">Weather Station</h4>
                          <p className="text-sm text-muted-foreground">
                            Disconnected
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Connected to ZWO ASI294MC Pro
                        </div>
                        <div className="text-muted-foreground">
                          Today at 8:45 PM
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Connected to Celestron CGX Mount
                        </div>
                        <div className="text-muted-foreground">
                          Today at 8:43 PM
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Failed to connect to Weather Station
                        </div>
                        <div className="text-muted-foreground">
                          Today at 8:40 PM
                        </div>
                        <div className="text-xs text-red-500">
                          Error: Device not found on COM4
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Connected to ZWO ASI120MM Mini
                        </div>
                        <div className="text-muted-foreground">
                          Today at 8:38 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Full Logs</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

function EquipmentItem({
  name,
  type,
  status,
  driver,
}: {
  name: string;
  type: string;
  status: "Connected" | "Disconnected";
  driver: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <div className="text-sm text-muted-foreground">
            {type} • {driver}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Badge variant={status === "Connected" ? "default" : "secondary"}>
          {status}
        </Badge>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
