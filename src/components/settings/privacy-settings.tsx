"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Lock } from "lucide-react"
import { type SettingsSectionProps } from "./types"

export function PrivacySettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Manage your privacy and security preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Usage Statistics</Label>
            <p className="text-sm text-muted-foreground">
              Share anonymous usage data to help improve the software
            </p>
          </div>
          <Switch
            checked={settings.privacy.shareUsageData}
            onCheckedChange={(checked) => onSettingChange("privacy", "shareUsageData", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Error Reporting</Label>
            <p className="text-sm text-muted-foreground">
              Automatically send error reports to help fix issues
            </p>
          </div>
          <Switch
            checked={settings.privacy.errorReporting}
            onCheckedChange={(checked) => onSettingChange("privacy", "errorReporting", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Remember Login</Label>
            <p className="text-sm text-muted-foreground">Stay logged in between sessions</p>
          </div>
          <Switch
            checked={settings.privacy.rememberLogin}
            onCheckedChange={(checked) => onSettingChange("privacy", "rememberLogin", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Encrypt Local Data</Label>
            <p className="text-sm text-muted-foreground">Encrypt sensitive data stored on your device</p>
          </div>
          <Switch
            checked={settings.privacy.encryptLocalData}
            onCheckedChange={(checked) => onSettingChange("privacy", "encryptLocalData", checked)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Data Retention Period</Label>
            <span className="text-sm text-muted-foreground">
              {settings.privacy.dataRetentionPeriod} days
            </span>
          </div>
          <Slider
            value={[settings.privacy.dataRetentionPeriod]}
            min={30}
            max={365}
            step={30}
            onValueChange={(value) => onSettingChange("privacy", "dataRetentionPeriod", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30 days</span>
            <span>1 year</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <Lock className="h-4 w-4 mr-2" />
          Privacy Policy
        </Button>
      </CardFooter>
    </Card>
  )
}