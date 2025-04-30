import {
  Database,
  MoreHorizontal,
  Loader2,
  Plus,
  Share2,
  Save,
  Edit,
  Copy,
  Trash,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EquipmentProfile } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInScale,
  staggerChildren,
  expandContent,
  DURATION,
} from "./animation-constants";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shouldReduceMotion } from "@/lib/utils";

interface EquipmentProfilesCardProps {
  profiles: EquipmentProfile[];
  isLoading?: boolean;
}

export function EquipmentProfilesCard({
  profiles,
  isLoading = false,
}: EquipmentProfilesCardProps) {
  const [activeProfile, setActiveProfile] = useState<EquipmentProfile | null>(
    null
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EquipmentProfile>({
    name: "",
    description: "",
  });
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});
  const [loadedProfile, setLoadedProfile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 处理加载配置文件
  const handleLoadProfile = async (profile: EquipmentProfile) => {
    // 设置加载状态
    setLoadingState((prev) => ({ ...prev, [profile.name]: true }));
    setError(null);

    try {
      // 模拟加载操作
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 随机模拟加载成功或失败
      if (Math.random() > 0.2) {
        setLoadedProfile(profile.name);
        toast.success(`已加载配置: ${profile.name}`, {
          description: `成功应用设备配置 ${profile.description}`,
        });
      } else {
        throw new Error("无法加载设备配置，请确保所有需要的设备已连接");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      setError(errorMessage);
      toast.error(`加载配置失败: ${errorMessage}`);
    } finally {
      // 重置加载状态
      setTimeout(() => {
        setLoadingState((prev) => ({ ...prev, [profile.name]: false }));
      }, 300);
    }
  };

  // 处理编辑配置
  const handleEditProfile = (profile: EquipmentProfile) => {
    setActiveProfile(profile);
    setEditedProfile({ ...profile });
    setShowEditDialog(true);
  };

  // 处理删除配置
  const handleDeleteProfile = (profile: EquipmentProfile) => {
    setActiveProfile(profile);
    setShowDeleteDialog(true);
  };

  // 处理保存当前设置为新配置
  const handleSaveCurrentSetup = () => {
    setEditedProfile({ name: "", description: "" });
    setShowCreateDialog(true);
  };

  // 处理保存编辑后的配置
  const handleSaveEdit = () => {
    if (!editedProfile.name.trim()) {
      toast.error("配置名称不能为空");
      return;
    }

    toast.success("配置已更新", {
      description: `已成功更新配置: ${editedProfile.name}`,
    });

    setShowEditDialog(false);
    setActiveProfile(null);
  };

  // 处理创建新配置
  const handleCreateProfile = () => {
    if (!editedProfile.name.trim()) {
      toast.error("配置名称不能为空");
      return;
    }

    toast.success("配置已创建", {
      description: `已成功创建新配置: ${editedProfile.name}`,
      action: {
        label: "查看",
        onClick: () => {
          // 可以滚动到新创建的配置
        },
      },
    });

    setShowCreateDialog(false);
  };

  // 处理确认删除
  const handleConfirmDelete = () => {
    if (!activeProfile) return;

    toast.success("配置已删除", {
      description: `已删除配置: ${activeProfile.name}`,
      action: {
        label: "撤销",
        onClick: () => {
          toast.info("已撤销删除");
        },
      },
    });

    setShowDeleteDialog(false);
    setActiveProfile(null);
  };

  // 渲染骨架屏加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              设备配置
            </CardTitle>
            <CardDescription>保存和加载设备配置</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 bg-muted/40 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-10 w-32 bg-muted/40 rounded animate-pulse" />
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // 渲染空状态
  if (profiles.length === 0) {
    return (
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              设备配置
            </CardTitle>
            <CardDescription>保存和加载设备配置</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal }}
              className="space-y-3"
            >
              <Database className="h-16 w-16 text-muted-foreground mb-4 opacity-50 mx-auto" />
              <h3 className="text-lg font-medium">尚无设备配置</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                通过保存当前的设备设置来创建您的第一个设备配置。这样您就可以快速切换不同的设备组合。
              </p>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleSaveCurrentSetup}>
              <Plus className="h-4 w-4 mr-2" />
              保存当前设置
            </Button>
          </CardFooter>
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
              <Database className="h-5 w-5 mr-2" />
              设备配置
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setLoadedProfile(null);
                    toast.success("已重置设备配置");
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>重置为默认配置</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>保存和加载设备配置</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                variants={expandContent}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-4"
              >
                <Alert
                  variant="destructive"
                  className="bg-red-500/10 border-red-500/30"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>加载错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerChildren} className="space-y-4">
            {profiles.map((profile, index) => (
              <motion.div
                key={index}
                variants={fadeInScale}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={{ scale: shouldReduceMotion() ? 1 : 1.01 }}
                whileTap={{ scale: shouldReduceMotion() ? 1 : 0.99 }}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  loadedProfile === profile.name
                    ? "border-primary bg-primary/5"
                    : ""
                } transition-colors`}
              >
                <div className="flex items-start gap-3">
                  {loadedProfile === profile.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-primary mt-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.div>
                  )}
                  <div>
                    <h4 className="font-medium">{profile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadProfile(profile)}
                    disabled={
                      loadingState[profile.name] ||
                      loadedProfile === profile.name
                    }
                  >
                    {loadingState[profile.name] ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        加载中
                      </>
                    ) : loadedProfile === profile.name ? (
                      "已加载"
                    ) : (
                      "加载"
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditProfile(profile)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast.success("配置已复制");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteProfile(profile)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveCurrentSetup}>
            <Save className="h-4 w-4 mr-2" />
            保存当前设置
          </Button>
        </CardFooter>
      </Card>

      {/* 编辑配置对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑配置</DialogTitle>
            <DialogDescription>修改现有设备配置的详细信息</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">配置名称</Label>
              <Input
                id="name"
                placeholder="输入配置名称"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                placeholder="输入配置描述"
                value={editedProfile.description}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 创建新配置对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>保存为新配置</DialogTitle>
            <DialogDescription>
              保存当前设备设置为可重复使用的配置
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">配置名称</Label>
              <Input
                id="new-name"
                placeholder="输入配置名称"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">描述</Label>
              <Textarea
                id="new-description"
                placeholder="简要描述此配置的用途"
                value={editedProfile.description}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              取消
            </Button>
            <Button onClick={handleCreateProfile}>创建配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>删除配置</DialogTitle>
            <DialogDescription>
              {activeProfile
                ? `确定要删除 "${activeProfile.name}" 配置吗？此操作无法撤销。`
                : "确定要删除此配置吗？此操作无法撤销。"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/30"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>警告</AlertTitle>
              <AlertDescription>
                删除后将无法恢复此配置。请确认您的操作。
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
