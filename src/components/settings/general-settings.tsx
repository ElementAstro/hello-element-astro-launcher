"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  BookUp, // Corrected import: BootUp -> BookUp
  RefreshCw, 
  HelpCircle, 
  AlertTriangle,
  Camera,
  Stars,
  Crosshair,
  ArrowUpCircle,
  Check,
  Rocket
} from "lucide-react"
import { type SettingsSectionProps, type UpdateFrequency, type Settings as SettingsType } from "./types" // Added SettingsType import
import { AnimatedCard, LoadingIndicator, ErrorState } from "./ui-components"
import { slideUp, staggeredContainer, switchVariants, TRANSITION_DURATION } from "./animation-constants" // Removed unused fadeIn
import { toast } from "sonner" // Use sonner for toasts

export function GeneralSettings({ settings, onSettingChange }: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<"idle" | "checking" | "available" | "error" | "up-to-date">("idle")
  // Removed unused useToast import

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  // Handle general setting change
  // Removed unnecessary generic constraint
  const handleSettingChange = <T extends boolean | UpdateFrequency>(
    setting: keyof SettingsType["general"],
    value: T
  ) => {
    try {
      // Removed 'as any' assertion
      onSettingChange("general", setting, value)
      
      // Show feedback toast for important settings
      if (setting === 'startOnBoot') {
        // Use sonner toast directly
        toast(value ? "开机自启已启用" : "开机自启已禁用", {
          description: value 
            ? "应用程序将在系统启动时自动运行。" 
            : "应用程序将不会在系统启动时自动运行。",
        })
      } else if (setting === 'confirmBeforeClosing') {
        // Use sonner toast directly
        toast(value ? "已启用关闭前确认" : "已禁用关闭前确认", {
          description: value 
            ? "关闭应用程序前将显示确认对话框。" 
            : "关闭应用程序时不再显示确认对话框。",
        })
      }
    } catch {
      setError(`更改${setting}设置时出错`)
      // Use sonner toast.error
      toast.error("设置更新失败", {
        description: `无法更改${setting}设置，请重试。`,
      })
    }
  }

  // Handle default app changes
  const handleDefaultAppChange = (
    appType: keyof SettingsType["general"]["defaultApps"], // Use specific key type
    value: string
  ) => {
    try {
      // Ensure settings and settings.general are defined before accessing defaultApps
      if (!settings?.general) return; 

      onSettingChange("general", "defaultApps", {
        ...settings.general.defaultApps,
        [appType]: value,
      })
      
      const appTypeNames = {
        imaging: "成像软件",
        planetarium: "天象仪软件",
        guiding: "导星软件"
      }
      
      // Use sonner toast directly
      toast(`默认${appTypeNames[appType]}已更改`, {
        description: `已将默认${appTypeNames[appType]}设置为 ${value}。`,
      })
    } catch {
      setError(`更改默认应用设置时出错`)
      // Use sonner toast.error
      toast.error("设置更新失败", {
        description: `无法更改默认应用设置，请重试。`,
      })
    }
  }

  // Handle manual update check
  const checkForUpdates = async () => {
    setUpdateStatus("checking")
    
    try {
      // Simulate checking for updates
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly determine if an update is available (for demonstration)
      const hasUpdate = Math.random() > 0.5
      
      if (hasUpdate) {
        setUpdateStatus("available")
        // Use sonner toast directly
        toast("发现新更新", {
          description: "版本 2.5.0 可用。点击更新按钮开始下载。",
        })
      } else {
        setUpdateStatus("up-to-date")
        // Use sonner toast directly
        toast("已是最新版本", {
          description: "您正在运行最新版本的应用程序。",
        })
        
        // Reset status after showing "up-to-date" for a while
        setTimeout(() => {
          setUpdateStatus("idle")
        }, 3000)
      }
    } catch {
      setUpdateStatus("error")
      setError("检查更新时出错")
      // Use sonner toast.error
      toast.error("更新检查失败", {
        description: "无法连接到更新服务器，请检查您的网络连接。",
      })
    }
  }

  // Save all settings
  const saveAllSettings = async () => {
    setIsSaving(true)
    
    try {
      // Simulate API call to save all settings
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setShowSuccess(true)
      
      // Use sonner toast directly
      toast("所有设置已保存", {
        description: "您的常规设置已成功更新和应用。",
        action: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Check className="h-5 w-5 text-green-500" />
          </motion.div>
        ),
      })
      
      // Reset success state after a delay
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch {
      setError("保存设置时出错")
      // Use sonner toast.error
      toast.error("保存失败", {
        description: "无法保存常规设置，请重试。",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingIndicator message="加载常规设置..." />
  }

  // Ensure settings is checked before accessing its properties
  if (error && !settings) {
    return <ErrorState message={error} onRetry={() => setError(null)} />
  }

  // Ensure settings is available before rendering content
  if (!settings) {
     return <LoadingIndicator message="加载常规设置..." />; // Or some other placeholder
  }

  // Get human-readable name for update frequency
  const getUpdateFrequencyName = (freq: UpdateFrequency): string => {
    const names = {
      startup: "每次启动",
      daily: "每天",
      weekly: "每周",
      monthly: "每月",
      never: "从不",
    }
    return names[freq] || freq
  }

  return (
    <motion.div 
      variants={staggeredContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <AnimatedCard>
        <Card>
          <CardHeader>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-start"
            >
              <div>
                <CardTitle>常规设置</CardTitle>
                <CardDescription>管理常规应用程序设置和首选项</CardDescription>
              </div>
              <Settings className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={staggeredContainer}
              className="space-y-4"
            >
              <motion.div variants={slideUp} className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <BookUp className="h-5 w-5" /> {/* Corrected icon */}
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="start-on-boot">系统启动时自动启动</Label>
                    <p className="text-sm text-muted-foreground">
                      计算机启动时自动启动应用程序
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={settings.general.startOnBoot ? "checked" : "unchecked"}
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="start-on-boot"
                    checked={settings.general.startOnBoot}
                    onCheckedChange={(checked) => handleSettingChange("startOnBoot", checked)}
                    aria-label="启用或禁用系统启动时自动启动应用程序"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="check-for-updates">自动检查更新</Label>
                    <p className="text-sm text-muted-foreground">定期检查软件更新</p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={settings.general.checkForUpdates ? "checked" : "unchecked"}
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="check-for-updates"
                    checked={settings.general.checkForUpdates}
                    onCheckedChange={(checked) => handleSettingChange("checkForUpdates", checked)}
                    aria-label="启用或禁用自动检查更新"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex justify-between items-center">
                  {/* Label htmlFor should point to the trigger's id if needed, but Select doesn't take id */}
                  <Label>更新频率</Label> 
                  <span className="text-sm text-muted-foreground">
                    {getUpdateFrequencyName(settings.general.updateFrequency)}
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                  className={!settings.general.checkForUpdates ? "opacity-50" : ""}
                >
                  <Select
                    // Removed id="update-frequency"
                    value={settings.general.updateFrequency}
                    onValueChange={(value: UpdateFrequency) => handleSettingChange("updateFrequency", value)}
                    disabled={!settings.general.checkForUpdates}
                  >
                    {/* Assign id to Trigger if needed for Label */}
                    <SelectTrigger id="update-frequency-trigger" aria-label="选择更新频率"> 
                      <SelectValue placeholder="选择频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">每次启动</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                      <SelectItem value="never">从不</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <div className="mt-2 flex justify-end">
                  <motion.div
                    whileHover={{ scale: updateStatus === "checking" ? 1 : 1.02 }}
                    whileTap={{ scale: updateStatus === "checking" ? 1 : 0.98 }}
                    transition={{ duration: TRANSITION_DURATION.fast }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkForUpdates}
                      disabled={updateStatus === "checking"}
                      className="relative"
                    >
                      {updateStatus === "checking" ? (
                        <motion.span
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        </motion.span>
                      ) : updateStatus === "available" ? (
                        <ArrowUpCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : updateStatus === "up-to-date" ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      <span className={updateStatus === "checking" ? "opacity-0" : "opacity-100"}>
                        {updateStatus === "available" 
                          ? "立即更新" 
                          : updateStatus === "up-to-date" 
                            ? "已是最新" 
                            : updateStatus === "error" 
                              ? "重试" 
                              : "立即检查更新"}
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="show-tooltips">显示工具提示</Label>
                    <p className="text-sm text-muted-foreground">
                      悬停在元素上时显示有用的工具提示
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={settings.general.showTooltips ? "checked" : "unchecked"}
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="show-tooltips"
                    checked={settings.general.showTooltips}
                    onCheckedChange={(checked) => handleSettingChange("showTooltips", checked)}
                    aria-label="启用或禁用显示工具提示"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp} className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="confirm-before-closing">关闭前确认</Label>
                    <p className="text-sm text-muted-foreground">
                      关闭应用程序前显示确认对话框
                    </p>
                  </div>
                </div>
                <motion.div
                  variants={switchVariants}
                  initial="unchecked"
                  animate={settings.general.confirmBeforeClosing ? "checked" : "unchecked"}
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="confirm-before-closing"
                    checked={settings.general.confirmBeforeClosing}
                    onCheckedChange={(checked) => handleSettingChange("confirmBeforeClosing", checked)}
                    aria-label="启用或禁用关闭前确认"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CardTitle>默认应用程序</CardTitle>
              <CardDescription>为不同的天文任务设置默认应用程序</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={staggeredContainer}
              className="space-y-4"
            >
              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    {/* Label htmlFor should point to the trigger's id if needed */}
                    <Label>成像软件</Label>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  <Select
                    // Removed id="imaging-software"
                    value={settings.general.defaultApps.imaging}
                    onValueChange={(value) => handleDefaultAppChange("imaging", value)}
                  >
                    {/* Assign id to Trigger if needed for Label */}
                    <SelectTrigger id="imaging-software-trigger" aria-label="选择默认成像软件">
                      <SelectValue placeholder="选择应用程序" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nina">N.I.N.A</SelectItem>
                      <SelectItem value="sgp">Sequence Generator Pro</SelectItem>
                      <SelectItem value="apt">APT</SelectItem>
                      <SelectItem value="maxim">MaximDL</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars className="h-4 w-4 text-muted-foreground" />
                    {/* Label htmlFor should point to the trigger's id if needed */}
                    <Label>天象仪软件</Label>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  <Select
                    // Removed id="planetarium-software"
                    value={settings.general.defaultApps.planetarium}
                    onValueChange={(value) => handleDefaultAppChange("planetarium", value)}
                  >
                    {/* Assign id to Trigger if needed for Label */}
                    <SelectTrigger id="planetarium-software-trigger" aria-label="选择默认天象仪软件">
                      <SelectValue placeholder="选择应用程序" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stellarium">Stellarium</SelectItem>
                      <SelectItem value="sky">TheSky</SelectItem>
                      <SelectItem value="cartes">Cartes du Ciel</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>

              <motion.div variants={slideUp} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-muted-foreground" />
                    {/* Label htmlFor should point to the trigger's id if needed */}
                    <Label>导星软件</Label>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  <Select
                    // Removed id="guiding-software"
                    value={settings.general.defaultApps.guiding}
                    onValueChange={(value) => handleDefaultAppChange("guiding", value)}
                  >
                    {/* Assign id to Trigger if needed for Label */}
                    <SelectTrigger id="guiding-software-trigger" aria-label="选择默认导星软件">
                      <SelectValue placeholder="选择应用程序" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phd2">PHD2</SelectItem>
                      <SelectItem value="metaguide">MetaGuide</SelectItem>
                      <SelectItem value="maxim">MaximDL</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={slideUp}
                className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/20 p-3"
              >
                <div className="flex space-x-2">
                  <Rocket className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p>设置默认应用程序将允许从启动器直接打开特定软件。确保已在系统上安装了这些应用程序。</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
          
          <CardFooter>
            <motion.div
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: isSaving ? 1 : 0.98 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button 
                onClick={saveAllSettings}
                disabled={isSaving}
                className="relative"
              >
                {isSaving ? (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </motion.span>
                ) : showSuccess ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                <span className={isSaving ? "opacity-0" : "opacity-100"}>
                  {showSuccess ? "已保存" : "保存所有设置"}
                </span>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </AnimatedCard>
    </motion.div>
  )
}