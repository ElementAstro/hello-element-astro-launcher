// 中文环境模块的翻译
export const translations = {
  environment: {
    // 页面头部
    pageHeader: {
      title: "系统环境",
      description: "查看和管理系统环境和设备连接状态",
      refresh: "刷新",
      refreshTooltip: "刷新所有环境信息",
      refreshSuccess: "环境信息已刷新",
      refreshError: "刷新环境信息失败"
    },

    // 系统信息
    systemInformation: {
      title: "系统信息",
      description: "查看当前系统状态和资源使用情况",
      cpuUsage: "CPU使用率",
      memoryUsage: "内存使用率",
      diskUsage: "磁盘使用率",
      osInfo: "操作系统",
      uptime: "运行时间",
      refresh: "刷新",
      refreshSuccess: "系统信息已刷新",
      refreshError: "刷新系统信息失败",
      used: "已用",
      free: "可用",
      total: "总计"
    },

    // 连接状态卡片
    connectionStatus: {
      title: "连接状态",
      description: "查看设备连接状态",
      status: "状态",
      connected: "已连接",
      disconnected: "已断开",
      connecting: "连接中",
      latency: "延迟",
      uptime: "已连接时间",
      lastChecked: "最后检查",
      refresh: "刷新",
      connect: "连接",
      disconnect: "断开",
      connectionSuccess: "连接成功",
      connectionError: "连接失败",
      disconnectionSuccess: "断开连接成功",
      disconnectionError: "断开连接失败",
      refreshError: "刷新连接状态失败",
      emptyState: "没有设备连接信息"
    },

    // 连接日志卡片
    connectionLogs: {
      title: "连接日志",
      description: "查看设备连接日志",
      emptyState: "没有连接日志",
      timestamp: "时间",
      level: "等级",
      message: "信息",
      clearLogs: "清除日志",
      clearSuccess: "日志已清除",
      clearError: "清除日志失败",
      refresh: "刷新"
    },

    // 设备项目
    equipmentItem: {
      connect: "连接",
      disconnect: "断开",
      settings: "设置",
      status: {
        connected: "已连接",
        disconnected: "已断开",
        connecting: "连接中"
      },
      connectionError: "连接失败",
      disconnectionError: "断开连接失败"
    },

    // 设备列表
    equipmentList: {
      title: "设备列表",
      description: "管理已连接的设备",
      filter: "筛选设备",
      groupByType: "按类型分组",
      noGrouping: "不分组",
      searchPlaceholder: "搜索设备...",
      refreshSuccess: "设备列表已刷新",
      refreshError: "刷新设备列表失败",
      noDevicesFound: "没有找到设备",
      refreshDevices: "刷新设备列表"
    },

    // 设备配置
    equipmentProfiles: {
      title: "设备配置",
      description: "管理设备配置",
      create: "创建配置",
      edit: "编辑配置",
      delete: "删除配置",
      activateProfile: "应用配置",
      createSuccess: "配置已创建",
      createError: "创建配置失败",
      updateSuccess: "配置已更新",
      updateError: "更新配置失败",
      deleteSuccess: "配置已删除",
      deleteError: "删除配置失败",
      activateSuccess: "配置已应用",
      activateError: "应用配置失败"
    },

    // 系统设置卡片
    systemSettings: {
      title: "系统设置",
      description: "配置系统参数",
      save: "保存",
      cancel: "取消",
      saveSuccess: "设置已保存",
      saveError: "保存设置失败"
    }
  }
};

export default translations;
