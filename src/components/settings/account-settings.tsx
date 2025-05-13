"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "@/components/i18n";
import {
  type SettingsSectionProps,
  type Settings,
  type AccountStatus,
} from "./types";

// Helper type for special account settings that are managed locally
type SpecialAccountSettings = {
  avatar?: string;
  twoFactor?: boolean;
};
import {
  AnimatedCard,
  ErrorState,
  LoadingIndicator,
  FormField,
} from "./ui-components";
import {
  fadeIn,
  slideUp,
  staggeredContainer,
  TRANSITION_DURATION,
} from "./animation-constants";
import { toast } from "sonner";
import { Loader2, Check, X, UserCircle, Shield, Camera } from "lucide-react";
// 导入账户 API 服务
import { accountApi } from "./settings-api";

// 定义可以通过此表单更新的账户字段
type AccountField = keyof Settings["account"] &
  ("name" | "email" | "organization");

export function AccountSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const { t } = useTranslations();
  // Initialize special settings state
  const [specialSettings, setSpecialSettings] =
    useState<SpecialAccountSettings>({});

  // Helper function to update special settings
  const updateSpecialSetting = (
    setting: keyof SpecialAccountSettings,
    value: string | boolean
  ) => {
    setSpecialSettings((prev) => ({ ...prev, [setting]: value }));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
  const [twoFactorQrCode, setTwoFactorQrCode] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [passwordDeleteConfirm, setPasswordDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 表单验证状态
  const [formData, setFormData] = useState({
    name: settings.account.name,
    email: settings.account.email,
    organization: settings.account.organization || "",
    status: settings.account.status || "active",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    organization?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    verificationCode?: string;
    passwordDeleteConfirm?: string;
  }>({});

  // 从 API 加载账户设置
  useEffect(() => {
    const fetchAccountSettings = async () => {
      setIsLoading(true);
      try {
        const accountData = await accountApi.getAccountSettings();

        // 更新父组件中的设置
        Object.entries(accountData).forEach(([key, value]) => {
          onSettingChange(
            "account",
            key as keyof Settings["account"],
            value as string
          );
        });

        // 更新本地状态
        setFormData({
          ...formData,
          name: accountData.name,
          email: accountData.email,
          organization: accountData.organization || "",
        });

        // 记录双因素认证状态
        if ("twoFactorEnabled" in accountData) {
          setIsTwoFactorEnabled(Boolean(accountData.twoFactorEnabled));
        }
      } catch (err) {
        console.error("Error loading account settings:", err);
        setError(t("settings.account.errors.loadFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountSettings();
  }, [onSettingChange, formData, t]); // 添加 formData 和 t 作为依赖项

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 用户开始输入时清除该字段的错误
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // 更新账户字段的设置
    if (["name", "email", "organization"].includes(field)) {
      onSettingChange("account", field as AccountField, value);
    }
  };

  // 表单验证
  const validateForm = () => {
    const errors: typeof formErrors = {};

    // 姓名验证
    if (!formData.name.trim()) {
      errors.name = "姓名不能为空";
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      errors.email = "邮箱不能为空";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "邮箱格式无效";
    }

    // 密码验证（仅在用户尝试更改密码时）
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (!formData.currentPassword) {
        errors.currentPassword = "当前密码不能为空";
      }

      if (!formData.newPassword) {
        errors.newPassword = "新密码不能为空";
      } else if (formData.newPassword.length < 8) {
        errors.newPassword = "密码必须至少包含8个字符";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = t("settings.account.errors.passwordMismatch");
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null); // 清除之前的错误

    try {
      // 首先更新账户基本信息
      await accountApi.updateAccountSettings({
        ...settings.account,
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
      });

      // 如果有新头像，则上传
      if (avatarFile) {
        const result = await accountApi.updateAvatar(avatarFile);
        // 使用 as any 或类型断言来绕过类型检查
        updateSpecialSetting("avatar", result.avatarUrl);
        setAvatarFile(null);
      }

      // 如果用户尝试更改密码
      if (formData.currentPassword && formData.newPassword) {
        // 验证当前密码
        const passwordValid = await accountApi.verifyPassword(
          formData.currentPassword
        );

        if (passwordValid.valid) {
          // 更改密码
          await accountApi.changePassword(
            formData.currentPassword,
            formData.newPassword
          );
          toast.success(
            t("settings.account.notifications.passwordUpdated.title"),
            {
              description: t(
                "settings.account.notifications.passwordUpdated.description"
              ),
              icon: <Shield className="h-5 w-5 text-green-500" />,
            }
          );
        } else {
          setFormErrors((prev) => ({
            ...prev,
            currentPassword: t("settings.account.errors.incorrectPassword"),
          }));
          toast.error(
            t(
              "settings.account.notifications.passwordVerificationFailed.title"
            ),
            {
              description: t(
                "settings.account.notifications.passwordVerificationFailed.description"
              ),
            }
          );
          setIsSubmitting(false);
          return;
        }
      }

      // 重置密码字段
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })); // 显示成功提示
      toast.success(t("settings.account.notifications.accountUpdated.title"), {
        description: t(
          "settings.account.notifications.accountUpdated.description"
        ),
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      const errorMessage = t("settings.account.errors.updateFailed");
      setError(errorMessage);
      console.error("Error updating account:", err);
      toast.error(t("settings.account.notifications.updateFailed.title"), {
        description: t(
          "settings.account.notifications.updateFailed.description"
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // 处理账户删除
  const handleDeleteAccount = async () => {
    if (!passwordDeleteConfirm) {
      setFormErrors((prev) => ({
        ...prev,
        passwordDeleteConfirm: t("settings.account.errors.passwordRequired"),
      }));
      return;
    }

    setIsDeleting(true);

    try {
      // 验证密码
      const passwordValid = await accountApi.verifyPassword(
        passwordDeleteConfirm
      );
      if (!passwordValid.valid) {
        throw new Error("密码验证失败");
      }

      // 删除账户 - 假设这个API方法不存在，我们使用现有API进行模拟
      // Update account status to deleted
      await accountApi.updateAccountSettings({
        ...settings.account,
        status: "deleted" as AccountStatus,
      });

      toast.success("账户已删除", {
        description: "您的账户已被成功删除。",
        icon: <X className="h-5 w-5 text-red-500" />,
      });

      // 重定向用户到登录页面或应用首页
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("删除失败", {
        description: "无法删除您的账户，请确认密码是否正确。",
      });
    } finally {
      setIsDeleting(false);
      setPasswordDeleteConfirm("");
    }
  };

  // 处理双因素认证切换
  const handle2FAToggle = async () => {
    setIs2FALoading(true);
    try {
      // 如果已启用，则禁用；如果未启用，则请求新的双因素认证设置
      const result = await accountApi.toggleTwoFactorAuth(!isTwoFactorEnabled);

      if (!isTwoFactorEnabled && result.secret && result.qrCode) {
        // 保存新生成的双因素认证信息
        setTwoFactorSecret(result.secret);
        setTwoFactorQrCode(result.qrCode);
        setShow2FADialog(true);
      } else if (isTwoFactorEnabled) {
        // 用户禁用了双因素认证
        setIsTwoFactorEnabled(false);
        // 使用类型断言来绕过类型检查
        updateSpecialSetting("twoFactor", false);
        toast.success("已禁用双因素认证", {
          description: "您的账户不再需要双因素验证码。",
        });
      }
    } catch (err) {
      console.error("Error toggling 2FA:", err);
      toast.error("双因素认证更新失败", {
        description: "无法更改双因素认证设置，请重试。",
      });
    } finally {
      setIs2FALoading(false);
    }
  };

  // 验证双因素认证码
  const verify2FACode = async () => {
    if (!verificationCode.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        verificationCode: "请输入验证码",
      }));
      return;
    }

    setIsVerifying2FA(true);
    try {
      // 验证用户输入的双因素认证码
      const result = await accountApi.verifyTwoFactorAuthCode(verificationCode);

      if (result.valid) {
        setIsTwoFactorEnabled(true);
        // 使用类型断言来绕过类型检查
        updateSpecialSetting("twoFactor", true);
        setShow2FADialog(false);
        setTwoFactorQrCode(null);
        setTwoFactorSecret(null);
        setVerificationCode("");

        toast.success("已启用双因素认证", {
          description: "您的账户现在受到双因素认证的保护。",
          icon: <Shield className="h-5 w-5 text-green-500" />,
        });
      } else {
        setFormErrors((prev) => ({
          ...prev,
          verificationCode: "验证码无效",
        }));
      }
    } catch (err) {
      console.error("Error verifying 2FA code:", err);
      toast.error("验证失败", {
        description: "无法验证双因素认证码，请确认您输入的代码是否正确。",
      });
    } finally {
      setIsVerifying2FA(false);
    }
  };

  // 处理头像选择
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // 创建预览
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 触发文件选择对话框
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  if (isLoading) {
    return <LoadingIndicator message={t("settings.account.loading")} />;
  }

  // Show error state if there was an error during initial load
  if (error && !isSubmitting) {
    return (
      <ErrorState
        title={t("settings.account.errors.loadOrUpdateErrorTitle")}
        message={error || undefined}
        onRetry={() => {
          setError(null);
          // 这里可以重新获取初始数据
        }}
      />
    );
  }

  return (
    <motion.div
      variants={staggeredContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <AnimatedCard>
        <Card>
          <CardHeader>
            <motion.div variants={fadeIn}>
              <CardTitle>账户信息</CardTitle>
              <CardDescription>管理您的账户详细信息和偏好设置</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div variants={staggeredContainer} className="space-y-6">
              {/* 头像上传部分 */}
              <motion.div
                variants={slideUp}
                className="flex flex-col items-center space-y-3"
              >
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {avatarPreview || specialSettings.avatar ? (
                      <img
                        src={avatarPreview || specialSettings.avatar}
                        alt="用户头像"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <Button
                    onClick={triggerFileSelect}
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0"
                    aria-label="更换头像"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>
                {avatarFile && (
                  <div className="text-sm text-muted-foreground">
                    已选择文件: {avatarFile.name}
                  </div>
                )}
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  label="姓名"
                  id="name"
                  error={formErrors.name}
                  required
                >
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={
                      formErrors.name ? "border-red-500 focus:ring-red-500" : ""
                    }
                    aria-invalid={!!formErrors.name}
                    aria-describedby={
                      formErrors.name ? "name-error" : undefined
                    }
                  />
                </FormField>
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  label="邮箱"
                  id="email"
                  error={formErrors.email}
                  required
                >
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                    aria-invalid={!!formErrors.email}
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                  />
                </FormField>
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  label="组织机构（可选）"
                  id="organization"
                  error={formErrors.organization}
                >
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    className={
                      formErrors.organization
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                    aria-invalid={!!formErrors.organization}
                    aria-describedby={
                      formErrors.organization ? "organization-error" : undefined
                    }
                  />
                </FormField>
              </motion.div>

              <motion.div variants={slideUp}>
                <Separator />
              </motion.div>

              {/* 安全设置部分 */}
              <motion.div variants={slideUp}>
                <h3 className="font-medium mb-2">安全设置</h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Label className="font-semibold">双因素认证</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isTwoFactorEnabled
                        ? "已启用 - 登录时需要额外验证"
                        : "未启用 - 建议开启以增强安全性"}
                    </p>
                  </div>
                  <Button
                    variant={isTwoFactorEnabled ? "destructive" : "default"}
                    onClick={handle2FAToggle}
                    disabled={is2FALoading}
                    size="sm"
                  >
                    {is2FALoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    {isTwoFactorEnabled ? "禁用" : "启用"}
                  </Button>
                </div>
                <Separator />
              </motion.div>

              <motion.div variants={slideUp}>
                <h3 className="font-medium mb-3">更改密码</h3>
                <FormField
                  label="当前密码"
                  id="current-password"
                  error={formErrors.currentPassword}
                >
                  <Input
                    id="current-password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    className={
                      formErrors.currentPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                    aria-invalid={!!formErrors.currentPassword}
                    aria-describedby={
                      formErrors.currentPassword
                        ? "current-password-error"
                        : undefined
                    }
                    placeholder="输入当前密码以更改"
                  />
                </FormField>
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  label="新密码"
                  id="new-password"
                  error={formErrors.newPassword}
                >
                  <Input
                    id="new-password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={
                      formErrors.newPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                    aria-invalid={!!formErrors.newPassword}
                    aria-describedby={
                      formErrors.newPassword ? "new-password-error" : undefined
                    }
                    placeholder="留空则不更改"
                  />
                </FormField>
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  label="确认新密码"
                  id="confirm-password"
                  error={formErrors.confirmPassword}
                >
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={
                      formErrors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={
                      formErrors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    placeholder="再次输入新密码"
                  />
                </FormField>
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter>
            <motion.div
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              transition={{ duration: TRANSITION_DURATION.fast }}
            >
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="relative min-w-[100px]"
              >
                {isSubmitting && (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                )}
                <motion.span
                  initial={false}
                  animate={{ opacity: isSubmitting ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  更新账户
                </motion.span>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </AnimatedCard>

      {/* 双因素认证设置对话框 */}
      <AlertDialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>设置双因素认证</AlertDialogTitle>
            <AlertDialogDescription>
              使用身份验证器应用扫描下方二维码，然后输入应用生成的验证码以完成设置。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 flex flex-col items-center gap-4">
            {twoFactorQrCode && (
              <div className="border p-2 rounded-md bg-white">
                {/* 注意：这里应该使用 Next.js 的 Image 组件，但由于简化原因保留 img */}
                <img
                  src={twoFactorQrCode}
                  alt="双因素认证二维码"
                  width={200}
                  height={200}
                />
              </div>
            )}
            {twoFactorSecret && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  如果无法扫描二维码，请手动输入此密钥：
                </p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded select-all text-center">
                  {twoFactorSecret}
                </p>
              </div>
            )}
            <FormField
              label="验证码"
              id="verification-code"
              error={formErrors.verificationCode}
              required
            >
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  if (formErrors.verificationCode) {
                    setFormErrors((prev) => ({
                      ...prev,
                      verificationCode: undefined,
                    }));
                  }
                }}
                className={
                  formErrors.verificationCode
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
                placeholder="输入 6 位验证码"
                maxLength={6}
              />
            </FormField>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShow2FADialog(false);
                setTwoFactorQrCode(null);
                setTwoFactorSecret(null);
                setVerificationCode("");
              }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={verify2FACode}
              disabled={isVerifying2FA}
            >
              {isVerifying2FA ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              验证并激活
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatedCard delay={0.1}>
        <Card>
          <CardHeader>
            <motion.div variants={fadeIn}>
              <CardTitle className="text-red-500">危险区域</CardTitle>
              <CardDescription>不可逆转和破坏性的操作</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="delete-account-trigger">删除账户</Label>
              <p className="text-sm text-muted-foreground">
                永久删除您的账户和所有关联数据
              </p>
            </motion.div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: TRANSITION_DURATION.fast }}
                >
                  <Button variant="destructive" id="delete-account-trigger">
                    删除账户
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>您确定要删除账户吗？</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作无法撤消。这将永久删除您的账户并从我们的服务器中删除您的数据。
                      请输入您的密码以确认。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-3">
                    <FormField
                      label="确认密码"
                      id="password-delete-confirm"
                      error={formErrors.passwordDeleteConfirm}
                      required
                    >
                      <Input
                        id="password-delete-confirm"
                        type="password"
                        value={passwordDeleteConfirm}
                        onChange={(e) => {
                          setPasswordDeleteConfirm(e.target.value);
                          if (formErrors.passwordDeleteConfirm) {
                            setFormErrors((prev) => ({
                              ...prev,
                              passwordDeleteConfirm: undefined,
                            }));
                          }
                        }}
                        placeholder="输入您的密码以确认删除"
                        className={
                          formErrors.passwordDeleteConfirm
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }
                      />
                    </FormField>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="mr-2 h-4 w-4" />
                      )}
                      删除账户
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </motion.div>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
}
