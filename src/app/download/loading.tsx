import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";

export default function DownloadLoading() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-[300px]" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
