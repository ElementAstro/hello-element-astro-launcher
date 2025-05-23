/**
 * 工具组件的翻译键
 */
export const translations = {
  en: {
    // 工具卡片相关翻译
    toolCard: {
      lastUsed: "Last used",
      neverUsed: "Never used",
      run: "Run",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      edit: "Edit",
      viewHistory: "View history",
      duplicate: "Duplicate",
      delete: "Delete",
      confirmDelete: "Confirm delete",
    },

    // 工具列表相关翻译
    toolList: {
      loadingError: "Error loading tools",
      retry: "Retry",
      noToolsFound: "No tools found",
      emptySearchResult:
        "No tools match your search criteria. Try using different search terms.",
      noToolsCreated:
        "You haven't created any tools yet. Create your first tool to help with astronomical calculations.",
      createTool: "Create Tool",
    },

    // 搜索和过滤相关翻译
    searchAndFilter: {
      searchPlaceholder: "Search tools...",
      clearSearch: "Clear search",
      all: "All",
      favorites: "Favorites",
      filters: "Filters",
      categories: "Categories",
      status: "Status",
      clearFilters: "Clear filters",
      refreshTools: "Refresh tool list",
    },

    // 工具输入字段相关翻译
    toolInput: {
      required: "Required",
      optional: "Optional",
      enterValue: "Enter value",
    },

    // 工具结果相关翻译
    toolResult: {
      copyResult: "Copy result",
      copied: "Copied",
      noResultsYet: "No results yet",
      runToolToSeeResults: "Run tool to see results",
      executionError: "Execution error",
      completed: "Completed",
      failed: "Failed",
      processing: "Processing...",
    },

    // 预览工具相关翻译
    previewTool: {
      previewMode: "Preview mode",
      inputs: "Inputs",
      run: "Run",
      results: "Results",
    },

    // 输入/输出编辑器相关翻译
    editors: {
      input: "Input",
      output: "Output",
      clear: "Clear",
      copy: "Copy",
      enterData: "Enter data",
      noOutput: "No output data",
      sampleData: "Sample data",
      textOutputDesc:
        "Text output, such as calculation results, status information, etc.",
      numberOutputDesc:
        "Numeric output, such as calculation results, measurements, etc.",
      dateOutputDesc: "Date output, such as calculated dates and times",
      imageOutputDesc:
        "Image output, such as charts, astronomical images, etc.",
      fileOutputDesc: "File output, such as generated reports or data files",
      chartOutputDesc: "Chart output, such as line charts, bar charts, etc.",
      tableOutputDesc:
        "Table data output, such as data lists, result sets, etc.",
      defaultOutputDesc: "Data type of output results",
      nameRequired: "Name cannot be empty",
      nameTooLong: "Name is too long",
      nameInvalidFormat:
        "Can only contain letters, numbers, and underscores, and must start with a letter or underscore",
      descriptionRequired: "Description cannot be empty",
      descriptionTooLong: "Description is too long",
      outputName: "Output name",
      enterName: "Enter name",
      outputNameDescription: "Unique name to identify this output",
      outputType: "Output type",
      selectType: "Select type",
      text: "Text",
      number: "Number",
      date: "Date",
      image: "Image",
      file: "File",
      chart: "Chart",
      table: "Table",
      description: "Description",
      descriptionPlaceholder: "Describe the content and purpose of this output",
      descriptionHelpText: "Help users understand the meaning of this output",
      typeHelp: "Type description",
      chartOutput: "Chart output",
      chartDescription:
        "Chart output will present data in the form of visualized charts, supporting the following chart types:",
    },
  },
  "zh-CN": {
    // 工具卡片相关翻译
    toolCard: {
      lastUsed: "最近使用",
      neverUsed: "从未使用",
      run: "运行",
      addToFavorites: "添加到收藏",
      removeFromFavorites: "从收藏中移除",
      edit: "编辑",
      viewHistory: "查看历史",
      duplicate: "复制",
      delete: "删除",
      confirmDelete: "确认删除",
    },

    // 工具列表相关翻译
    toolList: {
      loadingError: "加载工具时出错",
      retry: "重试",
      noToolsFound: "未找到工具",
      emptySearchResult: "没有找到符合搜索条件的工具。尝试使用不同的搜索词。",
      noToolsCreated:
        "您尚未创建任何工具。创建您的第一个工具以帮助进行天文计算。",
      createTool: "创建工具",
    },

    // 搜索和过滤相关翻译
    searchAndFilter: {
      searchPlaceholder: "搜索工具...",
      clearSearch: "清除搜索",
      all: "全部",
      favorites: "收藏",
      filters: "过滤器",
      categories: "分类",
      status: "状态",
      clearFilters: "清除过滤器",
      refreshTools: "刷新工具列表",
    },

    // 工具输入字段相关翻译
    toolInput: {
      required: "必填",
      optional: "可选",
      enterValue: "输入值",
    },

    // 工具结果相关翻译
    toolResult: {
      copyResult: "复制结果",
      copied: "已复制",
      noResultsYet: "尚无结果",
      runToolToSeeResults: "运行工具查看结果",
      executionError: "执行错误",
      completed: "已完成",
      failed: "失败",
      processing: "处理中...",
    },

    // 预览工具相关翻译
    previewTool: {
      previewMode: "预览模式",
      inputs: "输入",
      run: "运行",
      results: "结果",
    },

    // 输入/输出编辑器相关翻译
    editors: {
      input: "输入",
      output: "输出",
      clear: "清除",
      copy: "复制",
      enterData: "输入数据",
      noOutput: "无输出数据",
      sampleData: "示例数据",
      textOutputDesc: "文本输出，如计算结果、状态信息等",
      numberOutputDesc: "数值输出，如计算结果、测量值等",
      dateOutputDesc: "日期输出，如计算得到的日期时间",
      imageOutputDesc: "图像输出，如图表、天体图像等",
      fileOutputDesc: "文件输出，如生成的报告或数据文件",
      chartOutputDesc: "图表输出，如折线图、柱状图等",
      tableOutputDesc: "表格数据输出，如数据列表、结果集等",
      defaultOutputDesc: "输出结果的数据类型",
      nameRequired: "名称不能为空",
      nameTooLong: "名称过长",
      nameInvalidFormat: "只能包含字母、数字和下划线，且必须以字母或下划线开头",
      descriptionRequired: "描述不能为空",
      descriptionTooLong: "描述过长",
      outputName: "输出名称",
      enterName: "输入名称",
      outputNameDescription: "用于标识此输出的唯一名称",
      outputType: "输出类型",
      selectType: "选择类型",
      text: "文本",
      number: "数字",
      date: "日期",
      image: "图像",
      file: "文件",
      chart: "图表",
      table: "表格",
      description: "描述",
      descriptionPlaceholder: "描述此输出的内容和用途",
      descriptionHelpText: "帮助用户理解此输出的含义",
      typeHelp: "类型说明",
      chartOutput: "图表输出",
      chartDescription:
        "图表输出将以可视化图表的形式呈现数据，支持以下图表类型：",
    },
  },
};
