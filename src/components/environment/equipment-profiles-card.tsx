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
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInScale,
  staggerChildren,
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
import { profilesApi } from "./profiles-api";

interface EquipmentProfilesCardProps {
  profiles: EquipmentProfile[];
  isLoading?: boolean;
}

export function EquipmentProfilesCard({
  profiles,
  isLoading = false,
}: EquipmentProfilesCardProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<EquipmentProfile | null>(null);
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
  });
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // 加载配置文件
  const handleLoadProfile = async (profile: EquipmentProfile) => {
    if (loadingProfile) return;

    setSelectedProfile(profile);
    setShowLoadDialog(true);
    setLoadingProfile(true);

    try {
      const result = await profilesApi.loadProfile(profile.name);
      if (result.success) {
        toast.success(`已加载配置 "${profile.name}"`);
        setShowLoadDialog(false);
      } else {
        throw new Error("加载失败");
      }
    } catch (err) {
      console.error("加载配置文件失败:", err);
      toast.error("加载配置失败", {
        description: err instanceof Error ? err.message : "请再次尝试",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // 创建新配置文件
  const handleCreateProfile = async () => {
    if (!newProfile.name.trim()) {
      toast.error("请输入配置文件名称");
      return;
    }

    if (creating) return;
    setCreating(true);

    try {
      await profilesApi.saveCurrentSetup(
        newProfile.name.trim(),
        newProfile.description.trim()
      );
      toast.success("配置文件已保存");
      setShowCreateDialog(false);
      setNewProfile({ name: "", description: "" });

      // 可以刷新列表或通知父组件更新
    } catch (err) {
      console.error("创建配置文件失败:", err);
      toast.error("创建配置文件失败", {
        description: err instanceof Error ? err.message : "请再次尝试",
      });
    } finally {
      setCreating(false);
    }
  };

  // 处理编辑配置
  const handleEditProfile = async () => {
    if (!selectedProfile || !selectedProfile.name.trim()) {
      toast.error("配置文件名称不能为空");
      return;
    }

    try {
      await profilesApi.updateProfile(selectedProfile.name, selectedProfile);
      toast.success("配置文件已更新");
      setShowEditDialog(false);

      // 可以刷新列表或通知父组件更新
    } catch (err) {
      console.error("更新配置文件失败:", err);
      toast.error("更新配置文件失败", {
        description: err instanceof Error ? err.message : "请再次尝试",
      });
    }
  };

  // 处理删除配置
  const handleDeleteProfile = async (profile: EquipmentProfile) => {
    try {
      await profilesApi.deleteProfile(profile.name);
      toast.success(`配置 "${profile.name}" 已删除`);

      // 可以刷新列表或通知父组件更新
    } catch (err) {
      console.error("删除配置文件失败:", err);
      toast.error("删除配置文件失败", {
        description: err instanceof Error ? err.message : "请再次尝试",
      });
    }
  };

  // 处理导出配置
  const handleExportProfile = async (profile: EquipmentProfile) => {
    setSelectedProfile(profile);
    setShowExportDialog(true);
    setLoading(true);

    try {
      const result = await profilesApi.exportProfile(profile.name);
      setExportUrl(result.exportUrl);
    } catch (err) {
      console.error("导出配置文件失败:", err);
      toast.error("导出配置文件失败", {
        description: err instanceof Error ? err.message : "请再次尝试",
      });
    } finally {
      setLoading(false);
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <motion.div variants={fadeIn} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                设备配置文件
              </div>
              <div className="h-9 w-36 bg-muted/40 rounded animate-pulse" />
            </CardTitle>
            <CardDescription>管理和加载预设设备配置</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-muted/40 rounded animate-pulse" />
                      <div className="h-4 w-60 bg-muted/40 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-9 bg-muted/40 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeIn}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              设备配置文件
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => {
                setShowCreateDialog(true);
                setNewProfile({ name: "", description: "" });
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              创建配置
            </Button>
          </CardTitle>
          <CardDescription>管理和加载预设设备配置</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {profiles && profiles.length > 0 ? (
            <motion.div variants={staggerChildren} className="space-y-4">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.name}
                  variants={fadeInScale}
                  className="p-4 border rounded-md hover:border-primary/50 transition-colors"
                  whileHover={{
                    scale: shouldReduceMotion() ? 1 : 1.01,
                    transition: { duration: DURATION.quick },
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {profile.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadProfile(profile)}
                          >
                            加载
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>加载此配置</p>
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProfile(profile);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExportProfile(profile)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            导出
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const newName = `${profile.name} 副本`;
                              toast.promise(
                                profilesApi.saveCurrentSetup(
                                  newName,
                                  profile.description
                                ),
                                {
                                  loading: "正在复制...",
                                  success: () => `已创建副本 "${newName}"`,
                                  error: "复制失败",
                                }
                              );
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            创建副本
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `确定要删除配置 "${profile.name}" 吗？`
                                )
                              ) {
                                handleDeleteProfile(profile);
                              }
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-center p-8">
              <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">没有可用的配置文件</h3>
              <p className="text-sm text-muted-foreground mb-4">
                保存当前设备连接设置作为配置文件，以便快速加载常用设置
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setShowCreateDialog(true);
                  setNewProfile({ name: "", description: "" });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                创建配置
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 创建配置对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新配置</DialogTitle>
            <DialogDescription>
              保存当前设备连接设置作为可重复加载的配置文件
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">配置名称</Label>
              <Input
                id="profile-name"
                placeholder="例如：深空拍摄配置"
                value={newProfile.name}
                onChange={(e) =>
                  setNewProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-description">配置描述 (可选)</Label>
              <Textarea
                id="profile-description"
                placeholder="描述此配置文件的用途..."
                value={newProfile.description}
                onChange={(e) =>
                  setNewProfile((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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
            <Button
              onClick={handleCreateProfile}
              disabled={!newProfile.name || creating}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存配置
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑配置</DialogTitle>
            <DialogDescription>修改现有配置文件的详细信息</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-profile-name">配置名称</Label>
              <Input
                id="edit-profile-name"
                value={selectedProfile?.name || ""}
                onChange={(e) =>
                  setSelectedProfile((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profile-description">配置描述</Label>
              <Textarea
                id="edit-profile-description"
                value={selectedProfile?.description || ""}
                onChange={(e) =>
                  setSelectedProfile((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleEditProfile}
              disabled={!selectedProfile?.name}
            >
              <Save className="h-4 w-4 mr-2" />
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 加载配置对话框 */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>加载配置</DialogTitle>
            <DialogDescription>
              即将加载设备配置文件 &quot;{selectedProfile?.name}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>注意</AlertTitle>
              <AlertDescription>
                加载配置将会断开当前已连接的设备，并使用配置文件中的设备信息创建新连接。
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <p>
                <strong>配置说明：</strong> {selectedProfile?.description}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoadDialog(false)}
              disabled={loadingProfile}
            >
              取消
            </Button>
            <Button disabled={loadingProfile}>
              {loadingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  确认加载
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导出配置对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出配置</DialogTitle>
            <DialogDescription>
              导出当前设备配置以便在其他设备上使用
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  正在准备配置文件导出...
                </p>
              </div>
            ) : exportUrl ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>配置文件已准备完成</AlertTitle>
                  <AlertDescription>
                    您可以下载此配置文件，或复制链接分享给他人
                  </AlertDescription>
                </Alert>

                <div className="flex items-center">
                  <Input readOnly value={exportUrl} className="flex-1 mr-2" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(exportUrl);
                      toast.success("链接已复制到剪贴板");
                    }}
                  >
                    复制
                  </Button>
                </div>
              </div>
            ) : (
              <p>正在准备导出 &quot;{selectedProfile?.name}&quot; 配置...</p>
            )}
          </div>

          <DialogFooter>
            {exportUrl ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                >
                  关闭
                </Button>
                <Button asChild>
                  <a
                    href={exportUrl}
                    download={`${selectedProfile?.name}.json`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    下载配置文件
                  </a>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => setShowExportDialog(false)}
              >
                取消
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
