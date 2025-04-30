// 定义常量以确保动画时间一致
export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  extraSlow: 0.8,
};

export const EASE = {
  smooth: [0.4, 0.0, 0.2, 1], // 平滑的过渡效果，类似 Material Design 中的标准曲线
  bounce: [0.175, 0.885, 0.32, 1.275], // 弹跳效果，适合吸引注意力
  decelerate: [0, 0, 0.2, 1], // 减速效果，适合元素进入
  accelerate: [0.4, 0, 1, 1], // 加速效果，适合元素离开
};

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.decelerate },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.fast, ease: EASE.smooth },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.fast, ease: EASE.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: DURATION.normal, ease: EASE.accelerate },
  },
};

export const progressVariants = {
  start: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: DURATION.slow, ease: EASE.smooth },
  }),
  indeterminate: {
    width: ["0%", "30%", "70%", "100%"],
    left: ["-20%", "100%", "100%", "100%"],
    transition: {
      width: { duration: 1.5, ease: "easeInOut" },
      left: { duration: 1.5, ease: "easeInOut" },
      repeat: Infinity,
    },
  },
  paused: {
    opacity: [1, 0.6, 1],
    transition: {
      opacity: { duration: 2, repeat: Infinity },
    },
  },
  error: {
    opacity: [1, 0.6, 1],
    backgroundColor: "rgb(239, 68, 68)",
    transition: {
      opacity: { duration: 2, repeat: Infinity },
    },
  },
};

export const downloadListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

export const iconVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE.bounce } 
  },
  success: {
    scale: [1, 1.3, 1],
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE.bounce }
  },
  error: {
    rotate: [0, 5, -5, 5, -5, 0],
    transition: { duration: DURATION.slow }
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: { repeat: Infinity, duration: 1.5 }
  }
};

export const importDialogVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE.decelerate } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: DURATION.fast, ease: EASE.accelerate } 
  }
};

export const notificationVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.bounce }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: DURATION.fast }
  }
};

// 滑动动画，用于列表项移除效果
export const slideOutVariants = {
  initial: { x: 0, opacity: 1 },
  exit: { 
    x: "100%", 
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASE.accelerate } 
  }
};

// 载入动画
export const loadingVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.fast } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.fast } 
  }
};