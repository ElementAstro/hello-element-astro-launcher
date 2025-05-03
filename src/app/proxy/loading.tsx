import { AppLayout } from "@/components/app-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProxyLoading() {
  return (
    <AppLayout>
      <div className="container px-4 py-4 sm:py-6 max-w-7xl mx-auto">
        {/* 标题和按钮区域 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <Skeleton className="h-8 sm:h-10 w-[180px] sm:w-[250px]" />
          <Skeleton className="h-8 sm:h-10 w-[100px] sm:w-[120px]" />
        </div>

        {/* 搜索和筛选区域 */}
        <div className="flex flex-wrap gap-3 mb-4 sm:mb-6">
          <Skeleton className="h-9 w-full sm:w-[250px]" />
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <Skeleton className="h-9 w-full sm:w-[250px]" />
            <Skeleton className="h-9 w-9 shrink-0" />
          </div>
        </div>

        {/* 代理卡片列表区域 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] sm:h-[180px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
