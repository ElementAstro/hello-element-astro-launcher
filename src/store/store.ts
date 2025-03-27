import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Software,
  DownloadItem,
  EquipmentItem,
  SystemInfo,
  UserSettings,
  AppTheme,
} from "@/types";
import { MOCK_SOFTWARE } from "@/data/software";
import { MOCK_DOWNLOADS } from "@/data/downloads";
import { MOCK_EQUIPMENT } from "@/data/equipment";
import { INITIAL_SYSTEM_INFO } from "@/data/system";
import { DEFAULT_USER_SETTINGS } from "@/data/settings";

// Import the new types
import type {
  Agent,
  AgentCreateParams,
  AgentUpdateParams,
  AgentRunResult,
} from "@/types/agent";
import type {
  Tool,
  ToolResult,
  ToolCategory,
  ToolCreateParams,
  ToolUpdateParams,
} from "@/types/tool";

// Add to the AppState interface
interface AppState {
  // Software and launcher state
  software: Software[];
  currentTab: string;
  searchVisible: boolean;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  viewMode: "grid" | "list";
  sortBy: "name" | "downloads" | "lastUpdated";
  sortDirection: "asc" | "desc";
  autoScroll: boolean;
  scrollSpeed: number;
  filterFeatured: boolean;
  filterInstalled: boolean;
  selectedSoftware: Software | null;
  isInstalling: boolean;
  installProgress: number;

  // Download state
  downloads: DownloadItem[];
  downloadHistory: DownloadItem[];

  // Environment state
  equipment: EquipmentItem[];
  systemInfo: SystemInfo;

  // User preferences
  settings: UserSettings;
  theme: AppTheme;

  // UI state
  isSystemModalOpen: boolean;

  // Agent state
  agents: Agent[];
  selectedAgent: Agent | null;
  agentResults: AgentRunResult[];
  isAgentLoading: boolean;

  // Tool state
  tools: Tool[];
  toolCategories: ToolCategory[];
  selectedTool: Tool | null;
  toolResults: ToolResult[];
  isToolLoading: boolean;

  // Actions
  setSoftware: (software: Software[]) => void;
  addSoftware: (software: Software) => void;
  updateSoftware: (id: number, updates: Partial<Software>) => void;
  removeSoftware: (id: number) => void;
  importSoftware: (
    newSoftware: Software[]
  ) => Promise<{ success: boolean; message: string; conflicts?: number }>;

  setCurrentTab: (tab: string) => void;
  setSearchVisible: (visible: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "downloads" | "lastUpdated") => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setAutoScroll: (auto: boolean) => void;
  setScrollSpeed: (speed: number) => void;
  setFilterFeatured: (featured: boolean) => void;
  setFilterInstalled: (installed: boolean) => void;
  setSelectedSoftware: (software: Software | null) => void;

  startInstallation: (softwareId: number) => void;
  updateInstallProgress: (progress: number) => void;
  completeInstallation: () => void;

  addDownload: (download: DownloadItem) => void;
  updateDownload: (id: number, updates: Partial<DownloadItem>) => void;
  removeDownload: (id: number) => void;
  moveToHistory: (id: number) => void;
  clearDownloadHistory: () => void;

  addEquipment: (equipment: EquipmentItem) => Promise<EquipmentItem>;
  updateEquipment: (
    id: number,
    updates: Partial<EquipmentItem>
  ) => Promise<EquipmentItem>;
  removeEquipment: (id: number) => Promise<boolean>;
  refreshEquipment: () => Promise<EquipmentItem[]>;

  updateSystemInfo: (updates: Partial<SystemInfo>) => void;
  refreshSystemInfo: () => Promise<SystemInfo>;

  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;

  setTheme: (theme: AppTheme) => void;

  setSystemModalOpen: (isOpen: boolean) => void;
  reloadApplication: () => Promise<boolean>;
  shutdownApplication: () => Promise<boolean>;

  // Agent actions
  fetchAgents: () => Promise<Agent[]>;
  getAgent: (id: string) => Promise<Agent | null>;
  createAgent: (agent: AgentCreateParams) => Promise<Agent>;
  updateAgent: (id: string, updates: AgentUpdateParams) => Promise<Agent>;
  deleteAgent: (id: string) => Promise<boolean>;
  runAgent: (id: string) => Promise<AgentRunResult>;
  stopAgent: (id: string) => Promise<boolean>;
  getAgentResults: (id: string) => Promise<AgentRunResult[]>;

