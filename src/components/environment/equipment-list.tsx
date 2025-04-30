import {
  AlertTriangle,
  HardDrive,
  Layers,
  Loader2,
  Monitor,
  Plus,
  PowerOff,
  RefreshCw,
  Search,
  Settings,
  Telescope,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { EquipmentItem } from "./equipment-item";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  staggerChildren,
  skeletonPulse,
  expandContent,
  DURATION,
} from "./animation-constants";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { shouldReduceMotion } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EquipmentListProps {
  equipment: Equipment[];
  isLoading?: boolean;
}

type EquipmentByType = Record<string, Equipment[]>;

export function EquipmentList({
  equipment,
  isLoading = false,
}: EquipmentListProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "telescopes"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEquipment, setFilteredEquipment] =
    useState<Equipment[]>(equipment);
  const [groupedEquipment, setGroupedEquipment] = useState<EquipmentByType>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [connectingAll, setConnectingAll] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    Record<number, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);

  // 对设备进行过滤和分组
  useEffect(() => {
    if (isLoading) return;

    try {
      // 首先根据搜索关键词过滤设备
      const filtered = searchQuery
        ? equipment.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.driver.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : equipment;

      setFilteredEquipment(filtered);

      // 然后按类型分组
      const grouped = filtered.reduce((acc, item) => {
        const type = item.type.toLowerCase().includes("camera")
          ? "cameras"
          : item.type.toLowerCase().includes("mount") ||
            item.type.toLowerCase().includes("telescope")
          ? "telescopes"
          : item.type.toLowerCase().includes("focuser") ||
            item.type.toLowerCase().includes("filter")
          ? "focusers"
          : "other";

        if (!acc[type]) {
          acc[type] = [];
        }

        acc[type].push(item);
        return acc;
      }, {} as EquipmentByType);

      setGroupedEquipment(grouped);

      // 如果当前展开的分类中没有设备，自动切换到有设备的分类
      if (expandedCategory && grouped[expandedCategory]?.length === 0) {
        const categoriesWithItems = Object.keys(grouped).filter(
          (key) => grouped[key]?.length > 0
        );
        if (categoriesWithItems.length > 0) {
          setExpandedCategory(categoriesWithItems[0]);
        }
      }
    } catch (err) {
      console.error("Error filtering equipment:", err);
      setError("处理设备数据时出错");
    }
  }, [equipment, searchQuery, isLoading, expandedCategory]);

  // 处理连接所有设备
  const handleConnectAll = async () => {
    if (connectingAll) return;

    const disconnectedEquipment = filteredEquipment.filter(
      (item) => item.status === "Disconnected"
    );
    if (disconnectedEquipment.length === 0) {
      toast.info("所有设备已连接");
      return;
    }

    setConnectingAll(true);
    setConnectionProgress(0);

    try {
      // 重置连接状态
      setConnectionStatus({});

      for (let i = 0; i < disconnectedEquipment.length; i++) {
        const item = disconnectedEquipment[i];

        // 更新进度
        const progress = Math.round(
          ((i + 1) / disconnectedEquipment.length) * 100
        );
        setConnectionProgress(progress);

        // 模拟连接逻辑
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            // 80% 的概率连接成功
            if (Math.random() > 0.2) {
              setConnectionStatus((prev) => ({ ...prev, [item.id]: true }));
              resolve();
            } else {
              setConnectionStatus((prev) => ({ ...prev, [item.id]: false }));
              // 失败但继续处理其他设备，不中断流程
              resolve();
            }
          }, 800);
        });
      }

      const successCount = Object.values(connectionStatus).filter(
        (status) => status
      ).length;
      const failureCount = Object.values(connectionStatus).filter(
        (status) => !status
      ).length;

      if (failureCount === 0) {
        toast.success(`已成功连接所有 ${successCount} 个设备`);
      } else if (successCount === 0) {
        toast.error("所有设备连接均失败，请检查连接设置");
      } else {
        toast.warning(
          `已连接 ${successCount} 个设备，${failureCount} 个连接失败`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "连接过程中出错";
      setError(errorMessage);
      toast.error(`连接失败: ${errorMessage}`);
    } finally {
      setConnectingAll(false);
      // 短暂延迟后重置进度条
      setTimeout(() => setConnectionProgress(0), 1000);
    }
  };

  // 空状态 - 没有设备
  if (!isLoading && filteredEquipment.length === 0 && !searchQuery) {
    return (
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Telescope className="h-5 w-5 mr-2" />
              天文设备
            </CardTitle>
            <CardDescription>管理您的天文设备和连接</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal }}
              className="space-y-3"
            >
              <Telescope className="h-16 w-16 text-muted-foreground opacity-50 mx-auto" />
              <h3 className="text-lg font-medium">未发现设备</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                尚未添加任何天文设备。点击下方按钮添加您的第一个设备。
              </p>
              <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                添加设备
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // 搜索无结果状态
  if (!isLoading && filteredEquipment.length === 0 && searchQuery) {
    return (
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Telescope className="h-5 w-5 mr-2" />
              天文设备
            </CardTitle>
            <CardDescription>管理您的天文设备和连接</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-12"
                placeholder="搜索设备..."
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal }}
                className="space-y-3"
              >
                <Search className="h-12 w-12 text-muted-foreground opacity-50 mx-auto" />
                <h3 className="text-lg font-medium">未找到匹配的设备</h3>
                <p className="text-sm text-muted-foreground">
                  没有找到与 &quot;{searchQuery}&quot;
                  匹配的设备。请尝试其他搜索词或清除搜索。
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  清除搜索
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Telescope className="h-5 w-5 mr-2" />
              天文设备
            </div>
            {!isLoading && (
              <Badge variant="outline">{filteredEquipment.length} 个设备</Badge>
            )}
          </CardTitle>
          <CardDescription>管理您的天文设备和连接</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 搜索框 */}
          {!isLoading && (
            <motion.div
              className="relative mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                placeholder="搜索设备..."
              />
            </motion.div>
          )}

          <ScrollArea className="max-h-[400px] pr-3">
            <AnimatePresence>
              {isLoading ? (
                // 加载状态
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {Array.from({ length: 3 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      variants={skeletonPulse}
                      className="h-12 rounded-lg bg-muted/50"
                    />
                  ))}
                </motion.div>
              ) : error ? (
                // 错误状态
                <motion.div
                  variants={expandContent}
                  initial="initial"
                  animate="animate"
                  className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 rounded-lg text-center"
                >
                  <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    加载设备失败
                  </h3>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setError(null)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重试
                  </Button>
                </motion.div>
              ) : (
                // 设备列表
                <Accordion
                  type="single"
                  collapsible
                  value={expandedCategory || undefined}
                  onValueChange={(value) => setExpandedCategory(value)}
                  className="w-full"
                >
                  <AccordionItem value="telescopes">
                    <motion.div
                      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Telescope className="h-4 w-4 mr-2" />
                          望远镜和赤道仪
                          <Badge variant="outline" className="ml-2">
                            {groupedEquipment.telescopes?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                    </motion.div>
                    <AccordionContent>
                      <AnimatePresence>
                        {groupedEquipment.telescopes?.length ? (
                          <motion.div
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-4"
                          >
                            {groupedEquipment.telescopes?.map((item) => (
                              <EquipmentItem
                                key={item.id}
                                name={item.name}
                                type={item.type}
                                status={item.status}
                                driver={item.driver}
                                details={item.details}
                                lastConnected={item.lastConnected}
                                connectionType={item.connectionType}
                                firmwareVersion={item.firmwareVersion}
                                onConnect={async () => {
                                  return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                      if (Math.random() > 0.2) {
                                        resolve();
                                      } else {
                                        reject(new Error("无法连接到设备"));
                                      }
                                    }, 1500);
                                  });
                                }}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-2 text-center text-sm text-muted-foreground"
                          >
                            没有望远镜或赤道仪设备
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cameras">
                    <motion.div
                      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          相机
                          <Badge variant="outline" className="ml-2">
                            {groupedEquipment.cameras?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                    </motion.div>
                    <AccordionContent>
                      <AnimatePresence>
                        {groupedEquipment.cameras?.length ? (
                          <motion.div
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-4"
                          >
                            {groupedEquipment.cameras?.map((item) => (
                              <EquipmentItem
                                key={item.id}
                                name={item.name}
                                type={item.type}
                                status={item.status}
                                driver={item.driver}
                                details={item.details}
                                lastConnected={item.lastConnected}
                                connectionType={item.connectionType}
                                firmwareVersion={item.firmwareVersion}
                                onConnect={async () => {
                                  return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                      if (Math.random() > 0.2) {
                                        resolve();
                                      } else {
                                        reject(new Error("无法连接到相机"));
                                      }
                                    }, 1500);
                                  });
                                }}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-2 text-center text-sm text-muted-foreground"
                          >
                            没有相机设备
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="focusers">
                    <motion.div
                      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2" />
                          调焦器和滤镜轮
                          <Badge variant="outline" className="ml-2">
                            {groupedEquipment.focusers?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                    </motion.div>
                    <AccordionContent>
                      <AnimatePresence>
                        {groupedEquipment.focusers?.length ? (
                          <motion.div
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-4"
                          >
                            {groupedEquipment.focusers?.map((item) => (
                              <EquipmentItem
                                key={item.id}
                                name={item.name}
                                type={item.type}
                                status={item.status}
                                driver={item.driver}
                                details={item.details}
                                lastConnected={item.lastConnected}
                                connectionType={item.connectionType}
                                firmwareVersion={item.firmwareVersion}
                                onConnect={async () => {
                                  return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                      if (Math.random() > 0.2) {
                                        resolve();
                                      } else {
                                        reject(new Error("无法连接到设备"));
                                      }
                                    }, 1500);
                                  });
                                }}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-2 text-center text-sm text-muted-foreground"
                          >
                            没有调焦器或滤镜轮
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="other">
                    <motion.div
                      whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 mr-2" />
                          其他设备
                          <Badge variant="outline" className="ml-2">
                            {groupedEquipment.other?.length || 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                    </motion.div>
                    <AccordionContent>
                      <AnimatePresence>
                        {groupedEquipment.other?.length ? (
                          <motion.div
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-4"
                          >
                            {groupedEquipment.other?.map((item) => (
                              <EquipmentItem
                                key={item.id}
                                name={item.name}
                                type={item.type}
                                status={item.status}
                                driver={item.driver}
                                details={item.details}
                                lastConnected={item.lastConnected}
                                connectionType={item.connectionType}
                                firmwareVersion={item.firmwareVersion}
                                onConnect={async () => {
                                  return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                      if (Math.random() > 0.2) {
                                        resolve();
                                      } else {
                                        reject(new Error("无法连接到设备"));
                                      }
                                    }, 1500);
                                  });
                                }}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-2 text-center text-sm text-muted-foreground"
                          >
                            没有其他设备
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加设备
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>添加新的天文设备</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative w-full sm:w-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleConnectAll}
                  disabled={
                    isLoading ||
                    connectingAll ||
                    filteredEquipment.filter((e) => e.status === "Disconnected")
                      .length === 0
                  }
                >
                  {connectingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      连接中...
                    </>
                  ) : (
                    <>
                      <PowerOff className="h-4 w-4 mr-2" />
                      连接全部
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>连接所有已断开的设备</p>
              </TooltipContent>
            </Tooltip>

            {/* 进度条 */}
            <AnimatePresence>
              {connectingAll && connectionProgress > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 h-1 bg-primary/50 rounded-full"
                  style={{ width: `${connectionProgress}%` }}
                />
              )}
            </AnimatePresence>
          </div>
        </CardFooter>
      </Card>

      {/* 添加设备对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>添加新设备</DialogTitle>
            <DialogDescription>
              添加新的天文设备到您的设备集合中
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2"
            >
              <Telescope className="h-10 w-10 mb-2 text-primary" />
              <span>望远镜</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2"
            >
              <Monitor className="h-10 w-10 mb-2 text-primary" />
              <span>相机</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2"
            >
              <Layers className="h-10 w-10 mb-2 text-primary" />
              <span>调焦器</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2"
            >
              <Settings className="h-10 w-10 mb-2 text-primary" />
              <span>滤镜轮</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                toast.success("设备添加功能即将推出");
                setShowAddDialog(false);
              }}
            >
              继续
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
