// 定义工具组件的动画常量

// 动画持续时间
export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

// 动画曲线
export const EASE = {
  gentle: [0.34, 0.98, 0.64, 1],
  bounce: [0.22, 1.2, 0.36, 1],
  smooth: [0.4, 0.0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
};

// 动画变体
export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DURATION.normal, ease: EASE.smooth },
    },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.normal,
        ease: EASE.smooth,
      },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: DURATION.normal,
        ease: EASE.bounce,
      },
    },
  },
  listItem: {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.05,
        duration: DURATION.normal,
        ease: EASE.smooth,
      },
    }),
  },
  progressBar: {
    initial: { width: 0 },
    animate: { width: "100%" },
  },
};

// 动画状态
export const MOTION_STATE = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
};

// 加载动画
export const LOADING_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.fast,
      ease: EASE.smooth,
    },
  },
};
