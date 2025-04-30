"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sun, Moon, Palette } from "lucide-react"
import { type SettingsSectionProps, type Theme } from "./types"

export function AppearanceSettings({ settings, onSettingChange }: SettingsSectionProps) {
  const handleThemeChange = (value: Theme) => {
    onSettingChange("appearance", "theme", value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={settings.appearance.theme}
              onValueChange={(value) => handleThemeChange(value as Theme)}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-1">
                  <Sun className="h-4 w-4" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-1">
                  <Moon className="h-4 w-4" />
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="red-night" id="red-night" />
                <Label htmlFor="red-night" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Red Night
                </Label>
              </div>
            </RadioGroup>

            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Font Size</Label>
            <span className="text-sm text-muted-foreground">
              {settings.appearance.fontSize === 1
                ? "Small"
                : settings.appearance.fontSize === 2
                ? "Medium"
                : settings.appearance.fontSize === 3
                ? "Large"
                : settings.appearance.fontSize === 4
                ? "X-Large"
                : "XX-Large"}
            </span>
          </div>
          <Slider
            value={[settings.appearance.fontSize]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => onSettingChange("appearance", "fontSize", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Red Night Mode</Label>
            <p className="text-sm text-muted-foreground">Use red color scheme to preserve night vision</p>
          </div>
          <Switch
            checked={settings.appearance.redNightMode}
            onCheckedChange={(checked) => onSettingChange("appearance", "redNightMode", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact View</Label>
            <p className="text-sm text-muted-foreground">
              Use a more compact layout to fit more content on screen
            </p>
          </div>
          <Switch
            checked={settings.appearance.compactView}
            onCheckedChange={(checked) => onSettingChange("appearance", "compactView", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Status Bar</Label>
            <p className="text-sm text-muted-foreground">
              Display status information at the bottom of the window
            </p>
          </div>
          <Switch
            checked={settings.appearance.showStatusBar}
            onCheckedChange={(checked) => onSettingChange("appearance", "showStatusBar", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Animations</Label>
            <p className="text-sm text-muted-foreground">Use animations for transitions and effects</p>
          </div>
          <Switch
            checked={settings.appearance.animationsEnabled}
            onCheckedChange={(checked) => onSettingChange("appearance", "animationsEnabled", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}