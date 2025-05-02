import { Variants } from "framer-motion";

// 动画时间常量，确保整个应用中动画时间一致
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
};

export const ANIMATION_EASING = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
};

// 容器动画
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// 项目动画
export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASING.spring,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: ANIMATION_EASING.easeIn,
    },
  },
  hover: {
    y: -2,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: ANIMATION_EASING.spring,
    },
  },
};

// 进度条动画
export const progressVariants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASING.easeOut,
    },
  }),
};

// 对话框动画
export const dialogVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration: ANIMATION_DURATION.normal,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: ANIMATION_EASING.easeIn,
    },
  },
};

// 搜索框动画
export const searchBarVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      height: {
        duration: ANIMATION_DURATION.normal,
      },
      opacity: {
        duration: ANIMATION_DURATION.normal,
      },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: {
      height: {
        duration: ANIMATION_DURATION.fast,
      },
      opacity: {
        duration: ANIMATION_DURATION.fast,
      },
    },
  },
};

// 标签切换动画
export const tabVariants: Variants = {
  inactive: { color: "#99A1B3", borderColor: "transparent" },
  active: {
    color: "var(--color-primary)",
    borderColor: "var(--color-primary)",
    transition: { duration: ANIMATION_DURATION.normal },
  },
};

// 加载动画
export const loadingVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// 按钮状态变化动画
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// 错误状态动画
export const errorVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: ANIMATION_DURATION.fast },
  },
};

// 空状态动画
export const emptyStateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: ANIMATION_DURATION.slow,
      ease: ANIMATION_EASING.spring,
    },
  },
};
