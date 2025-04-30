"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { type SettingsSectionProps } from "./types"

export function NotificationSettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Software Updates</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about software updates</p>
          </div>
          <Switch
            checked={settings.notifications.softwareUpdates}
            onCheckedChange={(checked) => onSettingChange("notifications", "softwareUpdates", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Equipment Connection Events</Label>
            <p className="text-sm text-muted-foreground">Notify when equipment connects or disconnects</p>
          </div>
          <Switch
            checked={settings.notifications.equipmentEvents}
            onCheckedChange={(checked) => onSettingChange("notifications", "equipmentEvents", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Download Completion</Label>
            <p className="text-sm text-muted-foreground">Notify when downloads complete or fail</p>
          </div>
          <Switch
            checked={settings.notifications.downloadCompletion}
            onCheckedChange={(checked) => onSettingChange("notifications", "downloadCompletion", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>System Alerts</Label>
            <p className="text-sm text-muted-foreground">Important system notifications and warnings</p>
          </div>
          <Switch
            checked={settings.notifications.systemAlerts}
            onCheckedChange={(checked) => onSettingChange("notifications", "systemAlerts", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive reminders for upcoming observation sessions
            </p>
          </div>
          <Switch
            checked={settings.notifications.sessionReminders}
            onCheckedChange={(checked) => onSettingChange("notifications", "sessionReminders", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Sound Effects</Label>
            <p className="text-sm text-muted-foreground">Play sounds for notifications and events</p>
          </div>
          <Switch
            checked={settings.notifications.soundEffects}
            onCheckedChange={(checked) => onSettingChange("notifications", "soundEffects", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}