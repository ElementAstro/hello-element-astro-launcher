"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { type SettingsSectionProps, type LogLevel } from "./types"

export function AdvancedSettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Configure advanced options for power users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Debug Mode</Label>
            <p className="text-sm text-muted-foreground">Enable detailed logging and debugging tools</p>
          </div>
          <Switch
            checked={settings.advanced.debugMode}
            onCheckedChange={(checked) => onSettingChange("advanced", "debugMode", checked)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Log Level</Label>
          <Select
            value={settings.advanced.logLevel}
            onValueChange={(value: LogLevel) =>
              onSettingChange("advanced", "logLevel", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select log level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="verbose">Verbose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Experimental Features</Label>
            <p className="text-sm text-muted-foreground">
              Enable experimental features that are still in development
            </p>
          </div>
          <Switch
            checked={settings.advanced.experimentalFeatures}
            onCheckedChange={(checked) => onSettingChange("advanced", "experimentalFeatures", checked)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>API Endpoints</Label>
          <div className="space-y-2">
            {Object.entries(settings.advanced.apiEndpoints || {}).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <Input value={key} className="w-1/3" readOnly />
                <Input
                  value={value}
                  className="flex-1"
                  onChange={(e) => {
                    const newEndpoints = {
                      ...settings.advanced.apiEndpoints,
                      [key]: e.target.value,
                    }
                    onSettingChange("advanced", "apiEndpoints", newEndpoints)
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const newEndpoints = {
                  ...settings.advanced.apiEndpoints,
                  [`endpoint${Object.keys(settings.advanced.apiEndpoints || {}).length + 1}`]: "",
                }
                onSettingChange("advanced", "apiEndpoints", newEndpoints)
              }}
            >
              Add Endpoint
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Apply Advanced Settings</Button>
      </CardFooter>
    </Card>
  )
}