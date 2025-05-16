import { AppLayout } from "@/components/app-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProxyLoading() {
  return (
    <AppLayout>
      <div className="container max-w-[1600px] py-3 px-3 sm:px-4 space-y-2">
        {/* 标题和按钮区域 */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>

        {/* 搜索和筛选区域 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[180px]" />
          <div className="flex items-center gap-2 ml-auto">
            <Skeleton className="h-8 w-[240px]" />
            <Skeleton className="h-8 w-8 shrink-0" />
          </div>
        </div>

        {/* 代理卡片列表区域 */}        <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[105px] w-full rounded-md" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
