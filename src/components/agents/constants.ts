// Animation variants for agent components
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 加快卡片出现的交错时间
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10, // 减少移动距离
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350, // 增加弹性
      damping: 25,
      duration: 0.2, // 减少动画时间
    },
  },
};
