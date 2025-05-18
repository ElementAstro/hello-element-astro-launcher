"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import {
  PageHeader,
  SystemInformationCard,
  SystemSettingsCard,
  EquipmentList,
  EquipmentProfilesCard,
  ConnectionStatusCard,
  ConnectionLogsCard,
  enhancedStaggerChildren,
  ConnectionStatus,
  LogEntry,
  EquipmentProfile,
} from "@/components/environment";
import { TranslationProvider } from "@/components/i18n";
import { commonTranslations } from "@/components/i18n/common-translations";
import { translationKeys } from "@/components/environment/translations";

// 添加粒子效果组件
const ParticleBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/5"
        initial={{ 
          x: `${Math.random() * 100}%`, 
          y: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.3
        }}
        animate={{ 
          y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.3]
        }}
        transition={{ 
          duration: Math.random() * 20 + 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ 
          scale: Math.random() * 0.5 + 0.5
        }}
      />
    ))}
  </div>
);

function EnvironmentPageContent() {
  const [activeTab, setActiveTab] = useState("system");
  const { equipment } = useAppStore();

  // Extended system info with default values
  const extendedSystemInfo = {
    os: "Windows",
    processor: "Intel Core i7",
    memory: "16 GB",
    graphics: "NVIDIA GeForce RTX 3060",
    ascomVersion: "6.5",
    indigoInstalled: true,
    indiInstalled: false,
    phd2Version: "2.6.11",
    storage: {
      system: {
        free: "256 GB",
        total: "1024 GB",
        percentUsed: 75
      },
      data: {
        free: "1.5 TB",
        total: "4 TB",
        percentUsed: 62.5
      }
    },
    // Additional required properties for ExtendedSystemInfo
    cpuUsage: 45,
    cpuModel: "Intel Core i7-12700K",
    memoryUsage: 60,
    memoryUsed: 8,
    memoryTotal: 16,
    diskUsage: 75,
    diskFree: 256,
    diskTotal: 1024,
    osName: "Windows",
    osVersion: "11",
    hostname: "DESKTOP-USER",
    uptime: "5h 30m"
  };

  const connectionStatuses: ConnectionStatus[] = [
    {
      name: "ASCOM Platform",
      status: "connected",
      description: "Connected to all devices",
    },
    {
      name: "PHD2 Guiding",
      status: "connected",
      description: "Connected to guide camera and mount",
    },
    {
      name: "Weather Station",
      status: "disconnected",
      description: "Disconnected",
    },
  ];

  const connectionLogs: LogEntry[] = [
    {
      type: "success",
      title: "Connected to ZWO ASI294MC Pro",
      timestamp: "Today at 8:45 PM",
    },
    {
      type: "success",
      title: "Connected to Celestron CGX Mount",
      timestamp: "Today at 8:43 PM",
    },
    {
      type: "error",
      title: "Failed to connect to Weather Station",
      timestamp: "Today at 8:40 PM",
      errorMessage: "Error: Device not found on COM4",
    },
    {
      type: "success",
      title: "Connected to ZWO ASI120MM Mini",
      timestamp: "Today at 8:38 PM",
    },
  ];

  const equipmentProfiles: EquipmentProfile[] = [
    {
      name: "Deep Sky Setup",
      description: "Celestron CGX + ED80 + ASI294MC Pro",
    },
    {
      name: "Planetary Setup",
      description: "Celestron CGX + C8 SCT + ASI224MC",
    },
  ];

  const handleRefreshDevices = () => {
    // Implement refresh logic here
    console.log("Refreshing devices...");
  };

  return (
    <TranslationProvider
      initialDictionary={translationKeys}
      lang="en">
      <AppLayout>
        <motion.div
          className="flex-1 overflow-auto pb-16 md:pb-0 relative bg-gradient-to-b from-background to-background/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 添加粒子背景 */}
          <ParticleBackground />
          
          {/* 添加页面顶部装饰 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30" />
          
          <div className="container py-8 space-y-8">
            <PageHeader onRefresh={handleRefreshDevices} />

            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="relative z-10 mt-4"
            >
              <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-card/30">
                <TabsTrigger value="system">系统</TabsTrigger>
                <TabsTrigger value="equipment">设备</TabsTrigger>
                <TabsTrigger value="connections">连接</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={enhancedStaggerChildren}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-8"
                >
                  <TabsContent value="system" className="space-y-8">
                    <SystemInformationCard systemInfo={extendedSystemInfo} />
                    <SystemSettingsCard />
                  </TabsContent>

                  <TabsContent value="equipment" className="space-y-8">
                    <EquipmentList equipment={equipment} />
                    <EquipmentProfilesCard profiles={equipmentProfiles} />
                  </TabsContent>

                  <TabsContent value="connections" className="space-y-8">
                    <ConnectionStatusCard connectionStatus={connectionStatuses[0]} />
                    <ConnectionLogsCard logs={connectionLogs.map(log => ({
                      level: log.type,
                      message: log.title,
                      timestamp: log.timestamp
                    }))} />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      </AppLayout>
    </TranslationProvider>
  );
}

export default function EnvironmentPage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage = typeof navigator !== 'undefined' ? 
    (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US') : 'en-US';
  
  // 从用户区域确定地区
  const userRegion = userLanguage === 'zh-CN' ? 'CN' : 'US';
  
  return (
    <TranslationProvider 
      initialDictionary={commonTranslations[userLanguage] || commonTranslations['en-US']}
      lang={userLanguage.split('-')[0]}
      initialRegion={userRegion}
    >
      <EnvironmentPageContent />
    </TranslationProvider>
  );
}
