import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
    },
  },
};

const ShimmerSkeleton = ({ className }: { className: string }) => {
  return (
    <motion.div className={className} initial="initial" animate="animate">
      <Skeleton className="h-full w-full" />
    </motion.div>
  );
};

export default function HomeLoading() {
  return (
    <AppLayout>
      <motion.div
        className="flex-1 overflow-auto pb-16 md:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Section Skeleton */}
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                variants={fadeIn}
              >
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-12 w-3/4" />
                  <ShimmerSkeleton className="h-4 w-full" />
                  <ShimmerSkeleton className="h-4 w-2/3" />
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ShimmerSkeleton className="h-10 w-32" />
                  <ShimmerSkeleton className="h-10 w-40" />
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                variants={fadeIn}
              >
                <ShimmerSkeleton className="h-[400px] w-[400px] rounded-lg" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Software Skeleton */}
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeIn}
            >
              <div className="space-y-2">
                <ShimmerSkeleton className="h-8 w-64 mx-auto" />
                <ShimmerSkeleton className="h-4 w-96 mx-auto" />
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={i} variants={fadeIn} custom={i}>
                  <ShimmerSkeleton className="h-64 rounded-lg" />
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="flex justify-center mt-8" variants={fadeIn}>
              <ShimmerSkeleton className="h-10 w-40" />
            </motion.div>
          </div>
        </motion.section>

        {/* Categories Skeleton */}
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeIn}
            >
              <div className="space-y-2">
                <ShimmerSkeleton className="h-8 w-64 mx-auto" />
                <ShimmerSkeleton className="h-4 w-96 mx-auto" />
              </div>
            </motion.div>

            <motion.div className="mt-8" variants={fadeIn}>
              <ShimmerSkeleton className="h-10 w-full mb-6" />
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={fadeIn}>
                  <ShimmerSkeleton className="h-48 rounded-lg" />
                </motion.div>
                <motion.div variants={fadeIn}>
                  <ShimmerSkeleton className="h-48 rounded-lg" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </AppLayout>
  );
}
