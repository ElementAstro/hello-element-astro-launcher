"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AppLayout } from "@/components/app-layout"
import { useAppStore } from "@/store/store"
import { toast, Toaster } from "sonner"
import type { Theme, Settings } from "@/components/settings"
import { assertSettings } from "@/components/settings"
import {
  SettingsHeader,
  SettingsNavigation,
  GeneralSettings,
  AppearanceSettings,
  AccountSettings,
  NotificationSettings,
  StorageSettings,
  PrivacySettings,
  LanguageSettings,
  AdvancedSettings,
} from "@/components/settings"

export default function SettingsPage() {
  const store = useAppStore()
  const settings = assertSettings(store.settings)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const validatedSettings = assertSettings(settings)
      store.updateSettings(validatedSettings)
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

  // Handle setting changes
  const handleSettingChange = <K extends keyof Settings, S extends keyof Settings[K]>(
    category: K,
    setting: S,
    value: Settings[K][S],
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value,
      },
    }
    const validatedSettings = assertSettings(newSettings)
    store.updateSettings(validatedSettings)
  }

  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    handleSettingChange("appearance", "theme", theme)
    store.setTheme(theme)
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <SettingsHeader
            isSaving={isSaving}
            onSave={handleSaveSettings}
            onReset={store.resetSettings}
          />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              </Tabs>
            </div>

            <div className="flex-1">
              <TabsContent value="general" className="mt-0 space-y-6">
                <GeneralSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-6">
                <AppearanceSettings 
                  settings={settings} 
                  onSettingChange={(category, setting, value) => {
                    if (category === "appearance" && setting === "theme") {
                      handleThemeChange(value as Theme)
                    } else {
                      handleSettingChange(category, setting, value)
                    }
                  }} 
                />
              </TabsContent>

              <TabsContent value="account" className="mt-0 space-y-6">
                <AccountSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 space-y-6">
                <NotificationSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="storage" className="mt-0 space-y-6">
                <StorageSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="privacy" className="mt-0 space-y-6">
                <PrivacySettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="language" className="mt-0 space-y-6">
                <LanguageSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>

              <TabsContent value="advanced" className="mt-0 space-y-6">
                <AdvancedSettings settings={settings} onSettingChange={handleSettingChange} />
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </AppLayout>
  )
}
