// English translation keys for proxy components
export const translations = {
  // Proxy card
  proxy: {
    card: {
      type: "Type",
      address: "Address",
      latency: "Latency",
      tooltips: {
        viewLogs: "View Logs",
        start: "Start",
        stop: "Stop",
        edit: "Edit",
        delete: "Delete",
      },
    },
    status: {
      running: "Running",
      idle: "Idle",
      error: "Error",
    },
    // For proxy header
    header: {
      title: "Proxy Servers",
      description: "Manage your proxy server configurations and status.",
      addNew: "Add Proxy",
    },
    // For proxy search and filter
    search: {
      placeholder: "Search proxies...",
      filterByStatus: "Filter by status",
      filterByType: "Filter by type",
      allStatuses: "All Statuses",
      allTypes: "All Types",
    },
    // For proxy list
    list: {
      empty: "No proxies found",
      emptyFiltered: "No proxies match your criteria",
      addNew: "Add New Proxy",
    },
    // For delete proxy dialog
    deleteDialog: {
      title: "Delete Proxy",
      description: "Are you sure you want to delete this proxy? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Confirm",
    },
    // For proxy logs dialog
    logsDialog: {
      title: "Proxy Logs",
      description: "View detailed logs for your proxy.",
      noLogs: "No logs available",
      refresh: "Refresh",
      close: "Close",
      timestamp: "Timestamp",
      message: "Message",
      level: "Level",
    },
  },
};
