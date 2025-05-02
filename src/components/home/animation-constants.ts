import { type Variants } from "framer-motion";

// 动画持续时间常量
export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
};

// 缓动效果
export const EASE = {
  bounce: [0.175, 0.885, 0.32, 1.275], // 弹性效果
  smooth: [0.43, 0.13, 0.23, 0.96], // 平滑过渡
  easeOut: [0, 0, 0.2, 1], // 缓出效果
};

// 卡片动画变体
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: DURATION.fast,
      ease: EASE.smooth,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: DURATION.fast,
      ease: EASE.smooth,
    },
  },
};

// 容器内元素的交错动画
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 淡入上升动画
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
};

// 淡入缩放动画
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
};

// 进度条动画
export const progressBar: Variants = {
  initial: { width: "0%" },
  animate: {
    width: "100%",
    transition: {
      duration: DURATION.slow * 4,
      ease: "linear",
    },
  },
};

// 加载旋转动画
export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: DURATION.normal * 4,
    repeat: Infinity,
    ease: "linear",
  },
};

// 按钮动画变体
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: DURATION.fast,
      ease: EASE.bounce,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASE.bounce,
    },
  },
};
