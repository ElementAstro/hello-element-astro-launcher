"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { type SettingsSectionProps, type UpdateFrequency } from "./types"

export function GeneralSettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general application settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Start on System Boot</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start the application when your computer boots
              </p>
            </div>
            <Switch
              checked={settings.general.startOnBoot}
              onCheckedChange={(checked) => onSettingChange("general", "startOnBoot", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Check for Updates Automatically</Label>
              <p className="text-sm text-muted-foreground">Periodically check for software updates</p>
            </div>
            <Switch
              checked={settings.general.checkForUpdates}
              onCheckedChange={(checked) => onSettingChange("general", "checkForUpdates", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Update Frequency</Label>
            <Select
              value={settings.general.updateFrequency}
              onValueChange={(value: UpdateFrequency) =>
                onSettingChange("general", "updateFrequency", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Every Startup</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Tooltips</Label>
              <p className="text-sm text-muted-foreground">
                Display helpful tooltips when hovering over elements
              </p>
            </div>
            <Switch
              checked={settings.general.showTooltips}
              onCheckedChange={(checked) => onSettingChange("general", "showTooltips", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Confirm Before Closing</Label>
              <p className="text-sm text-muted-foreground">
                Show confirmation dialog before closing the application
              </p>
            </div>
            <Switch
              checked={settings.general.confirmBeforeClosing}
              onCheckedChange={(checked) => onSettingChange("general", "confirmBeforeClosing", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Applications</CardTitle>
          <CardDescription>Set default applications for different astronomy tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Imaging Software</Label>
            <Select
              value={settings.general.defaultApps.imaging}
              onValueChange={(value) =>
                onSettingChange("general", "defaultApps", {
                  ...settings.general.defaultApps,
                  imaging: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nina">N.I.N.A</SelectItem>
                <SelectItem value="sgp">Sequence Generator Pro</SelectItem>
                <SelectItem value="apt">APT</SelectItem>
                <SelectItem value="maxim">MaximDL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Planetarium Software</Label>
            <Select
              value={settings.general.defaultApps.planetarium}
              onValueChange={(value) =>
                onSettingChange("general", "defaultApps", {
                  ...settings.general.defaultApps,
                  planetarium: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stellarium">Stellarium</SelectItem>
                <SelectItem value="sky">TheSky</SelectItem>
                <SelectItem value="cartes">Cartes du Ciel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Guiding Software</Label>
            <Select
              value={settings.general.defaultApps.guiding}
              onValueChange={(value) =>
                onSettingChange("general", "defaultApps", {
                  ...settings.general.defaultApps,
                  guiding: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phd2">PHD2</SelectItem>
                <SelectItem value="metaguide">MetaGuide</SelectItem>
                <SelectItem value="maxim">MaximDL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </>
  )
}