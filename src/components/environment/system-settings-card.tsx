import { Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { fadeIn } from "./animation-constants";

export function SystemSettingsCard() {
  return (
    <motion.div variants={fadeIn}>
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
                  Force dark mode for all compatible astronomy applications
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
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
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
    </motion.div>
  );
}