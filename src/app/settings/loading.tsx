import { AppLayout } from "@/components/app-layout";
import { AnimatedSkeleton, SkeletonContainer, SkeletonItem } from "@/components/ui/animated-skeleton";

export default function SettingsLoading() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <SkeletonContainer className="container py-6 space-y-6">
          <SkeletonItem className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <AnimatedSkeleton className="h-8 w-48" />
              <AnimatedSkeleton className="h-4 w-64 mt-2" />
            </div>
            <AnimatedSkeleton className="h-10 w-32" />
          </SkeletonItem>

          <SkeletonItem className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <SkeletonContainer className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonItem key={i}>
                    <AnimatedSkeleton className="h-9 w-full" />
                  </SkeletonItem>
                ))}
              </SkeletonContainer>
            </div>

            <SkeletonItem className="flex-1">
              <AnimatedSkeleton className="h-[500px] w-full rounded-lg" />
            </SkeletonItem>
          </SkeletonItem>
        </SkeletonContainer>
      </div>
    </AppLayout>
  );
}
