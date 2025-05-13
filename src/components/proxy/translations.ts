// Translation keys for proxy components
export const translations = {
  // Proxy card
  proxy: {
    card: {
      type: "类型",
      address: "地址",
      latency: "延迟",
      tooltips: {
        viewLogs: "查看日志",
        start: "启动",
        stop: "停止",
        edit: "编辑",
        delete: "删除",
      },
    },
    status: {
      running: "运行中",
      idle: "空闲",
      error: "错误",
    },
    // For proxy header
    header: {
      title: "代理服务器",
      description: "管理您的代理服务器配置和状态。",
      addNew: "添加代理",
    },
    // For proxy search and filter
    search: {
      placeholder: "搜索代理...",
      filterByStatus: "按状态筛选",
      filterByType: "按类型筛选",
      allStatuses: "所有状态",
      allTypes: "所有类型",
    },
    // For proxy list
    list: {
      empty: "没有找到代理",
      emptyFiltered: "没有找到符合条件的代理",
      addNew: "添加新代理",
    },
    // For delete proxy dialog
    deleteDialog: {
      title: "删除代理",
      description: "您确定要删除此代理吗？此操作不可撤销。",
      cancel: "取消",
      confirm: "确认",
    },
    // For proxy logs dialog
    logsDialog: {
      title: "代理日志",
      description: "查看代理的详细日志记录。",
      noLogs: "暂无日志记录",
      refresh: "刷新",
      close: "关闭",
      timestamp: "时间戳",
      message: "消息",
      level: "级别",
    },
  },
};
