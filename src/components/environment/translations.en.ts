// English translations for the environment module
export const translations = {
  environment: {
    // Page header
    pageHeader: {
      title: "System Environment",
      description: "View and manage system environment and device connections",
      refresh: "Refresh",
      refreshTooltip: "Refresh all environment information",
      refreshSuccess: "Environment information refreshed",
      refreshError: "Failed to refresh environment information"
    },

    // System information
    systemInformation: {
      title: "System Information",
      description: "View current system status and resource usage",
      cpuUsage: "CPU Usage",
      memoryUsage: "Memory Usage",
      diskUsage: "Disk Usage",
      osInfo: "Operating System",
      uptime: "Uptime",
      refresh: "Refresh",
      refreshSuccess: "System information refreshed",
      refreshError: "Failed to refresh system information",
      used: "Used",
      free: "Free",
      total: "Total"
    },

    // Connection status card
    connectionStatus: {
      title: "Connection Status",
      description: "View device connection status",
      status: "Status",
      connected: "Connected",
      disconnected: "Disconnected",
      connecting: "Connecting",
      latency: "Latency",
      uptime: "Connection Time",
      lastChecked: "Last Checked",
      refresh: "Refresh",
      connect: "Connect",
      disconnect: "Disconnect",
      connectionSuccess: "Connection successful",
      connectionError: "Connection failed",
      disconnectionSuccess: "Disconnection successful",
      disconnectionError: "Disconnection failed",
      refreshError: "Failed to refresh connection status",
      emptyState: "No connection information available"
    },

    // Connection logs card
    connectionLogs: {
      title: "Connection Logs",
      description: "View device connection logs",
      emptyState: "No connection logs",
      timestamp: "Time",
      level: "Level",
      message: "Message",
      clearLogs: "Clear Logs",
      clearSuccess: "Logs cleared",
      clearError: "Failed to clear logs",
      refresh: "Refresh"
    },

    // Equipment item
    equipmentItem: {
      connect: "Connect",
      disconnect: "Disconnect",
      settings: "Settings",
      status: {
        connected: "Connected",
        disconnected: "Disconnected",
        connecting: "Connecting"
      },
      connectionError: "Connection failed",
      disconnectionError: "Disconnection failed"
    },

    // Equipment list
    equipmentList: {
      title: "Equipment List",
      description: "Manage connected devices",
      filter: "Filter Equipment",
      groupByType: "Group by Type",
      noGrouping: "No Grouping",
      searchPlaceholder: "Search equipment...",
      refreshSuccess: "Equipment list refreshed",
      refreshError: "Failed to refresh equipment list",
      noDevicesFound: "No devices found",
      refreshDevices: "Refresh devices"
    },

    // Equipment profiles
    equipmentProfiles: {
      title: "Equipment Profiles",
      description: "Manage equipment configurations",
      create: "Create Profile",
      edit: "Edit Profile",
      delete: "Delete Profile",
      activateProfile: "Apply Profile",
      createSuccess: "Profile created",
      createError: "Failed to create profile",
      updateSuccess: "Profile updated",
      updateError: "Failed to update profile",
      deleteSuccess: "Profile deleted",
      deleteError: "Failed to delete profile",
      activateSuccess: "Profile applied",
      activateError: "Failed to apply profile"
    },

    // System settings card
    systemSettings: {
      title: "System Settings",
      description: "Configure system parameters",
      save: "Save",
      cancel: "Cancel",
      saveSuccess: "Settings saved",
      saveError: "Failed to save settings"
    }
  }
};

export default translations;
