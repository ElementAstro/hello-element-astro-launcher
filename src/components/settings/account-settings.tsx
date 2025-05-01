"use client";

import { useState, useEffect } from "react";
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
import { type SettingsSectionProps, type Settings } from "./types"; // Assuming Settings type is exported from types
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
import { Loader2, Check, X } from "lucide-react";

// Define which account fields can be updated via this form
type AccountField = keyof Settings["account"] &
  ("name" | "email" | "organization");

export function AccountSettings({
  settings,
  onSettingChange,
}: SettingsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form validation state
  const [formData, setFormData] = useState({
    name: settings.account.name,
    email: settings.account.email,
    organization: settings.account.organization || "",
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
  }>({});

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing again
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Update settings for account fields
    if (["name", "email", "organization"].includes(field)) {
      // Use the defined type for better type safety
      onSettingChange("account", field as AccountField, value);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: typeof formErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "姓名不能为空";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "邮箱不能为空";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "邮箱格式无效";
    }

    // Password validation (only if the user is trying to change password)
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
        errors.confirmPassword = "密码不匹配";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Use toast.success or toast(message, options) format
      toast.success("账户已更新", {
        description: "您的账户信息已成功更新",
        // The action prop expects a ReactNode, ensure it's valid if used
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
        icon: <Check className="h-5 w-5 text-green-500" />, // Example of adding an icon directly
      });
    } catch (err) {
      const errorMessage = "更新账户信息时出错";
      setError(errorMessage);
      console.error("Error updating account:", err); // Log the actual error
      // Use toast.error or toast(message, options) format
      toast.error("更新失败", {
        description: "无法更新您的账户信息，请重试。",
        // If sonner supports variants in options, you might add it here:
        // variant: "destructive", // Check sonner documentation for variant support in options
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would typically make an API call to delete the account
    // Simulate API call for deletion
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      // Use toast.error or toast(message, options) format for destructive actions
      toast.error("账户已删除", {
        description: "您的账户已被成功删除。",
        // Add an icon for visual feedback
        icon: <X className="h-5 w-5 text-red-500" />,
      });
      // Potentially redirect user or update UI state after deletion
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("删除失败", {
        description: "无法删除您的账户，请重试。",
      });
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="加载账户信息..." />;
  }

  // Display error state if there was an error during initial load
  if (error && !isSubmitting) {
    // Show general error state only if not caused by submission failure
    return (
      <ErrorState
        title="无法加载或更新账户信息"
        message={error}
        onRetry={() => {
          setError(null);
          // Optionally re-fetch initial data here if needed
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
            <motion.div variants={staggeredContainer} className="space-y-4">
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

              <motion.div variants={slideUp}>
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
                className="relative min-w-[100px]" // Added min-width to prevent layout shift
              >
                {isSubmitting && (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} // Added exit animation
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                )}
                <motion.span // Added motion to text for smooth transition
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
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Added hover style
                      onClick={handleDeleteAccount}
                    >
                      <X className="mr-2 h-4 w-4" />
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

// Assuming a basic Settings structure in types.ts or similar
// Example:
// export interface Settings {
//   account: {
//     name: string;
//     email: string;
//     organization?: string;
//     // other account settings...
//   };
//   // other setting sections...
// }
//
// export interface SettingsSectionProps {
//   settings: Settings;
//   onSettingChange: <T extends keyof Settings, K extends keyof Settings[T]>(
//     section: T,
//     key: K,
//     value: Settings[T][K]
//   ) => void;
// }
