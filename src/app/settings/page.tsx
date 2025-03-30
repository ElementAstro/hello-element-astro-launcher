"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Globe,
  HardDrive,
  Languages,
  Lock,
  Moon,
  Save,
  SettingsIcon,
  Shield,
  Sun,
  User,
  Palette,
  Code,
  RefreshCw,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppLayout } from "@/components/app-layout"
import { useAppStore } from "@/store/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast, Toaster } from "sonner"

// Add type definitions
type UpdateFrequency = "startup" | "daily" | "weekly" | "monthly" | "never"
type Theme = "light" | "dark" | "system" | "red-night"
type DateFormat = "mdy" | "dmy" | "ymd"
type TimeFormat = "12h" | "24h"
type TemperatureUnit = "celsius" | "fahrenheit"
type DistanceUnit = "metric" | "imperial"
type LogLevel = "error" | "warning" | "info" | "debug" | "verbose"

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, setTheme } = useAppStore()
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  // Handle settings updates
  const handleSettingChange = <K extends keyof typeof settings, S extends keyof (typeof settings)[K]>(
    category: K,
    setting: S,
    value: (typeof settings)[K][S],
  ) => {
    updateSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value,
      },
    })
  }

  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    handleSettingChange("appearance", "theme", theme)
    setTheme(theme)
  }

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Settings saved successfully", {
        description: "Your settings have been saved.",
      })
    } catch (error) {
      toast.error("Failed to save settings", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your application preferences and account settings</p>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset all settings to their default values? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        resetSettings()
                        toast({
                          title: "Settings Reset",
                          description: "All settings have been reset to their default values.",
                          variant: "default",
                        })
                      }}
                    >
                      Reset Settings
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={handleSaveSettings} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                  <TabsTrigger value="general" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <Moon className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="account" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="storage" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Storage
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger value="language" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <Globe className="h-4 w-4 mr-2" />
                    Language
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                    <Code className="h-4 w-4 mr-2" />
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1">
              <TabsContent value="general" className="mt-0 space-y-6">
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
                        onCheckedChange={(checked) => handleSettingChange("general", "startOnBoot", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("general", "checkForUpdates", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Update Frequency</Label>
                      <Select
                        value={settings.general.updateFrequency}
                        onValueChange={(value: UpdateFrequency) =>
                          handleSettingChange("general", "updateFrequency", value)
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
                        onCheckedChange={(checked) => handleSettingChange("general", "showTooltips", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("general", "confirmBeforeClosing", checked)}
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
                          handleSettingChange("general", "defaultApps", {
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
                          handleSettingChange("general", "defaultApps", {
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
                          handleSettingChange("general", "defaultApps", {
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
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-6">
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
                        onValueChange={(value) => handleSettingChange("appearance", "fontSize", value[0])}
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
                        onCheckedChange={(checked) => handleSettingChange("appearance", "redNightMode", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("appearance", "compactView", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("appearance", "showStatusBar", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("appearance", "animationsEnabled", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={settings.account.name}
                        onChange={(e) => handleSettingChange("account", "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={settings.account.email}
                        onChange={(e) => handleSettingChange("account", "email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={settings.account.organization || ""}
                        onChange={(e) => handleSettingChange("account", "organization", e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Account</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 space-y-6">
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
                        onCheckedChange={(checked) => handleSettingChange("notifications", "softwareUpdates", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("notifications", "equipmentEvents", checked)}
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
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "downloadCompletion", checked)
                        }
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
                        onCheckedChange={(checked) => handleSettingChange("notifications", "systemAlerts", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("notifications", "sessionReminders", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("notifications", "soundEffects", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="storage" className="mt-0 space-y-6">
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
                          onChange={(e) => handleSettingChange("storage", "downloadLocation", e.target.value)}
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
                          onChange={(e) => handleSettingChange("storage", "imageLocation", e.target.value)}
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
                        onCheckedChange={(checked) =>
                          handleSettingChange("storage", "clearCacheAutomatically", checked)
                        }
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
                        onValueChange={(value) => handleSettingChange("storage", "cacheSizeLimit", value[0])}
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
                        onValueChange={(value: UpdateFrequency) =>
                          handleSettingChange("storage", "backupFrequency", value)
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
              </TabsContent>

              <TabsContent value="privacy" className="mt-0 space-y-6">
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
                        onCheckedChange={(checked) => handleSettingChange("privacy", "shareUsageData", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("privacy", "errorReporting", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("privacy", "rememberLogin", checked)}
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
                        onCheckedChange={(checked) => handleSettingChange("privacy", "encryptLocalData", checked)}
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
                        onValueChange={(value) => handleSettingChange("privacy", "dataRetentionPeriod", value[0])}
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
              </TabsContent>

              <TabsContent value="language" className="mt-0 space-y-6">
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
                        onValueChange={(value) => handleSettingChange("language", "appLanguage", value)}
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
                          handleSettingChange("language", "dateFormat", value)
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
                          handleSettingChange("language", "timeFormat", value)
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
                          handleSettingChange("language", "temperatureUnit", value)
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
                          handleSettingChange("language", "distanceUnit", value)
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
              </TabsContent>

              <TabsContent value="advanced" className="mt-0 space-y-6">
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
                        onCheckedChange={(checked) => handleSettingChange("advanced", "debugMode", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Log Level</Label>
                      <Select
                        value={settings.advanced.logLevel}
                        onValueChange={(value: LogLevel) =>
                          handleSettingChange("advanced", "logLevel", value)
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
                        onCheckedChange={(checked) => handleSettingChange("advanced", "experimentalFeatures", checked)}
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
                                handleSettingChange("advanced", "apiEndpoints", newEndpoints)
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
                            handleSettingChange("advanced", "apiEndpoints", newEndpoints)
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
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </AppLayout>
  )
}

