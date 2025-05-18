import {
  type Variants,
} from "framer-motion";

// 动画时长常量
export const DURATION = {
  quick: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

// 缓动函数常量
export const EASE = {
  gentle: [0.34, 1.16, 0.64, 1],
  bounce: [0.2, 1.3, 0.5, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  linear: [0, 0, 1, 1],
};

// 淡入动画
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.normal } },
  exit: { opacity: 0, transition: { duration: DURATION.quick } },
};

// 缩放淡入动画
export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: DURATION.quick,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 从下向上淡入动画
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 从上向下淡入动画
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 从左向右淡入动画
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 从右向左淡入动画
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 子元素交错动画（用于列表）
export const staggerChildren: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// 展开内容动画（用于折叠面板）
export const expandContent: Variants = {
  initial: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: DURATION.normal,
        ease: EASE.easeOut,
      },
      opacity: {
        duration: DURATION.normal,
        ease: "linear",
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: DURATION.quick,
        ease: EASE.easeIn,
      },
      opacity: {
        duration: DURATION.quick,
        ease: "linear",
      },
    },
  },
};

// 骨架屏脉冲动画
export const skeletonPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// 脉搏动画
export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// 弹性进入动画
export const springIn: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      duration: DURATION.normal,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 进度条动画
export const progressBar: Variants = {
  initial: { width: 0 },
  animate: (width) => ({
    width: `${width}%`,
    transition: {
      duration: DURATION.slow,
      ease: EASE.easeOut,
    },
  }),
};

// 状态指示器动画
export const statusIndicator = {
  connected: {
    scale: [1, 1.2, 1],
    backgroundColor: "rgb(34, 197, 94)",
    boxShadow: [
      "0 0 0 0 rgba(34, 197, 94, 0.4)",
      "0 0 0 6px rgba(34, 197, 94, 0)",
      "0 0 0 0 rgba(34, 197, 94, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
  disconnected: {
    scale: 1,
    backgroundColor: "rgb(239, 68, 68)",
    boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)",
    transition: {
      duration: 0.3,
    },
  },
};

// 项目悬停动画
export const itemHover = {
  whileHover: {
    y: -2,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.quick },
  },
  whileTap: {
    y: 0,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.quick },
  },
};

// 成功动画
export const successAnimation: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

// 闪烁动画
export const blinkAnimation: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// 旋转动画
export const rotateAnimation: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// 卡片悬停动画
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: DURATION.quick,
      ease: EASE.easeOut,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: DURATION.quick,
      ease: EASE.easeOut,
    },
  },
};

// 新增：超强缩放动画
export const powerScale: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: DURATION.quick,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 新增：高级浮动动画
export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-3, 3, -3],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// 新增：渐入式视差效果
export const parallaxFadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  }),
  exit: (custom = 0) => ({
    opacity: 0,
    y: 10,
    transition: {
      delay: custom * 0.1,
      duration: DURATION.quick,
    },
  }),
};

// 新增：高级骨架屏幕脉动动画增强版
export const enhancedSkeletonPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// 新增：3D卡片悬停效果
export const card3DHover = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: {
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: {
      duration: DURATION.normal,
      ease: EASE.gentle,
    },
  },
};

// 新增：高级交错子项目动画
export const enhancedStaggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// 新增：子项目弹跳动画
export const bounceItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: DURATION.quick,
    },
  },
};

// 新增：进度条加载动画
export const progressBarAnimation: Variants = {
  initial: { width: "0%" },
  animate: { 
    width: "100%",
    transition: {
      duration: 1.5,
      ease: EASE.easeOut
    }
  }
};
