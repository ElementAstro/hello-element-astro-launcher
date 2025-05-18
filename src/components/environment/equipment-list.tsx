import { Plus, RefreshCw, Search, Database, Server, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentItem } from "./equipment-item";
import { Equipment } from "./types";
import {
  fadeIn,
  fadeInScale,
  enhancedSkeletonPulse,
  enhancedStaggerChildren,
  bounceItem,
  powerScale
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filter, setFilter] = useState<"all" | "connected" | "disconnected">("all");

  // 当props更新时更新内部状态
  useEffect(() => {
    setCurrentEquipment(equipment);
  }, [equipment]);

  // 筛选设备
  const filteredEquipment = currentEquipment
    .filter(item => {
      if (filter === "all") return true;
      if (filter === "connected") return item.status === "Connected";
      if (filter === "disconnected") return item.status === "Disconnected";
      return true;
    })
    .filter(item => {
      if (!searchQuery) return true;
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // 计算设备统计信息
  const connectedCount = currentEquipment.filter(item => item.status === "Connected").length;
  const deviceTypeCount = new Set(currentEquipment.map(item => item.type)).size;

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
        <div className="backdrop-blur-sm bg-card/80 rounded-lg border shadow-lg p-6 relative overflow-hidden">
          {/* 顶部装饰条 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-blue-500 to-blue-500/40" />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 mr-2">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">设备列表</h3>
            </div>
            <div className="h-9 w-9 rounded-full">
              <motion.div 
                variants={enhancedSkeletonPulse}
                animate="animate"
                className="h-full w-full bg-muted/40 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1">
              <motion.div 
                variants={enhancedSkeletonPulse}
                animate="animate"
                className="h-10 bg-muted/40 rounded-lg"
              />
            </div>
            
            <div className="ml-3 flex space-x-2">
              <motion.div 
                variants={enhancedSkeletonPulse}
                animate="animate"
                className="h-10 w-24 bg-muted/40 rounded-lg"
              />
              <motion.div 
                variants={enhancedSkeletonPulse}
                animate="animate"
                className="h-10 w-10 bg-muted/40 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                variants={enhancedSkeletonPulse}
                animate="animate"
                className="h-24 bg-muted/40 rounded-xl"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={powerScale}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="w-full"
    >
      <div className="backdrop-blur-sm bg-card/80 rounded-lg border shadow-lg p-6 relative overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-blue-500 to-blue-500/40" />
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 mr-2 group-hover:bg-blue-500/20 transition-colors">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">设备列表</h3>
              <div className="flex text-xs text-muted-foreground space-x-3 mt-1">
                <span className="flex items-center">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  已连接: {connectedCount}/{currentEquipment.length}
                </span>
                <span>设备类型: {deviceTypeCount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700 transition-colors"
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
              className="h-9 w-9 rounded-full hover:bg-blue-500/10 transition-colors"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 text-blue-500/80 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">刷新</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索设备名称或类型..."
              className="pl-10 pr-10 border-muted bg-background/50 focus:bg-background focus-visible:ring-blue-500/30 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-500/10"
                onClick={() => setSearchQuery("")}
              >
                <span className="sr-only">清除</span>
                <span aria-hidden="true">×</span>
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="hidden sm:flex p-0.5 border rounded-lg bg-muted/20">
              <Button 
                size="sm"
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
                className="h-9 px-3 rounded-md"
              >
                全部
              </Button>
              <Button
                size="sm"
                variant={filter === "connected" ? "default" : "ghost"}
                onClick={() => setFilter("connected")}
                className="h-9 px-3 rounded-md"
              >
                已连接
              </Button>
              <Button
                size="sm"
                variant={filter === "disconnected" ? "default" : "ghost"}
                onClick={() => setFilter("disconnected")}
                className="h-9 px-3 rounded-md"
              >
                未连接
              </Button>
            </div>
            
            <div className="flex p-0.5 border rounded-lg bg-muted/20">
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-9 w-9 p-0 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/></svg>
                <span className="sr-only">列表视图</span>
              </Button>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-9 w-9 p-0 rounded-md"
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">网格视图</span>
              </Button>
            </div>
          </div>
        </div>

        {filteredEquipment.length > 0 ? (
          <motion.div
            variants={enhancedStaggerChildren}
            initial="initial"
            animate="animate"
            exit="exit"
            className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-4"
            }
          >
            {filteredEquipment.map((item) => (
              <motion.div key={item.id} variants={bounceItem}>                <EquipmentItem 
                  equipment={item} 
                  onUpdate={handleEquipmentUpdate}
                  onRemove={handleEquipmentRemove}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            className="py-16 text-center bg-muted/10 rounded-xl border-2 border-dashed"
          >
            <Database className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground font-medium mb-2">没有找到设备</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "尝试使用不同的搜索关键词或清除过滤条件"
                : "点击添加按钮添加第一个设备"}
            </p>
            {!searchQuery && (
              <Button 
                variant="outline"
                className="border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加设备
              </Button>
            )}
          </motion.div>
        )}
        
        {filteredEquipment.length > 0 && currentEquipment.length > filteredEquipment.length && (
          <div className="mt-4 text-xs text-center text-muted-foreground">
            显示 {filteredEquipment.length} 个设备（共 {currentEquipment.length} 个）
          </div>
        )}
      </div>
    </motion.div>
  );
}
