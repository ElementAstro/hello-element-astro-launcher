import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import { motion } from "framer-motion";

// 定义动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const shimmerVariants = {
  initial: {
    x: "-100%",
    opacity: 0.5,
  },
  animate: {
    x: "100%",
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export default function LauncherLoading() {
  return (
    <AppLayout>
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 搜索栏骨架屏 */}
        <motion.div 
          className="p-4 border-b"
          variants={itemVariants}
        >
          <Skeleton className="h-10 w-full mb-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </Skeleton>
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full md:w-[200px] relative overflow-hidden">
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </Skeleton>
            <div className="flex items-center gap-4 ml-auto">
              <Skeleton className="h-6 w-6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </Skeleton>
              <Skeleton className="h-6 w-6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </Skeleton>
            </div>
          </div>
        </motion.div>

        {/* 标签栏骨架屏 */}
        <motion.div 
          className="px-4 border-b overflow-x-auto"
          variants={itemVariants}
        >
          <div className="h-14 flex gap-2 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </Skeleton>
            ))}
          </div>
        </motion.div>

        {/* 控制栏骨架屏 */}
        <motion.div 
          className="px-4 py-2 border-b"
          variants={itemVariants}
        >
          <Skeleton className="h-8 w-32 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </Skeleton>
        </motion.div>

        {/* 内容区骨架屏 */}
        <motion.div 
          className="flex-1 overflow-y-auto p-4"
          variants={itemVariants}
        >
          <Skeleton className="h-4 w-64 mb-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </Skeleton>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                custom={i}
              >
                <Skeleton className="h-24 w-full rounded-lg relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </Skeleton>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 分页栏骨架屏 */}
        <motion.div 
          className="p-4 border-t flex items-center justify-between"
          variants={itemVariants}
        >
          <Skeleton className="h-9 w-16 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </Skeleton>
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </Skeleton>
            ))}
          </div>
          <Skeleton className="h-9 w-16 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </Skeleton>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