  // Tool actions
  fetchTools: () => Promise<Tool[]>;
  fetchToolCategories: () => Promise<ToolCategory[]>;
  getTool: (id: string) => Promise<Tool | null>;
  createTool: (tool: ToolCreateParams) => Promise<Tool>;
  updateTool: (id: string, updates: ToolUpdateParams) => Promise<Tool>;
  deleteTool: (id: string) => Promise<boolean>;
  runTool: (id: string, inputs: Record<string, unknown>) => Promise<ToolResult>;
  getToolResults: (id: string) => Promise<ToolResult[]>;
  toggleToolFavorite: (id: string) => Promise<Tool>;
}

// Add to the store implementation
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      software: MOCK_SOFTWARE,
      currentTab: "all",
      searchVisible: true,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      viewMode: "list",
      sortBy: "name",
      sortDirection: "asc",
      autoScroll: false,
      scrollSpeed: 5,
      filterFeatured: false,
      filterInstalled: false,
      selectedSoftware: null,
      isInstalling: false,
      installProgress: 0,

      downloads: MOCK_DOWNLOADS.filter((d) =>
        ["downloading", "paused"].includes(d.status)
      ) as DownloadItem[],
      downloadHistory: MOCK_DOWNLOADS.filter((d) =>
        ["completed", "error"].includes(d.status)
      ) as DownloadItem[],

      equipment: MOCK_EQUIPMENT as unknown as EquipmentItem[],
      systemInfo: INITIAL_SYSTEM_INFO,

      settings: {
        ...DEFAULT_USER_SETTINGS,
        general: {
          startOnBoot: false,
          checkForUpdates: true,
          updateFrequency: "daily",
          showTooltips: true,
          defaultApps: {
            imaging: "nina",
            planetarium: "stellarium",
            guiding: "phd2",
          },
          confirmBeforeClosing: true,
          autoConnectEquipment: false,
        },
        advanced: {
          debugMode: false,
          logLevel: "info",
          experimentalFeatures: false,
          apiEndpoints: {},
        },
        appearance: {
          theme: "system",
          fontSize: 2,
          redNightMode: false,
          compactView: false,
          customAccentColor: undefined,
          showStatusBar: true,
          animationsEnabled: true,
        },
        notifications: {
          softwareUpdates: true,
          equipmentEvents: true,
          downloadCompletion: true,
          systemAlerts: true,
          sessionReminders: true,
          soundEffects: true,
        },
        storage: {
          downloadLocation: "",
          imageLocation: "",
          clearCacheAutomatically: true,
          cacheSizeLimit: 1,
          backupFrequency: "never",
          backupLocation: undefined,
        },
        language: {
          appLanguage: "en",
          dateFormat: "mdy",
          timeFormat: "12h",
          temperatureUnit: "celsius",
          distanceUnit: "metric",
        },
        privacy: {
          shareUsageData: true,
          errorReporting: true,
          rememberLogin: true,
          dataRetentionPeriod: 30,
          encryptLocalData: false,
        },
        account: {
          name: "",
          email: "",
          avatar: undefined,
          organization: undefined,
          role: undefined,
        },
      },
      theme: "system",

      isSystemModalOpen: false,

      // Agent state
      agents: [],
      selectedAgent: null,
      agentResults: [],
      isAgentLoading: false,

      // Tool state
      tools: [],
      toolCategories: [],
      selectedTool: null,
      toolResults: [],
      isToolLoading: false,

      // Actions
      setSoftware: (software) => set({ software }),

      addSoftware: (software) =>
        set((state) => ({
          software: [...state.software, software],
        })),

      updateSoftware: (id, updates) =>
        set((state) => ({
          software: state.software.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      removeSoftware: (id) =>
        set((state) => ({
          software: state.software.filter((item) => item.id !== id),
        })),

      importSoftware: async (newSoftware) => {
        try {
          // Create a map of existing software by name for quick lookup
          const state = get();
          const existingSoftwareMap = new Map(
            state.software.map((s) => [s.name.toLowerCase(), s])
          );

          // Process each new software item
          const updatedSoftware = [...state.software];
          let conflicts = 0;

          newSoftware.forEach((newItem) => {
            const existingItem = existingSoftwareMap.get(
              newItem.name.toLowerCase()
            );

            if (existingItem) {
              // Update existing item
              conflicts++;
              const index = updatedSoftware.findIndex(
                (s) => s.id === existingItem.id
              );
              if (index !== -1) {
                updatedSoftware[index] = {
                  ...existingItem,
                  ...newItem,
                  id: existingItem.id, // Keep the original ID
                };
              }
            } else {
              // Add new item with a new ID
              const newId =
                Math.max(0, ...updatedSoftware.map((s) => s.id)) + 1;
              updatedSoftware.push({
                ...newItem,
                id: newId,
              });
            }
          });

          // Update the state
          set({ software: updatedSoftware });

          // Return success with conflict information
          return {
            success: true,
            message: `Successfully imported ${newSoftware.length} software items with ${conflicts} conflicts resolved.`,
            conflicts,
          };
        } catch (error) {
          console.error("Error importing software:", error);
          return {
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "Failed to import software",
          };
        }
      },

      setCurrentTab: (currentTab) => set({ currentTab }),
      setSearchVisible: (searchVisible) => set({ searchVisible }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortDirection: (sortDirection) => set({ sortDirection }),
      setAutoScroll: (autoScroll) => set({ autoScroll }),
      setScrollSpeed: (scrollSpeed) => set({ scrollSpeed }),
      setFilterFeatured: (filterFeatured) => set({ filterFeatured }),
      setFilterInstalled: (filterInstalled) => set({ filterInstalled }),
      setSelectedSoftware: (selectedSoftware) => set({ selectedSoftware }),

      startInstallation: (softwareId) =>
        set((state) => {
          const selectedSoftware =
            state.software.find((s) => s.id === softwareId) || null;
          return {
            selectedSoftware,
            isInstalling: true,
            installProgress: 0,
          };
        }),

      updateInstallProgress: (installProgress) => set({ installProgress }),

      completeInstallation: () =>
        set((state) => {
          if (!state.selectedSoftware) return state;

          return {
            software: state.software.map((item) =>
              item.id === state.selectedSoftware?.id
                ? { ...item, installed: true, actionLabel: "Launch" }
                : item
            ),
            isInstalling: false,
            installProgress: 0,
          };
        }),

      addDownload: (download) =>
        set((state) => ({
          downloads: [...state.downloads, download],
        })),

      updateDownload: (id, updates) =>
        set((state) => ({
          downloads: state.downloads.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      removeDownload: (id) =>
        set((state) => ({
          downloads: state.downloads.filter((item) => item.id !== id),
        })),

      moveToHistory: (id) =>
        set((state) => {
          const download = state.downloads.find((d) => d.id === id);
          if (!download) return state;

          return {
            downloads: state.downloads.filter((d) => d.id !== id),
            downloadHistory: [
              ...state.downloadHistory,
              {
                ...download,
                status: download.progress >= 100 ? "completed" : "error",
              },
            ],
          };
        }),

      clearDownloadHistory: () => set({ downloadHistory: [] }),

      addEquipment: async (equipment) => {
        try {
          // In a real app, this would call an API
          const response = await fetch("/api/equipment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(equipment),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to add equipment");
          }

          // Update the state
          set((state) => ({
            equipment: [...state.equipment, data.equipment],
          }));

          return data.equipment;
        } catch (error) {
          console.error("Error adding equipment:", error);
          throw error;
        }
      },

      updateEquipment: async (id, updates) => {
        try {
          // In a real app, this would call an API
          const response = await fetch(`/api/equipment/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to update equipment");
          }

          // Update the state
          set((state) => ({
            equipment: state.equipment.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          }));

          return data.equipment;
        } catch (error) {
          console.error("Error updating equipment:", error);
          throw error;
        }
      },

      removeEquipment: async (id) => {
        try {
          // In a real app, this would call an API
          const response = await fetch(`/api/equipment/${id}`, {
            method: "DELETE",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to remove equipment");
          }

          // Update the state
          set((state) => ({
            equipment: state.equipment.filter((item) => item.id !== id),
          }));

          return true;
        } catch (error) {
          console.error("Error removing equipment:", error);
          throw error;
        }
      },

      refreshEquipment: async () => {
        try {
          // In a real app, this would call an API
          const response = await fetch("/api/equipment");
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch equipment");
          }

          // Update the state
          set({ equipment: data.equipment });

          return data.equipment;
        } catch (error) {
          console.error("Error fetching equipment:", error);
          throw error;
        }
      },

      updateSystemInfo: (updates) =>
        set((state) => ({
          systemInfo: { ...state.systemInfo, ...updates },
        })),

      refreshSystemInfo: async () => {
        try {
          // In a real app, this would call an API
          const response = await fetch("/api/system");
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch system info");
          }

          // Update the state
          set({ systemInfo: data.systemInfo });

          return data.systemInfo;
        } catch (error) {
          console.error("Error fetching system info:", error);
          throw error;
        }
      },

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetSettings: () =>
        set({
          settings: {
            advanced: {
              debugMode: false,
              logLevel: "info",
              experimentalFeatures: false,
              apiEndpoints: {},
            },
            general: {
              startOnBoot: false,
              checkForUpdates: true,
              updateFrequency: "daily",
              showTooltips: true,
              defaultApps: {
                imaging: "nina",
                planetarium: "stellarium",
                guiding: "phd2",
              },
              confirmBeforeClosing: true,
              autoConnectEquipment: false,
            },
            appearance: {
              theme: "system",
              fontSize: 2,
              redNightMode: false,
              compactView: false,
              customAccentColor: undefined,
              showStatusBar: true,
              animationsEnabled: true,
            },
            account: {
              name: "",
              email: "",
              avatar: undefined,
              organization: undefined,
              role: undefined,
            },
            notifications: {
              softwareUpdates: true,
              equipmentEvents: true,
              downloadCompletion: true,
              systemAlerts: true,
              sessionReminders: true,
              soundEffects: true,
            },
            storage: {
              downloadLocation: "",
              imageLocation: "",
              clearCacheAutomatically: true,
              cacheSizeLimit: 1,
              backupFrequency: "never",
            },
            privacy: {
              shareUsageData: true,
              errorReporting: true,
              rememberLogin: true,
              dataRetentionPeriod: 30,
              encryptLocalData: false,
            },
            language: {
              appLanguage: "en",
              dateFormat: "mdy",
              timeFormat: "12h",
              temperatureUnit: "celsius",
              distanceUnit: "metric",
            },
          },
        }),

      setTheme: (theme) => set({ theme }),

      setSystemModalOpen: (isSystemModalOpen) => set({ isSystemModalOpen }),

      reloadApplication: async () => {
        try {
          // In a real app, this would call an API
          const response = await fetch("/api/system", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "reload" }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to reload application");
          }

          // Close the modal
          set({ isSystemModalOpen: false });

          return true;
        } catch (error) {
          console.error("Error reloading application:", error);
          return false;
        }
      },

      shutdownApplication: async () => {
        try {
          // In a real app, this would call an API
          const response = await fetch("/api/system", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "shutdown" }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to shutdown application");
          }

          // Close the modal
          set({ isSystemModalOpen: false });

          return true;
        } catch (error) {
          console.error("Error shutting down application:", error);
          return false;
        }
      },

      // Agent actions
      fetchAgents: async () => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch("/api/agents");
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch agents");
          }

          const data = await response.json();
          set({ agents: data.agents, isAgentLoading: false });
          return data.agents;
        } catch (error) {
          console.error("Error fetching agents:", error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      getAgent: async (id) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}`);
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch agent");
          }

          const data = await response.json();
          set({ selectedAgent: data.agent, isAgentLoading: false });
          return data.agent;
        } catch (error) {
          console.error(`Error fetching agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      createAgent: async (agent) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch("/api/agents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(agent),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create agent");
          }

          const data = await response.json();
          set((state) => ({
            agents: [...state.agents, data.agent],
            isAgentLoading: false,
          }));
          return data.agent;
        } catch (error) {
          console.error("Error creating agent:", error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      updateAgent: async (id, updates) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update agent");
          }

          const data = await response.json();
          set((state) => ({
            agents: state.agents.map((a) => (a.id === id ? data.agent : a)),
            selectedAgent: data.agent,
            isAgentLoading: false,
          }));
          return data.agent;
        } catch (error) {
          console.error(`Error updating agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      deleteAgent: async (id) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete agent");
          }

          set((state) => ({
            agents: state.agents.filter((a) => a.id !== id),
            selectedAgent:
              state.selectedAgent?.id === id ? null : state.selectedAgent,
            isAgentLoading: false,
          }));
          return true;
        } catch (error) {
          console.error(`Error deleting agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      runAgent: async (id) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}/run`, {
            method: "POST",
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to run agent");
          }

          const data = await response.json();

          // Update agent status
          set((state) => ({
            agents: state.agents.map((a) =>
              a.id === id ? { ...a, status: "running" } : a
            ),
            agentResults: [data.result, ...state.agentResults],
            isAgentLoading: false,
          }));

          return data.result;
        } catch (error) {
          console.error(`Error running agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      stopAgent: async (id) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}/stop`, {
            method: "POST",
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to stop agent");
          }

          // Update agent status
          set((state) => ({
            agents: state.agents.map((a) =>
              a.id === id ? { ...a, status: "idle" } : a
            ),
            isAgentLoading: false,
          }));

          return true;
        } catch (error) {
          console.error(`Error stopping agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      getAgentResults: async (id) => {
        set({ isAgentLoading: true });
        try {
          const response = await fetch(`/api/agents/${id}/results`);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch agent results");
          }

          const data = await response.json();
          set({ agentResults: data.results, isAgentLoading: false });
          return data.results;
        } catch (error) {
          console.error(`Error fetching results for agent ${id}:`, error);
          set({ isAgentLoading: false });
          throw error;
        }
      },

      // Tool actions
      fetchTools: async () => {
        set({ isToolLoading: true });
        try {
          const response = await fetch("/api/tools");

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch tools");
          }

          const data = await response.json();
          set({ tools: data.tools, isToolLoading: false });
          return data.tools;
        } catch (error) {
          console.error("Error fetching tools:", error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      fetchToolCategories: async () => {
        set({ isToolLoading: true });
        try {
          const response = await fetch("/api/tools/categories");

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch tool categories");
          }

          const data = await response.json();
          set({ toolCategories: data.categories, isToolLoading: false });
          return data.categories;
        } catch (error) {
          console.error("Error fetching tool categories:", error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      getTool: async (id) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch(`/api/tools/${id}`);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch tool");
          }

          const data = await response.json();
          set({ selectedTool: data.tool, isToolLoading: false });
          return data.tool;
        } catch (error) {
          console.error(`Error fetching tool ${id}:`, error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      createTool: async (tool) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tool),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create tool");
          }

          const data = await response.json();
          set((state) => ({
            tools: [...state.tools, data.tool],
            isToolLoading: false,
          }));
          return data.tool;
        } catch (error) {
          console.error("Error creating tool:", error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      updateTool: async (id, updates) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch(`/api/tools/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update tool");
          }

          const data = await response.json();
          set((state) => ({
            tools: state.tools.map((t) => (t.id === id ? data.tool : t)),
            selectedTool: data.tool,
            isToolLoading: false,
          }));
          return data.tool;
        } catch (error) {
          console.error(`Error updating tool ${id}:`, error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      deleteTool: async (id) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch(`/api/tools/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete tool");
          }

          set((state) => ({
            tools: state.tools.filter((t) => t.id !== id),
            selectedTool:
              state.selectedTool?.id === id ? null : state.selectedTool,
            isToolLoading: false,
          }));
          return true;
        } catch (error) {
          console.error(`Error deleting tool ${id}:`, error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      runTool: async (id, inputs) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch(`/api/tools/${id}/run`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to run tool");
          }

          const data = await response.json();

          // Update tool lastUsed
          const now = new Date().toISOString();
          set((state) => ({
            tools: state.tools.map((t) =>
              t.id === id ? { ...t, lastUsed: now } : t
            ),
            toolResults: [data.result, ...state.toolResults],
            isToolLoading: false,
          }));

          return data.result;
        } catch (error) {
          console.error(`Error running tool ${id}:`, error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      getToolResults: async (id) => {
        set({ isToolLoading: true });
        try {
          const response = await fetch(`/api/tools/${id}/results`);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch tool results");
          }

          const data = await response.json();
          set({ toolResults: data.results, isToolLoading: false });
          return data.results;
        } catch (error) {
          console.error(`Error fetching results for tool ${id}:`, error);
          set({ isToolLoading: false });
          throw error;
        }
      },

      toggleToolFavorite: async (id) => {
        try {
          const tool = get().tools.find((t) => t.id === id);
          if (!tool) throw new Error(`Tool with id ${id} not found`);

          const response = await fetch(`/api/tools/${id}/favorite`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ favorite: !tool.favorite }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to toggle favorite");
          }

          const data = await response.json();
          set((state) => ({
            tools: state.tools.map((t) =>
              t.id === id ? { ...t, favorite: !t.favorite } : t
            ),
          }));

          return data.tool;
        } catch (error) {
          console.error(`Error toggling favorite for tool ${id}:`, error);
          throw error;
        }
      },
    }),
    {
      name: "astronomy-app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        software: state.software,
        viewMode: state.viewMode,
        itemsPerPage: state.itemsPerPage,
        settings: state.settings,
        theme: state.theme,
        downloads: state.downloads,
        downloadHistory: state.downloadHistory,
        tools: state.tools.map((tool) => ({
          id: tool.id,
          name: tool.name,
          favorite: tool.favorite,
          lastUsed: tool.lastUsed,
        })),
      }),
    }
  )
);
