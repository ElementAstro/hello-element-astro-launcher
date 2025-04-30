import { AppLayout } from "@/components/app-layout";
import { AnimatedSkeleton, SkeletonContainer, SkeletonItem } from "@/components/ui/animated-skeleton";
import { motion } from "framer-motion";

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
        <SkeletonContainer className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <SkeletonItem className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <AnimatedSkeleton className="h-12 w-3/4" />
                  <AnimatedSkeleton className="h-4 w-full" />
                  <AnimatedSkeleton className="h-4 w-2/3" />
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <AnimatedSkeleton className="h-10 w-32" />
                  <AnimatedSkeleton className="h-10 w-40" />
                </div>
              </SkeletonItem>
              <SkeletonItem className="flex items-center justify-center">
                <AnimatedSkeleton className="h-[400px] w-[400px] rounded-lg" />
              </SkeletonItem>
            </div>
          </div>
        </SkeletonContainer>

        {/* Featured Software Skeleton */}
        <SkeletonContainer className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <SkeletonItem className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <AnimatedSkeleton className="h-8 w-64 mx-auto" />
                <AnimatedSkeleton className="h-4 w-96 mx-auto" />
              </div>
            </SkeletonItem>
            <SkeletonContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonItem key={i}>
                  <AnimatedSkeleton className="h-64 rounded-lg" />
                </SkeletonItem>
              ))}
            </SkeletonContainer>
            <SkeletonItem className="flex justify-center mt-8">
              <AnimatedSkeleton className="h-10 w-40" />
            </SkeletonItem>
          </div>
        </SkeletonContainer>

        {/* Categories Skeleton */}
        <SkeletonContainer className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <SkeletonItem className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <AnimatedSkeleton className="h-8 w-64 mx-auto" />
                <AnimatedSkeleton className="h-4 w-96 mx-auto" />
              </div>
            </SkeletonItem>

            <SkeletonItem className="mt-8">
              <AnimatedSkeleton className="h-10 w-full mb-6" />
              <SkeletonContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonItem>
                  <AnimatedSkeleton className="h-48 rounded-lg" />
                </SkeletonItem>
                <SkeletonItem>
                  <AnimatedSkeleton className="h-48 rounded-lg" />
                </SkeletonItem>
              </SkeletonContainer>
            </SkeletonItem>
          </div>
        </SkeletonContainer>
      </motion.div>
    </AppLayout>
  );
}
