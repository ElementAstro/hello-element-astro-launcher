"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import type { Agent } from "@/types/agent";
import { TranslationProvider } from "@/components/i18n";
import { commonTranslations } from "@/components/i18n/common-translations";
import {
  AgentHeader,
  AgentSearchAndFilter,
  AgentList,
  DeleteAgentDialog,
  AgentLogsDialog,
} from "@/components/agents";

function AgentsPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [selectedAgentLogs, setSelectedAgentLogs] = useState<Agent["logs"]>([]);

  const {
    agents,
    isAgentLoading,
    fetchAgents,
    runAgent,
    stopAgent,
    deleteAgent,
  } = useAppStore();

  // Fetch agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        await fetchAgents();
      } catch (err) {
        toast("Failed to load agents. Please try again.", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    loadAgents();
  }, [fetchAgents]);

  // Filter agents based on search and tab
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "running" && agent.status === "running") ||
      (selectedTab === "idle" && agent.status === "idle") ||
      (selectedTab === "error" && agent.status === "error");

    return matchesSearch && matchesTab;
  });

  // Handle agent actions
  const handleRunAgent = async (id: string) => {
    try {
      await runAgent(id);
      toast("The agent has been started successfully.", {
        description: "The agent is now running.",
      });
    } catch (err) {
      toast("Failed to start agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleStopAgent = async (id: string) => {
    try {
      await stopAgent(id);
      toast("The agent has been stopped successfully.", {
        description: "The agent has been stopped.",
      });
    } catch (err) {
      toast("Failed to stop agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    try {
      await deleteAgent(agentToDelete);
      setIsDeleteDialogOpen(false);
      setAgentToDelete(null);
      toast("The agent has been deleted successfully.", {
        description: "All agent data has been removed.",
      });
    } catch (err) {
      toast("Failed to delete agent", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const handleViewLogs = (agent: Agent) => {
    setSelectedAgentLogs(agent.logs);
    setIsLogsDialogOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await fetchAgents();
      toast("Agent list refreshed", {
        description: "The agent list has been updated.",
      });
    } catch (err) {
      toast("Failed to refresh agents", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 h-full overflow-hidden"
      >
        <div className="container h-full flex flex-col py-2 px-3 max-h-full">
          <AgentHeader onCreateAgent={() => router.push("/agents/create")} />

          <div className="mb-1.5">
            <AgentSearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-auto pr-1 -mr-1">
            <AgentList
              agents={filteredAgents}
              isLoading={isAgentLoading}
              searchQuery={searchQuery}
              onRunAgent={handleRunAgent}
              onStopAgent={handleStopAgent}
              onEditAgent={(id) => router.push(`/agents/edit/${id}`)}
              onDeleteAgent={(id) => {
                setAgentToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onViewLogs={handleViewLogs}
              onCreateAgent={() => router.push("/agents/create")}
            />
          </div>
        </div>
      </motion.div>

      <DeleteAgentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAgent}
        onCancel={() => setAgentToDelete(null)}
      />

      <AgentLogsDialog
        open={isLogsDialogOpen}
        onOpenChange={setIsLogsDialogOpen}
        logs={selectedAgentLogs}
      />

      <Toaster />
    </AppLayout>
  );
}

export default function AgentsPage() {
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
      <AgentsPageContent />
    </TranslationProvider>
  );
}
