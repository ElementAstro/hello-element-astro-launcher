import { Battery, ChevronRight, Power, RefreshCcw, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { fadeIn } from "./animation-constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { equipmentApi } from "./equipment-api";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";

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
  const { t } = useTranslations();
  const { equipmentItem } = translationKeys;

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
        item.status === "Connected" 
          ? t(equipmentItem.disconnectSuccess, { params: { name: item.name } }) 
          : t(equipmentItem.connectSuccess, { params: { name: item.name } })
      );
    } catch (error) {
      console.error(`${item.status === "Connected" ? "断开" : "连接"}设备失败:`, error);
      toast.error(
        item.status === "Connected" 
          ? t(equipmentItem.disconnectError)
          : t(equipmentItem.connectError)
      );
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
      toast.error(t(equipmentItem.remove));
    }
  };
  // 运行设备诊断
  const handleDiagnostics = async () => {
    try {
      toast.promise(
        equipmentApi.runDiagnostics(item.id),
        {
          loading: t(equipmentItem.connectSuccess, { params: { name: item.name } }),
          success: (result) => {
            if (result.result === 'success') {
              return t(equipmentItem.connectSuccess, { params: { name: item.name } });
            } else if (result.result === 'warning') {
              return t(equipmentItem.disconnectError, { params: { message: result.message } });
            } else {
              return t(equipmentItem.disconnectError, { params: { message: result.message } });
            }
          },
          error: t(equipmentItem.connectError)
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
          >            <Trash className="h-4 w-4" />
            <span className="sr-only">{t(equipmentItem.remove)}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleDiagnostics}
            disabled={connecting}
          >            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">{t(equipmentItem.diagnostics)}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">{t(equipmentItem.settings)}</span>
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
              {item.status === "Connected" ? t(equipmentItem.disconnect) : t(equipmentItem.connect)}
            </span>
          </Button>          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t(equipmentItem.details)}</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-2">
        {item.status === "Connected" && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
            {item.serialNumber && (
              <div>{t(equipmentItem.serialNumber)}: {item.serialNumber}</div>
            )}
            {item.firmwareVersion && (
              <div>{t(equipmentItem.firmwareVersion)}: {item.firmwareVersion}</div>
            )}
            {item.batteryLevel !== undefined && getBatteryIcon(item.batteryLevel)}
            {item.lastConnectionTime && (
              <div>{t(equipmentItem.lastConnection)}: {item.lastConnectionTime}</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
