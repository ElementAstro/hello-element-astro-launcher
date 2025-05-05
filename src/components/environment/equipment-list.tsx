import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentItem } from "./equipment-item";
import { Equipment } from "./types";
import {
  fadeIn,
  fadeInScale,
  skeletonPulse,
  staggerChildren,
} from "./animation-constants";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { equipmentApi } from "./equipment-api";

interface EquipmentListProps {
  equipment?: Equipment[];
  isLoading?: boolean;
}

export function EquipmentList({
  equipment = [],
  isLoading = false,
}: EquipmentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment[]>(equipment);
  const [connecting, setConnecting] = useState(false);

  // 当props更新时更新内部状态
  useEffect(() => {
    setCurrentEquipment(equipment);
  }, [equipment]);

  // 筛选设备
  const filteredEquipment = searchQuery
    ? currentEquipment.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentEquipment;

  // 刷新设备列表
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      const updatedEquipment = await equipmentApi.getAllEquipment();
      setCurrentEquipment(updatedEquipment);
      toast.success("设备列表已更新");
    } catch (error) {
      console.error("刷新设备列表失败:", error);
      toast.error("刷新设备列表失败");
    } finally {
      setRefreshing(false);
    }
  };

  // 连接所有设备
  const handleConnectAll = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      const result = await equipmentApi.connectAllEquipment();
      
      if (result.success) {
        // 刷新设备列表以获取最新状态
        const updatedEquipment = await equipmentApi.getAllEquipment();
        setCurrentEquipment(updatedEquipment);
        
        toast.success(`已连接 ${result.connectedCount} 个设备`);
      } else {
        toast.warning(`连接部分设备失败: ${result.message}`);
      }
    } catch (error) {
      console.error("连接所有设备失败:", error);
      toast.error("连接设备失败");
    } finally {
      setConnecting(false);
    }
  };

  // 当单个设备状态更新后的回调
  const handleEquipmentUpdate = (updatedEquipment: Equipment) => {
    setCurrentEquipment(prev => 
      prev.map(item => 
        item.id === updatedEquipment.id ? updatedEquipment : item
      )
    );
  };

  // 当设备被删除后的回调
  const handleEquipmentRemove = (removedId: number) => {
    setCurrentEquipment(prev => prev.filter(item => item.id !== removedId));
    toast.success("设备已移除");
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">设备列表</h3>
            <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
          </div>

          <div className="flex items-center mb-4 animate-pulse">
            <div className="h-10 bg-muted/40 rounded flex-1" />
            <div className="h-10 w-10 bg-muted/40 rounded ml-2" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonPulse}
                className="h-24 bg-muted/40 rounded-lg"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeIn} className="w-full">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">设备列表</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleConnectAll}
              disabled={connecting}
            >
              {connecting ? (
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5 mr-1.5" />
              )}
              {connecting ? "连接中..." : "全部连接"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">刷新</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索设备..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setSearchQuery("")}
              >
                <span className="sr-only">清除</span>
                <span aria-hidden="true">×</span>
              </Button>
            )}
          </div>
        </div>

        {filteredEquipment.length > 0 ? (
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredEquipment.map((item) => (
              <motion.div key={item.id} variants={fadeInScale}>
                <EquipmentItem 
                  equipment={item} 
                  onUpdate={handleEquipmentUpdate}
                  onRemove={handleEquipmentRemove}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-2">没有找到设备</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "尝试不同的搜索关键词"
                : "点击添加按钮添加第一个设备"}
            </p>
            {!searchQuery && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                添加设备
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
