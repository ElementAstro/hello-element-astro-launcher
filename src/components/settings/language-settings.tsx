"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Languages } from "lucide-react"
import { type SettingsSectionProps, type DateFormat, type TimeFormat, type TemperatureUnit, type DistanceUnit } from "./types"

export function LanguageSettings({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Settings</CardTitle>
        <CardDescription>Manage language and localization preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Application Language</Label>
          <Select
            value={settings.language.appLanguage}
            onValueChange={(value) => onSettingChange("language", "appLanguage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select
            value={settings.language.dateFormat}
            onValueChange={(value: DateFormat) =>
              onSettingChange("language", "dateFormat", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Time Format</Label>
          <Select
            value={settings.language.timeFormat}
            onValueChange={(value: TimeFormat) =>
              onSettingChange("language", "timeFormat", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
              <SelectItem value="24h">24-hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Temperature Unit</Label>
          <Select
            value={settings.language.temperatureUnit}
            onValueChange={(value: TemperatureUnit) =>
              onSettingChange("language", "temperatureUnit", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select temperature unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="celsius">Celsius (°C)</SelectItem>
              <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Distance Unit</Label>
          <Select
            value={settings.language.distanceUnit}
            onValueChange={(value: DistanceUnit) =>
              onSettingChange("language", "distanceUnit", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select distance unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (km, m)</SelectItem>
              <SelectItem value="imperial">Imperial (mi, ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <Languages className="h-4 w-4 mr-2" />
          Apply Language Settings
        </Button>
      </CardFooter>
    </Card>
  )
}