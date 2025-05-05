import { Battery, ChevronRight, Power, RefreshCcw, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { fadeIn } from "./animation-constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { equipmentApi } from "./equipment-api";

interface EquipmentItemProps {
  equipment: Equipment;
  onUpdate?: (updatedEquipment: Equipment) => void;
  onRemove?: (id: number) => void;
}

export function EquipmentItem({
  equipment,
  onUpdate,
  onRemove,
}: EquipmentItemProps) {
  const [connecting, setConnecting] = useState(false);
  const [item, setItem] = useState<Equipment>(equipment);

  // 当props更新时更新内部状态
  useEffect(() => {
    setItem(equipment);
  }, [equipment]);

  // 获取电池图标
  const getBatteryIcon = (batteryLevel?: number) => {
    if (batteryLevel === undefined || batteryLevel === null) return null;
    return (
      <div className="flex items-center gap-1 text-xs">
        <Battery
          className={`h-3.5 w-3.5 ${
            batteryLevel <= 20
              ? "text-red-500"
              : batteryLevel <= 40
              ? "text-orange-500"
              : "text-green-500"
          }`}
        />
        <span
          className={`${
            batteryLevel <= 20 ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {batteryLevel}%
        </span>
      </div>
    );
  };

  // 连接/断开设备
  const handleToggleConnection = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      let updatedEquipment: Equipment;
      
      if (item.status === "Connected") {
        // 断开连接
        await equipmentApi.disconnectEquipment(item.id);
        updatedEquipment = { ...item, status: "Disconnected" };
      } else {
        // 连接设备
        updatedEquipment = await equipmentApi.connectEquipment(item.id);
      }
      
      setItem(updatedEquipment);
      
      // 通知父组件更新
      if (onUpdate) {
        onUpdate(updatedEquipment);
      }
      
      toast.success(
        item.status === "Connected" ? `已断开 ${item.name} 连接` : `已连接到 ${item.name}`
      );
    } catch (error) {
      console.error(`${item.status === "Connected" ? "断开" : "连接"}设备失败:`, error);
      toast.error(`${item.status === "Connected" ? "断开" : "连接"}设备失败`);
    } finally {
      setConnecting(false);
    }
  };

  // 删除设备
  const handleDelete = async () => {
    if (connecting) return;
    
    try {
      await equipmentApi.deleteEquipment(item.id);
      
      // 通知父组件删除
      if (onRemove) {
        onRemove(item.id);
      }
    } catch (error) {
      console.error("删除设备失败:", error);
      toast.error("删除设备失败");
    }
  };

  // 运行设备诊断
  const handleDiagnostics = async () => {
    try {
      toast.promise(
        equipmentApi.runDiagnostics(item.id),
        {
          loading: `正在对 ${item.name} 进行诊断...`,
          success: (result) => {
            if (result.result === 'success') {
              return `诊断完成: ${item.name} 工作正常`;
            } else if (result.result === 'warning') {
              return `诊断发现警告: ${result.message}`;
            } else {
              return `诊断发现错误: ${result.message}`;
            }
          },
          error: "诊断失败，请重试"
        }
      );
    } catch (error) {
      console.error("诊断设备失败:", error);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      className={`rounded-lg border p-4 ${
        item.status === "Connected"
          ? "border-green-200 dark:border-green-900"
          : "border-muted"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <h4 className="font-semibold">{item.name}</h4>
            {item.status === "Connected" && (
              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{item.type}</div>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleDelete}
            disabled={connecting}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">删除</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleDiagnostics}
            disabled={connecting}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">诊断</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">设置</span>
          </Button>
          
          <Button
            variant={item.status === "Connected" ? "ghost" : "outline"}
            size="icon"
            className={`h-8 w-8 ${
              item.status === "Connected"
                ? "text-green-500 hover:text-red-500"
                : "text-muted-foreground"
            }`}
            onClick={handleToggleConnection}
            disabled={connecting}
          >
            {connecting ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Power className="h-4 w-4" />
            )}
            <span className="sr-only">
              {item.status === "Connected" ? "断开" : "连接"}
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">详情</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-2">
        {item.status === "Connected" && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
            {item.serialNumber && (
              <div>序列号: {item.serialNumber}</div>
            )}
            {item.firmwareVersion && (
              <div>固件版本: {item.firmwareVersion}</div>
            )}
            {item.batteryLevel !== undefined && getBatteryIcon(item.batteryLevel)}
            {item.lastConnectionTime && (
              <div>上次连接: {item.lastConnectionTime}</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
