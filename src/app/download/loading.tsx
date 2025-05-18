"use client";

import { AppLayout } from "@/components/app-layout";
import {
  AnimatedSkeleton,
  SkeletonContainer,
  SkeletonItem,
} from "@/components/ui/animated-skeleton";

export default function DownloadLoading() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <SkeletonContainer className="container py-6 space-y-6">
          <SkeletonItem className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <AnimatedSkeleton className="h-8 w-48" shimmer />
              <AnimatedSkeleton className="h-4 w-64 mt-2" shimmer />
            </div>
            <AnimatedSkeleton className="h-10 w-[300px]" shimmer />
          </SkeletonItem>

          <SkeletonContainer className="space-y-6">
            <SkeletonItem>
              <AnimatedSkeleton className="h-10 w-full" shimmer />
            </SkeletonItem>

            <SkeletonContainer className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonItem key={i}>
                  <AnimatedSkeleton
                    className="h-24 w-full rounded-lg"
                    shimmer
                  />
                </SkeletonItem>
              ))}
            </SkeletonContainer>
          </SkeletonContainer>
        </SkeletonContainer>
      </div>
    </AppLayout>
  );
}
