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
  Upload,
  ServerCog,
  Clock,
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
  DURATION,
  powerScale,
  parallaxFadeIn,
  bounceItem,
  enhancedStaggerChildren
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
import { Badge } from "@/components/ui/badge";

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
      toast.success("配置文件已保存", {
        description: `"${newProfile.name.trim()}" 配置已成功创建`
      });
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
      toast.success("配置文件已更新", {
        description: `"${selectedProfile.name}" 的更改已保存`
      });
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
      <motion.div variants={powerScale} className="w-full">
        <Card className="overflow-hidden border-t-4 border-t-blue-500/50 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                设备配置文件
              </div>
              <div className="h-9 w-36 bg-muted/40 rounded-md animate-pulse" />
            </CardTitle>
            <CardDescription>管理和加载预设设备配置</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-b from-card to-background/80">
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-6 border rounded-md bg-muted/5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-5 w-40 bg-muted/40 rounded-md animate-pulse" />
                      <div className="h-4 w-60 bg-muted/40 rounded-md animate-pulse" />
                    </div>
                    <div className="space-x-2 flex">
                      <div className="h-9 w-20 bg-muted/40 rounded-md animate-pulse" />
                      <div className="h-9 w-9 bg-muted/40 rounded-md animate-pulse" />
                    </div>
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
    <motion.div variants={powerScale} whileHover="hover">
      <Card className="overflow-hidden border-t-4 border-t-blue-500/50 shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-background">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ServerCog className="h-5 w-5 mr-2 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 font-bold">
                设备配置文件
              </span>
              <Badge variant="outline" className="ml-2">
                {profiles.length} 个配置
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-200/30"
                  onClick={() => {
                    setShowCreateDialog(true);
                    setNewProfile({ name: "", description: "" });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  创建配置
                </Button>
              </TooltipTrigger>
              <TooltipContent>保存当前设备设置为新配置</TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription className="flex items-center">
            <Database className="h-3 w-3 mr-1 opacity-70" />
            管理和加载预设设备配置，快速切换不同设备组合
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-b from-card to-background/80">
          {profiles && profiles.length > 0 ? (
            <motion.div 
              variants={enhancedStaggerChildren} 
              className="space-y-4"
            >
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.name}
                  variants={bounceItem}
                  custom={index}
                  className="p-5 border rounded-md hover:border-blue-300/50 transition-all duration-300 bg-gradient-to-r from-blue-50/10 to-background backdrop-blur-sm"
                  whileHover={{
                    scale: shouldReduceMotion() ? 1 : 1.01,
                    y: -2,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    transition: { duration: DURATION.quick },
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="font-medium text-lg text-blue-600 dark:text-blue-400">{profile.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1 opacity-70" />
                        {profile.description || "无描述"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            onClick={() => handleLoadProfile(profile)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            加载
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>加载此配置</p>
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-500/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProfile(profile);
                              setShowEditDialog(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> 编辑配置
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleExportProfile(profile);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Share2 className="h-4 w-4" /> 导出配置
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // 假设这里是复制功能
                              navigator.clipboard.writeText(profile.name);
                              toast.success("已复制配置名称");
                            }}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" /> 复制名称
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProfile(profile)}
                            className="text-destructive flex items-center gap-2"
                          >
                            <Trash className="h-4 w-4" /> 删除配置
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={parallaxFadeIn}
              className="py-12 text-center"
            >
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-blue-500/80" />
              </div>
              <p className="mt-4 text-muted-foreground">暂无设备配置文件</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-blue-200/30"
                onClick={() => {
                  setShowCreateDialog(true);
                  setNewProfile({ name: "", description: "" });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                创建第一个配置
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* 创建配置对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] border-t-4 border-t-blue-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="h-4 w-4 mr-2 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                创建设备配置
              </span>
            </DialogTitle>
            <DialogDescription>
              保存当前的设备设置为新配置文件
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="flex items-center">
                <Database className="h-3 w-3 mr-1" /> 配置名称
              </Label>
              <Input
                id="profile-name"
                placeholder="输入配置名称"
                value={newProfile.name}
                onChange={(e) =>
                  setNewProfile((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-description" className="flex items-center">
                <Edit className="h-3 w-3 mr-1" /> 配置描述
              </Label>
              <Textarea
                id="profile-description"
                placeholder="输入配置描述（可选）"
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
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={creating || !newProfile.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  创建配置
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px] border-t-4 border-t-blue-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-4 w-4 mr-2 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                编辑配置
              </span>
            </DialogTitle>
            <DialogDescription>
              修改 &quot;{selectedProfile?.name}&quot; 配置信息
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-profile-name" className="flex items-center">
                <Database className="h-3 w-3 mr-1" /> 配置名称
              </Label>
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
              <Label htmlFor="edit-profile-description" className="flex items-center">
                <Edit className="h-3 w-3 mr-1" /> 配置描述
              </Label>
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="h-4 w-4 mr-2" />
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 加载配置对话框 */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="border-t-4 border-t-blue-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Upload className="h-4 w-4 mr-2 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                加载配置
              </span>
            </DialogTitle>
            <DialogDescription>
              即将加载设备配置文件 &quot;{selectedProfile?.name}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert className="border-amber-500/20 bg-amber-500/10">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">注意</AlertTitle>
              <AlertDescription>
                加载配置将会断开当前已连接的设备，并使用配置文件中的设备信息创建新连接。
              </AlertDescription>
            </Alert>

            <div className="mt-6 p-4 border rounded-md bg-blue-50/10 dark:bg-blue-900/10">
              <p className="text-sm text-muted-foreground mb-2">配置详情：</p>
              <p className="font-medium">{selectedProfile?.name}</p>
              <p className="text-sm mt-1">{selectedProfile?.description || "无描述"}</p>
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
            <Button 
              disabled={loadingProfile}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
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
        <DialogContent className="border-t-4 border-t-blue-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Share2 className="h-4 w-4 mr-2 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                导出配置
              </span>
            </DialogTitle>
            <DialogDescription>
              导出当前设备配置以便在其他设备上使用
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2">正在准备导出...</p>
              </div>
            ) : exportUrl ? (
              <div className="space-y-4">
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">准备就绪</AlertTitle>
                  <AlertDescription>
                    配置文件已准备好，可以下载或分享。
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  asChild
                >
                  <a href={exportUrl} download={`${selectedProfile?.name || "config"}.json`}>
                    <Download className="h-4 w-4 mr-2" />
                    下载配置文件
                  </a>
                </Button>

                <div className="flex items-center space-x-2">
                  <Input
                    value={exportUrl}
                    readOnly
                    className="flex-1 bg-muted/30"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(exportUrl);
                      toast.success("已复制导出链接");
                    }}
                  >
                    复制
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/60" />
                <p className="mt-4 text-muted-foreground">导出发生错误</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
