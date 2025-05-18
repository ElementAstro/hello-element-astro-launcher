import { Battery, ChevronRight, Power, RefreshCcw, Settings, Trash, Monitor, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { bounceItem } from "./animation-constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { equipmentApi } from "./equipment-api";
import { useTranslations } from "@/components/i18n/client";
import { translationKeys } from "./translations";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // 获取状态图标和颜色
  const getStatusConfig = () => {
    const isConnected = item.status === "Connected";
    return {
      icon: isConnected ? (
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      ) : (
        <span className="flex h-2 w-2 rounded-full bg-gray-300" />
      ),
      bgColor: isConnected ? "bg-green-500/5" : "bg-gray-500/5",
      borderColor: isConnected
        ? "border-green-200 dark:border-green-900"
        : "border-gray-200 dark:border-gray-800",
      textColor: isConnected ? "text-green-600" : "text-gray-500",
      badgeColor: isConnected ? "bg-green-500/20 text-green-700" : "bg-gray-500/20 text-gray-700"
    };
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
          loading: t(equipmentItem.runningDiagnostics),
          success: (result) => {
            if (result.result === 'success') {
              return t(equipmentItem.diagnosticsSuccess);
            } else if (result.result === 'warning') {
              return t(equipmentItem.diagnosticsWarning, { params: { message: result.message } });
            } else {
              return t(equipmentItem.diagnosticsError, { params: { message: result.message } });
            }
          },
          error: t(equipmentItem.diagnosticsError, { params: { message: "未知错误" } })
        }
      );
    } catch (error) {
      console.error("诊断设备失败:", error);
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      variants={bounceItem}
      className={`rounded-xl border p-4 shadow-sm transition-all ${statusConfig.bgColor} ${statusConfig.borderColor} hover:shadow-md`}
    >
      <div className="flex justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-lg ${statusConfig.bgColor}`}>
            <Monitor className={`h-5 w-5 ${statusConfig.textColor}`} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-lg">{item.name}</h4>
              <div className="flex items-center">
                {statusConfig.icon}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className={`text-xs py-0 ${statusConfig.badgeColor}`}>
                {item.type}
              </Badge>
              
              <Badge variant="outline" className="text-xs py-0 bg-blue-500/10 text-blue-700">
                {item.driver}
              </Badge>
              
              {item.status === "Connected" && (
                <Badge variant="outline" className="text-xs py-0 bg-green-500/10 text-green-700">
                  已连接
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  item.status === "Connected"
                    ? "text-green-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    : "text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                }`}
                onClick={handleToggleConnection}
                disabled={connecting}
              >
                {connecting ? (
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{item.status === "Connected" ? "断开连接" : "连接设备"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                onClick={handleDiagnostics}
                disabled={connecting}
              >            
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>诊断</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>设置</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={handleDelete}
                disabled={connecting}
              >            
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>删除</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {item.status === "Connected" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t grid grid-cols-2 gap-x-8 gap-y-2"
        >
          {item.serialNumber && (
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs">
                <span className="text-muted-foreground">序列号:</span> {item.serialNumber}
              </div>
            </div>
          )}
          
          {item.firmwareVersion && (
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs">
                <span className="text-muted-foreground">固件版本:</span> {item.firmwareVersion}
              </div>
            </div>
          )}
          
          {item.connectionType && (
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs">
                <span className="text-muted-foreground">连接方式:</span> {item.connectionType}
              </div>
            </div>
          )}
          
          {item.batteryLevel !== undefined && (
            <div className="flex items-center gap-2">
              <Battery className={`h-3 w-3 ${
                item.batteryLevel <= 20
                  ? "text-red-500"
                  : item.batteryLevel <= 40
                  ? "text-orange-500"
                  : "text-green-500"
              }`} />
              <div className="text-xs">
                <span className="text-muted-foreground">电池电量:</span> {item.batteryLevel}%
              </div>
            </div>
          )}
          
          {item.lastConnectionTime && (
            <div className="flex items-center gap-2 col-span-2">
              <Info className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs">
                <span className="text-muted-foreground">上次连接:</span> {item.lastConnectionTime}
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      <div className="flex justify-end mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <span>查看详情</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
