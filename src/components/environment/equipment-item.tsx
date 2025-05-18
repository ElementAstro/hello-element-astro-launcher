import {
  Battery,
  ChevronRight,
  Power,
  RefreshCcw,
  Settings,
  Trash,
  Monitor,
  Check,
  ClipboardList,
  Clock,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { powerScale, DURATION, EASE } from "./animation-constants";
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
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
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
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-md shadow-green-500/20" />
      ) : (
        <span className="flex h-2 w-2 rounded-full bg-gray-300" />
      ),
      bgColor: isConnected ? "bg-green-500/10" : "bg-muted/10",
      borderColor: isConnected
        ? "border-t-2 border-t-green-500"
        : "border-t-2 border-t-gray-300/50",
      textColor: isConnected ? "text-green-600" : "text-gray-500",
      badgeColor: isConnected
        ? "bg-green-500/20 text-green-700"
        : "bg-muted/30 text-gray-700",
      gradientFrom: isConnected ? "from-green-500/10" : "from-muted/10",
      gradientTo: isConnected ? "to-green-50/5" : "to-background",
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
      console.error(
        `${item.status === "Connected" ? "断开" : "连接"}设备失败:`,
        error
      );
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

      toast.success(`设备 "${item.name}" 已成功删除`);
    } catch (error) {
      console.error("删除设备失败:", error);
      toast.error(`删除设备失败`);
    }
  };

  // 运行设备诊断
  const handleDiagnostics = async () => {
    if (runningDiagnostic) return;

    setRunningDiagnostic(true);
    try {
      const diagnostic = await equipmentApi.runDiagnostics(item.id);

      if (diagnostic.result === "success") {
        toast.success("设备诊断成功", {
          description: "所有系统正常运行",
        });
      } else if (diagnostic.result === "warning") {
        toast.warning("设备诊断发现警告", {
          description: diagnostic.message || "请检查设备状态",
        });
      } else {
        toast.error("设备诊断发现错误", {
          description: diagnostic.message || "请检查设备连接",
        });
      }
    } catch (error) {
      console.error("诊断设备失败:", error);
      toast.error("诊断失败", {
        description: "无法完成设备诊断",
      });
    } finally {
      setRunningDiagnostic(false);
    }
  };

  const statusConfig = getStatusConfig();

  // 电池电量状态颜色
  const getBatteryStatusColor = (level: number) => {
    if (level <= 20) return "text-red-500";
    if (level <= 40) return "text-orange-500";
    return "text-green-500";
  };

  // 电池电量进度条颜色
  const getBatteryProgressColor = (level: number) => {
    if (level <= 20) return "bg-gradient-to-r from-red-600 to-red-400";
    if (level <= 40) return "bg-gradient-to-r from-orange-600 to-orange-400";
    return "bg-gradient-to-r from-green-600 to-green-400";
  };

  return (
    <motion.div
      variants={powerScale}
      whileHover={{
        y: -2,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: DURATION.quick, ease: EASE.gentle }}
      className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
    >
      <div
        className={`bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo} p-4`}
      >
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 p-2 rounded-lg bg-gradient-to-br from-background/80 to-background shadow-sm backdrop-blur-sm`}
            >
              <Monitor className={`h-5 w-5 ${statusConfig.textColor}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4
                  className={`font-medium text-lg ${
                    item.status === "Connected"
                      ? "text-green-700 dark:text-green-400"
                      : ""
                  }`}
                >
                  {item.name}
                </h4>
                <div className="flex items-center">{statusConfig.icon}</div>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs py-0 ${statusConfig.badgeColor} backdrop-blur-sm`}
                >
                  {item.type}
                </Badge>

                <Badge
                  variant="outline"
                  className="text-xs py-0 bg-blue-500/10 text-blue-700 backdrop-blur-sm"
                >
                  {item.driver}
                </Badge>

                {item.status === "Connected" && (
                  <Badge
                    variant="outline"
                    className="text-xs py-0 bg-green-500/10 text-green-700 backdrop-blur-sm"
                  >
                    <Check className="h-2.5 w-2.5 mr-1" /> 已连接
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
                  className={`h-8 w-8 rounded-full shadow-sm backdrop-blur-sm ${
                    item.status === "Connected"
                      ? "text-green-500 bg-green-500/10 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
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
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 shadow-sm backdrop-blur-sm"
                  onClick={handleDiagnostics}
                  disabled={connecting || runningDiagnostic}
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${
                      runningDiagnostic ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{runningDiagnostic ? "诊断中..." : "运行诊断"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 shadow-sm backdrop-blur-sm"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>设备设置</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shadow-sm backdrop-blur-sm"
                  onClick={handleDelete}
                  disabled={connecting}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>删除设备</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {item.status === "Connected" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.normal, ease: EASE.gentle }}
            className="mt-4 pt-4 border-t border-green-200/30 grid grid-cols-2 gap-x-6 gap-y-3 bg-gradient-to-b from-green-50/5 to-transparent rounded-md"
          >
            {item.serialNumber && (
              <div className="flex items-center gap-2 p-1.5 rounded-md backdrop-blur-sm bg-white/5">
                <ClipboardList className="h-3.5 w-3.5 text-green-500" />
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium">
                    序列号:
                  </span>
                  <span className="ml-1 text-green-700 dark:text-green-400">
                    {item.serialNumber}
                  </span>
                </div>
              </div>
            )}

            {item.firmwareVersion && (
              <div className="flex items-center gap-2 p-1.5 rounded-md backdrop-blur-sm bg-white/5">
                <Cpu className="h-3.5 w-3.5 text-blue-500" />
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium">
                    固件版本:
                  </span>
                  <span className="ml-1 text-blue-700 dark:text-blue-400">
                    {item.firmwareVersion}
                  </span>
                </div>
              </div>
            )}

            {item.connectionType && (
              <div className="flex items-center gap-2 p-1.5 rounded-md backdrop-blur-sm bg-white/5">
                <Monitor className="h-3.5 w-3.5 text-purple-500" />
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium">
                    连接方式:
                  </span>
                  <span className="ml-1 text-purple-700 dark:text-purple-400">
                    {item.connectionType}
                  </span>
                </div>
              </div>
            )}

            {item.batteryLevel !== undefined && (
              <div className="flex flex-col gap-1 p-1.5 rounded-md backdrop-blur-sm bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Battery
                      className={`h-3.5 w-3.5 ${getBatteryStatusColor(
                        item.batteryLevel
                      )}`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      电池电量:
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${getBatteryStatusColor(
                      item.batteryLevel
                    )}`}
                  >
                    {item.batteryLevel}%
                  </span>
                </div>{" "}
                <div className="h-1.5 w-full bg-primary/20 overflow-hidden rounded-full">
                  <div
                    className={`h-full transition-all ${getBatteryProgressColor(
                      item.batteryLevel
                    )}`}
                    style={{ width: `${item.batteryLevel}%` }}
                  />
                </div>
              </div>
            )}

            {item.lastConnectionTime && (
              <div className="flex items-center gap-2 p-1.5 col-span-2 rounded-md backdrop-blur-sm bg-white/5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium">
                    上次连接:
                  </span>
                  <span className="ml-1 text-amber-700 dark:text-amber-400">
                    {item.lastConnectionTime}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex justify-end mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-primary bg-card/50 backdrop-blur-sm hover:bg-card/80"
          >
            <span>查看详情</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
