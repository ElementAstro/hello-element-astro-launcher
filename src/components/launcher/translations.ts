/**
 * Launcher组件的翻译字典
 * 这个文件定义了Launcher组件中使用的所有翻译键
 */

export const launcherTranslations = {
  "zh-CN": {
    launcher: {
      // 软件项目相关翻译
      software: {
        featured: "精选",
        installed: "已装",
        moreInfo: "更多信息",
        viewMoreInfo: "查看有关此软件的更多信息",
        detailedInfo: "详细信息",
        installing: "安装中...",
        loading: "加载中...",
        install: "安装",
        launch: "启动",
        downloads: "下载",
      },

      // 搜索相关翻译
      search: {
        placeholder: "搜索软件...",
        recentSearches: "最近搜索",
        clearHistory: "清除历史记录",
        cancel: "取消",
        searchSoftware: "搜索软件",
        refreshSoftware: "刷新软件列表",
      },

      // 分类相关翻译
      categories: {
        all: "全部",
        deepspace: "深空",
        planets: "行星",
        guiding: "引导",
        analysis: "分析",
        drivers: "驱动",
        vendor: "厂商",
        utilities: "工具",
        fetchError: "获取软件分类失败:",
      },

      // 过滤控制相关翻译
      filter: {
        sortNameAsc: "名称 (A-Z)",
        sortNameDesc: "名称 (Z-A)",
        sortDownloadsDesc: "下载量 (高到低)",
        sortDownloadsAsc: "下载量 (低到高)",
        sortUpdatedDesc: "最近更新",
        sortUpdatedAsc: "最早更新",
        sortDefault: "默认排序",
        featured: "精选",
        installed: "已安装",
        separator: "、",
        noFilters: "无过滤器",
        featuredOnly: "只显示精选项目",
        showAllSoftware: "显示所有软件",
        showFeaturedSoftware: "只显示精选软件",
        installedOnly: "只显示已安装项目",
        showAllInstalled: "显示所有软件",
        showInstalledSoftware: "只显示已安装软件",
      },

      // 分页控制相关翻译
      pagination: {
        navigation: "分页导航",
        currentPage: "当前页 {{pageNumber}}",
        goToPage: "跳转到第 {{pageNumber}} 页",
        firstPage: "首页",
        first: "首页",
        goToFirstPage: "跳转到第一页",
        previousPage: "上一页",
        previous: "上一页",
        goToPreviousPage: "跳转到上一页",
        nextPage: "下一页",
        next: "下一页",
        goToNextPage: "跳转到下一页",
        lastPage: "末页",
        last: "末页",
        goToLastPage: "跳转到最后一页",
        showing: "显示 {{range}}",
      },

      // 详情对话框相关翻译
      details: {
        error: "错误",
        version: "版本",
        updated: "更新日期",
        developer: "开发者",
        downloads: "下载次数",
        featured: "精选",
        installing: "正在安装...",
        releaseNotes: "版本说明",
        website: "访问网站",
        install: "安装",
        launch: "启动",
      },

      // 空状态和错误状态相关翻译
      states: {
        retry: "重试",
        noResultsTitle: "未找到结果",
        noResultsDesc:
          "没有匹配当前搜索或过滤条件的软件。请尝试修改您的搜索条件。",
        clearFilters: "清除过滤器",
        noSoftwareTitle: "没有可用软件",
        noSoftwareDesc:
          "没有在此类别中找到任何软件。请尝试选择其他类别，或稍后再试。",
        loading: "正在加载软件...",
        loadingDesc: "请稍候片刻，我们正在获取软件列表。",
        networkErrorTitle: "网络错误",
        networkErrorDesc: "无法连接到服务器。请检查您的网络连接，然后重试。",
        serverErrorTitle: "服务器错误",
        serverErrorDesc: "服务器处理请求时出错。请稍后重试或联系支持团队。",
      },

      // 错误信息相关翻译
      error: {
        installProgress: "无法获取安装进度信息",
      },

      // 自动滚动控件相关翻译
      autoScroll: {
        auto: "自动",
        pause: "暂停",
        pauseAutoScroll: "停止自动滚动页面",
        enableAutoScroll: "启用自动滚动页面",
        seconds: "秒",
        adjustSpeed: "调整自动滚动速度（秒/页）",
        itemsPerPage: "每页:",
        setItemsPerPage: "设置每页显示的软件数量",
        setItemsCount: "设置每页显示的项目数",
        veryFast: "很快",
        medium: "中等",
        slow: "较慢",
        verySlow: "很慢",
      },
    },
  },
  en: {
    launcher: {
      // Software item related translations
      software: {
        featured: "Featured",
        installed: "Installed",
        moreInfo: "More Info",
        viewMoreInfo: "View more information about this software",
        detailedInfo: "Detailed Info",
        installing: "Installing...",
        loading: "Loading...",
        install: "Install",
        launch: "Launch",
        downloads: "downloads",
      },

      // Search related translations
      search: {
        placeholder: "Search software...",
        recentSearches: "Recent Searches",
        clearHistory: "Clear History",
        cancel: "Cancel",
        searchSoftware: "Search Software",
        refreshSoftware: "Refresh Software List",
      },

      // Category related translations
      categories: {
        all: "All",
        deepspace: "Deep Space",
        planets: "Planets",
        guiding: "Guiding",
        analysis: "Analysis",
        drivers: "Drivers",
        vendor: "Vendor",
        utilities: "Utilities",
        fetchError: "Failed to fetch software categories:",
      },

      // Filter controls related translations
      filter: {
        sortNameAsc: "Name (A-Z)",
        sortNameDesc: "Name (Z-A)",
        sortDownloadsDesc: "Downloads (High to Low)",
        sortDownloadsAsc: "Downloads (Low to High)",
        sortUpdatedDesc: "Latest Updated",
        sortUpdatedAsc: "Oldest Updated",
        sortDefault: "Default Sort",
        featured: "Featured",
        installed: "Installed",
        separator: ", ",
        noFilters: "No Filters",
        featuredOnly: "Show only featured items",
        showAllSoftware: "Show all software",
        showFeaturedSoftware: "Show only featured software",
        installedOnly: "Show only installed items",
        showAllInstalled: "Show all software",
        showInstalledSoftware: "Show only installed software",
      },

      // Pagination controls related translations
      pagination: {
        navigation: "Pagination Navigation",
        currentPage: "Current Page {{pageNumber}}",
        goToPage: "Go to Page {{pageNumber}}",
        firstPage: "First Page",
        first: "First",
        goToFirstPage: "Go to First Page",
        previousPage: "Previous Page",
        previous: "Previous",
        goToPreviousPage: "Go to Previous Page",
        nextPage: "Next Page",
        next: "Next",
        goToNextPage: "Go to Next Page",
        lastPage: "Last Page",
        last: "Last",
        goToLastPage: "Go to Last Page",
        showing: "Showing {{range}}",
      },

      // Details dialog related translations
      details: {
        error: "Error",
        version: "Version",
        updated: "Updated",
        developer: "Developer",
        downloads: "Downloads",
        featured: "Featured",
        installing: "Installing...",
        releaseNotes: "Release Notes",
        website: "Visit Website",
        install: "Install",
        launch: "Launch",
      },

      // Empty states and error states related translations
      states: {
        retry: "Retry",
        noResultsTitle: "No Results Found",
        noResultsDesc:
          "No software matches your current search or filter criteria. Try modifying your search.",
        clearFilters: "Clear Filters",
        noSoftwareTitle: "No Software Available",
        noSoftwareDesc:
          "No software was found in this category. Try selecting a different category or check back later.",
        loading: "Loading Software...",
        loadingDesc: "Please wait a moment while we fetch the software list.",
        networkErrorTitle: "Network Error",
        networkErrorDesc:
          "Could not connect to the server. Please check your network connection and try again.",
        serverErrorTitle: "Server Error",
        serverErrorDesc:
          "The server encountered an error while processing your request. Please try again later or contact support.",
      },

      // Error messages related translations
      error: {
        installProgress: "Unable to fetch installation progress information",
      },

      // Auto-scroll controls related translations
      autoScroll: {
        auto: "Auto",
        pause: "Pause",
        pauseAutoScroll: "Stop auto-scrolling pages",
        enableAutoScroll: "Enable auto-scrolling pages",
        seconds: "sec",
        adjustSpeed: "Adjust auto-scroll speed (seconds/page)",
        itemsPerPage: "Per page:",
        setItemsPerPage: "Set number of software items per page",
        setItemsCount: "Set number of items per page",
        veryFast: "Very Fast",
        medium: "Medium",
        slow: "Slow",
        verySlow: "Very Slow",
      },
    },
  },
};

export default launcherTranslations;
