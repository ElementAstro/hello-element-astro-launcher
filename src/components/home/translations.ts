/**
 * 首页组件的翻译键
 */
export const homeTranslations = {
  "zh-CN": {
    home: {
      // 英雄部分
      hero: {
        title: "天文软件中心",
        description: "您发现、管理和启动天文和天体摄影软件的一站式平台。",
        launchButton: "启动软件",
        downloadButton: "下载中心",
        loading: "加载中...",
        loadingError: "加载首页数据时出错，请稍后重试",
        retryButton: "重试加载",
        loadError: "加载错误",
      },

      // 分类部分      categories: {
      title: "软件分类",
      description: "按分类浏览软件，找到您需要的内容",
      tabs: {
        imaging: "成像",
        processing: "处理",
        planning: "计划",
        equipment: "设备",
      },
      loadingError: "加载{category}类别数据失败",
      retryButton: "重试加载",
      loadError: "加载错误",

      imaging: {
        deepSpace: {
          title: "深空天体",
          description: "专门用于捕捉星系和星云等深空天体的软件",
        },
        planetary: {
          title: "行星成像",
          description: "专门用于行星、月球和太阳成像的应用程序",
        },
      },
      processing: {
        imageProcessing: {
          title: "图像处理",
          description: "用于处理和增强天文图像的高级工具",
        },
        analysis: {
          title: "数据分析",
          description: "用于天文数据科学分析的软件",
        },
      },
      planning: {
        planetarium: {
          title: "天象馆",
          description: "交互式星图和天体对象数据库",
        },
        sessionPlanning: {
          title: "观测计划",
          description: "用于规划观测和成像会话的工具",
        },
      },
      equipment: {
        telescopeControl: {
          title: "望远镜控制",
          description: "用于控制和自动化望远镜的软件",
        },
        cameraControl: {
          title: "相机控制",
          description: "用于控制天文相机的应用程序",
        },
      },
    },

    // 分类卡片
    categoryCard: {
      software: "软件",
      viewAll: "查看全部",
      explore: "探索",
      launchSoftware: "启动软件",
      retryButton: "重试加载",
    }, // 特色部分
    featured: {
      title: "特色软件",
      description: "发现最流行的天文学和天体摄影应用程序",
      tabs: {
        popular: "热门",
        new: "最新",
        recommended: "推荐",
      },
      loadingError: "加载推荐软件数据时出错",
      retryButton: "重试加载",
      viewAllButton: "查看全部软件",
      loadError: "加载错误",

      software: {
        nina: {
          title: "N.I.N.A",
          description: "天文摄影成像套件 - 用于天文成像的综合软件",
        },
        pixInsight: {
          title: "PixInsight",
          description: "先进的天文摄影图像处理软件",
        },
        stellarium: {
          title: "Stellarium",
          description: "免费开源的电脑天象馆软件",
        },
        asiStudio: {
          title: "ASIStudio",
          description: "ZWO最新的相机控制和图像捕获平台",
        },
        astroPanel: {
          title: "AstroPanel",
          description: "最新的全能天文摄影控制面板",
        },
        deepSkyLab: {
          title: "DeepSkyLab",
          description: "下一代深空图像处理工具",
        },
        phd2: {
          title: "PHD2",
          description: "自动导星软件 - 天文导星的行业标准",
        },
        sharpCap: {
          title: "SharpCap",
          description: "易用且功能强大的天文相机捕获软件",
        },
        astap: {
          title: "ASTAP",
          description: "天文测量和堆叠程序，具有解析能力",
        },
        categories: {
          imaging: "成像",
          processing: "处理",
          planning: "规划",
          control: "控制",
          guiding: "导星",
          capture: "捕获",
          analysis: "分析",
        },
      },
    },

    // 特色软件卡片
    featuredSoftwareCard: {
      downloads: "下载",
      launch: "启动",
      launching: "启动中...",
      viewDetails: "查看详情",
      releaseVersion: "版本：{version}",
      releaseInfo: "最近更新时间",
      rating: "{rating}",
      lastUpdated: "上次更新时间",
    },
  },
  en: {
    home: {
      // 英雄部分
      hero: {
        title: "Astronomy Software Hub",
        description:
          "Your one-stop platform for discovering, managing, and launching astronomy and astrophotography software.",
        launchButton: "Launch Software",
        downloadButton: "Download Center",
        loading: "Loading...",
        loadingError: "Error loading home page data, please try again later",
        retryButton: "Retry Loading",
        loadError: "Loading Error",
      }, // 分类部分
      categories: {
        title: "Software Categories",
        description:
          "Browse software by category to find exactly what you need",
        tabs: {
          imaging: "Imaging",
          processing: "Processing",
          planning: "Planning",
          equipment: "Equipment",
        },
        loadingError: "Failed to load {category} category data",
        retryButton: "Retry Loading",
        loadError: "Loading Error",

        imaging: {
          deepSpace: {
            title: "Deep Space",
            description:
              "Software for capturing deep space objects like galaxies and nebulae",
          },
          planetary: {
            title: "Planetary",
            description:
              "Applications specialized for planetary, lunar, and solar imaging",
          },
        },
        processing: {
          imageProcessing: {
            title: "Image Processing",
            description:
              "Advanced tools for processing and enhancing astronomical images",
          },
          analysis: {
            title: "Analysis",
            description:
              "Software for scientific analysis of astronomical data",
          },
        },
        planning: {
          planetarium: {
            title: "Planetarium",
            description:
              "Interactive star charts and celestial object databases",
          },
          sessionPlanning: {
            title: "Session Planning",
            description: "Tools for planning observation and imaging sessions",
          },
        },
        equipment: {
          telescopeControl: {
            title: "Telescope Control",
            description: "Software for controlling and automating telescopes",
          },
          cameraControl: {
            title: "Camera Control",
            description: "Applications for controlling astronomical cameras",
          },
        },
      },

      // 分类卡片
      categoryCard: {
        software: "Software",
        viewAll: "View All",
        explore: "Explore",
        launchSoftware: "Launch Software",
        retryButton: "Retry Loading",
      }, // 特色部分
      featured: {
        title: "Featured Software",
        description:
          "Discover the most popular astronomy and astrophotography applications",
        tabs: {
          popular: "Popular",
          new: "New",
          recommended: "Recommended",
        },
        loadingError: "Error loading recommended software data",
        retryButton: "Retry Loading",
        viewAllButton: "View All Software",
        loadError: "Loading Error",

        software: {
          nina: {
            title: "N.I.N.A",
            description:
              "NIGHTTIME IMAGING 'N' ASTRONOMY - An astrophotography imaging suite",
          },
          pixInsight: {
            title: "PixInsight",
            description:
              "Advanced image processing software for astrophotography",
          },
          stellarium: {
            title: "Stellarium",
            description: "Free open source planetarium for your computer",
          },
          asiStudio: {
            title: "ASIStudio",
            description: "ZWO's newest imaging and camera control platform",
          },
          astroPanel: {
            title: "AstroPanel",
            description: "The newest all-in-one astrophotography control panel",
          },
          deepSkyLab: {
            title: "DeepSkyLab",
            description: "Next generation deep sky image processing tool",
          },
          phd2: {
            title: "PHD2",
            description:
              "Push Here Dummy autoguiding software - the gold standard for guiding",
          },
          sharpCap: {
            title: "SharpCap",
            description:
              "Easy to use but powerful capture software for astronomy cameras",
          },
          astap: {
            title: "ASTAP",
            description:
              "Astrometric STAcking Program with plate solving capabilities",
          },
          categories: {
            imaging: "Imaging",
            processing: "Processing",
            planning: "Planning",
            control: "Control",
            guiding: "Guiding",
            capture: "Capture",
            analysis: "Analysis",
          },
        },
      },

      // 特色软件卡片
      featuredSoftwareCard: {
        downloads: "Downloads",
        launch: "Launch",
        launching: "Launching...",
        viewDetails: "View Details",
        releaseVersion: "Release: {version}",
        releaseInfo: "Last Updated",
        rating: "{rating}",
        lastUpdated: "Last Updated",
      },
    },
  },
};
