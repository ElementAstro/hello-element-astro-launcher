"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { type SettingsSectionProps } from "./types"

export function StorageSettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Settings</CardTitle>
        <CardDescription>Manage storage locations and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Default Download Location</Label>
          <div className="flex gap-2">
            <Input
              value={settings.storage.downloadLocation}
              onChange={(e) => onSettingChange("storage", "downloadLocation", e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Browse</Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Image Storage Location</Label>
          <div className="flex gap-2">
            <Input
              value={settings.storage.imageLocation}
              onChange={(e) => onSettingChange("storage", "imageLocation", e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Browse</Button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Clear Cache Automatically</Label>
            <p className="text-sm text-muted-foreground">Periodically clear temporary files and cache</p>
          </div>
          <Switch
            checked={settings.storage.clearCacheAutomatically}
            onCheckedChange={(checked) => onSettingChange("storage", "clearCacheAutomatically", checked)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Cache Size Limit</Label>
            <span className="text-sm text-muted-foreground">{settings.storage.cacheSizeLimit} GB</span>
          </div>
          <Slider
            value={[settings.storage.cacheSizeLimit]}
            min={0.5}
            max={5}
            step={0.5}
            onValueChange={(value) => onSettingChange("storage", "cacheSizeLimit", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>500 MB</span>
            <span>5 GB</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Backup Frequency</Label>
          <Select
            value={settings.storage.backupFrequency}
            onValueChange={(value) =>
              onSettingChange("storage", "backupFrequency", value as "daily" | "weekly" | "monthly" | "never")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Clear Cache Now</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}