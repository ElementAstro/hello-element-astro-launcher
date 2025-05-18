import {
  RefreshCw,
  Search,
  Server,
  Grid,
  LayoutList,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentItem } from "./equipment-item";
import { Equipment } from "./types";
import {
  enhancedStaggerChildren,
  bounceItem,
  powerScale,
} from "./animation-constants";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { equipmentApi } from "./equipment-api";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EquipmentListProps {
  equipment?: Equipment[];
  isLoading?: boolean;
}

// 优化后的EquipmentList组件，更加紧凑的布局
export function EquipmentList({
  equipment = [],
  isLoading = false,
}: EquipmentListProps) {
  const [items, setItems] = useState<Equipment[]>(equipment);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("");
  const [groupBy, setGroupBy] = useState<"type" | "none">("type");
  const [refreshing, setRefreshing] = useState(false);

  // 当props更新时更新内部状态
  useEffect(() => {
    if (equipment.length) {
      setItems(equipment);
    }
  }, [equipment]);

  // 过滤设备
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.type.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // 分组设备
  const groupedItems = useMemo(() => {
    if (groupBy === "none") {
      return { All: filteredItems };
    }

    return filteredItems.reduce((groups: Record<string, Equipment[]>, item) => {
      const key = item.type || "其他";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [filteredItems, groupBy]);

  // 刷新设备列表
  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      // 使用API获取所有设备
      const updatedEquipment = await equipmentApi.getAllEquipment();
      setItems(updatedEquipment);
      toast.success("设备列表已刷新");
    } catch (error) {
      console.error("获取设备列表失败:", error);
      toast.error("刷新设备列表失败");
    } finally {
      setRefreshing(false);
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
          <CardTitle className="flex items-center text-sm">
            <div className="p-0.5 rounded-md bg-primary/10 text-primary mr-1">
              <Server className="h-3.5 w-3.5" />
            </div>
            设备列表
          </CardTitle>
          <div className="h-6 w-6 bg-muted/40 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-md bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
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
      <Card className="backdrop-blur-sm bg-card/80 border-card/10 shadow-lg overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

        <CardHeader className="py-2 px-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-sm group">
                <div className="p-0.5 rounded-md bg-primary/10 text-primary mr-1 group-hover:bg-primary/20 transition-colors">
                  <Server className="h-3.5 w-3.5" />
                </div>
                设备列表
              </CardTitle>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-primary/10 transition-colors"
                  onClick={() => setView(view === "grid" ? "list" : "grid")}
                >
                  {view === "grid" ? (
                    <LayoutList className="h-3.5 w-3.5" />
                  ) : (
                    <Grid className="h-3.5 w-3.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-primary/10 transition-colors"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Filter className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs">
                      分组方式
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => setGroupBy("type")}
                    >
                      按设备类型分组
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => setGroupBy("none")}
                    >
                      不分组
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="搜索设备..."
                className="pl-8 h-7 text-xs"
              />
              {filter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-7 w-7"
                  onClick={() => setFilter("")}
                >
                  <span className="sr-only">清除</span>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <motion.div
            variants={enhancedStaggerChildren}
            initial="initial"
            animate="animate"
            className="p-3"
          >
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">没有找到设备</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  刷新设备列表
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group} className="space-y-2">
                    {groupBy !== "none" && groupItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="h-px flex-1 bg-border" />
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1.5"
                        >
                          {group}
                        </Badge>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    )}

                    <div
                      className={
                        view === "grid"
                          ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
                          : "space-y-2"
                      }
                    >
                      {groupItems.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          variants={bounceItem}
                          custom={index}
                        >
                          <EquipmentItem equipment={item} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
