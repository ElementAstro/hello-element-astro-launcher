import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";

export default function LauncherLoading() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full md:w-[200px]" />
            <div className="flex items-center gap-4 ml-auto">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="px-4 border-b overflow-x-auto">
          <div className="h-14 flex gap-2 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        <div className="px-4 py-2 border-b">
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <Skeleton className="h-9 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </AppLayout>
  );
}
