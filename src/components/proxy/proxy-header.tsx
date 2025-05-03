import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProxyHeaderProps {
  onCreateProxy: () => void;
}

export function ProxyHeader({ onCreateProxy }: ProxyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">代理管理</h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
          管理和配置您的代理服务器，提高网络连接速度与安全性
        </p>
      </div>
      <Button 
        onClick={onCreateProxy} 
        size="sm"
        className="self-start sm:self-center"
        aria-label="添加代理服务器"
      >
        <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
        <span>添加代理</span>
      </Button>
    </div>
  );
}
