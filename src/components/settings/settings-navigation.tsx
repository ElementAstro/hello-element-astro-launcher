"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SettingsIcon,
  Moon,
  User,
  Bell,
  HardDrive,
  Shield,
  Globe,
  Code,
} from "lucide-react"

interface SettingsNavigationProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  return (
    <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
      <TabsTrigger
        value="general"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("general")}
        data-state={activeTab === "general" ? "active" : "inactive"}
      >
        <SettingsIcon className="h-4 w-4 mr-2" />
        General
      </TabsTrigger>
      <TabsTrigger
        value="appearance"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("appearance")}
        data-state={activeTab === "appearance" ? "active" : "inactive"}
      >
        <Moon className="h-4 w-4 mr-2" />
        Appearance
      </TabsTrigger>
      <TabsTrigger
        value="account"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("account")}
        data-state={activeTab === "account" ? "active" : "inactive"}
      >
        <User className="h-4 w-4 mr-2" />
        Account
      </TabsTrigger>
      <TabsTrigger
        value="notifications"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("notifications")}
        data-state={activeTab === "notifications" ? "active" : "inactive"}
      >
        <Bell className="h-4 w-4 mr-2" />
        Notifications
      </TabsTrigger>
      <TabsTrigger
        value="storage"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("storage")}
        data-state={activeTab === "storage" ? "active" : "inactive"}
      >
        <HardDrive className="h-4 w-4 mr-2" />
        Storage
      </TabsTrigger>
      <TabsTrigger
        value="privacy"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("privacy")}
        data-state={activeTab === "privacy" ? "active" : "inactive"}
      >
        <Shield className="h-4 w-4 mr-2" />
        Privacy
      </TabsTrigger>
      <TabsTrigger
        value="language"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("language")}
        data-state={activeTab === "language" ? "active" : "inactive"}
      >
        <Globe className="h-4 w-4 mr-2" />
        Language
      </TabsTrigger>
      <TabsTrigger
        value="advanced"
        className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted"
        onClick={() => onTabChange("advanced")}
        data-state={activeTab === "advanced" ? "active" : "inactive"}
      >
        <Code className="h-4 w-4 mr-2" />
        Advanced
      </TabsTrigger>
    </TabsList>
  )
}