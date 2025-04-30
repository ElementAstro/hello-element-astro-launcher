import { AppLayout } from "@/components/app-layout";
import { AnimatedSkeleton, SkeletonContainer, SkeletonItem } from "@/components/ui/animated-skeleton";

export default function LauncherLoading() {
  return (
    <AppLayout>
      <SkeletonContainer className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Search Bar Skeleton */}
        <SkeletonItem className="p-4 border-b">
          <AnimatedSkeleton className="h-10 w-full mb-4" shimmer />
          <div className="flex flex-col md:flex-row gap-4">
            <AnimatedSkeleton className="h-10 w-full md:w-[200px]" shimmer />
            <div className="flex items-center gap-4 ml-auto">
              <AnimatedSkeleton className="h-6 w-6" shimmer />
              <AnimatedSkeleton className="h-6 w-6" shimmer />
            </div>
          </div>
        </SkeletonItem>

        {/* Tabs Skeleton */}
        <SkeletonItem className="px-4 border-b overflow-x-auto">
          <div className="h-14 flex gap-2 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <AnimatedSkeleton key={i} className="h-10 w-24" shimmer />
            ))}
          </div>
        </SkeletonItem>

        {/* Control Bar Skeleton */}
        <SkeletonItem className="px-4 py-2 border-b">
          <AnimatedSkeleton className="h-8 w-32" shimmer />
        </SkeletonItem>

        {/* Content Area Skeleton */}
        <SkeletonItem className="flex-1 overflow-y-auto p-4">
          <AnimatedSkeleton className="h-4 w-64 mb-4" shimmer />
          <SkeletonContainer className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonItem key={i}>
                <AnimatedSkeleton className="h-24 w-full rounded-lg" shimmer />
              </SkeletonItem>
            ))}
          </SkeletonContainer>
        </SkeletonItem>

        {/* Pagination Bar Skeleton */}
        <SkeletonItem className="p-4 border-t flex items-center justify-between">
          <AnimatedSkeleton className="h-9 w-16" shimmer />
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <AnimatedSkeleton key={i} className="h-8 w-8" shimmer />
            ))}
          </div>
          <AnimatedSkeleton className="h-9 w-16" shimmer />
        </SkeletonItem>
      </SkeletonContainer>
    </AppLayout>
  );
}
