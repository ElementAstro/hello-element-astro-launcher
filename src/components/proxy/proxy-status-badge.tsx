import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        running: "bg-green-100 text-green-700",
        idle: "bg-amber-100 text-amber-700",
        error: "bg-red-100 text-red-700",
        default: "bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ProxyStatusBadgeProps
  extends VariantProps<typeof statusBadgeVariants> {
  status: "running" | "idle" | "error";
  className?: string;
}

export function ProxyStatusBadge({ status, className }: ProxyStatusBadgeProps) {
  const statusLabels = {
    running: "运行中",
    idle: "空闲",
    error: "错误",
  };

  return (
    <span
      className={cn(
        statusBadgeVariants({
          variant: status,
        }),
        className
      )}
    >
      <span className="mr-1">
        <span
          className={cn("inline-block h-1.5 w-1.5 rounded-full", {
            "bg-green-600": status === "running",
            "bg-amber-600": status === "idle",
            "bg-red-600": status === "error",
          })}
        />
      </span>
      {statusLabels[status]}
    </span>
  );
}
