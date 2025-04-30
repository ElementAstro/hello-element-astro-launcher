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
  staggerChildren,
  ConnectionStatus,
  LogEntry,
  EquipmentProfile,
} from "@/components/environment";

export default function EnvironmentPage() {
  const [activeTab, setActiveTab] = useState("system");
  const { equipment, systemInfo } = useAppStore();

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
    <AppLayout>
      <motion.div
        className="flex-1 overflow-auto pb-16 md:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-6 space-y-6">
          <PageHeader onRefresh={handleRefreshDevices} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TabsContent value="system" className="space-y-6 mt-6">
                  <SystemInformationCard systemInfo={systemInfo} />
                  <SystemSettingsCard />
                </TabsContent>

                <TabsContent value="equipment" className="space-y-6 mt-6">
                  <EquipmentList equipment={equipment} />
                  <EquipmentProfilesCard profiles={equipmentProfiles} />
                </TabsContent>

                <TabsContent value="connections" className="space-y-6 mt-6">
                  <ConnectionStatusCard connections={connectionStatuses} />
                  <ConnectionLogsCard logs={connectionLogs} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.div>
    </AppLayout>
  );
}
