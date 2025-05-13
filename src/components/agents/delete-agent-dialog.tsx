import { useState } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { agentsApi } from "./agents-api";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

interface DeleteAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => Promise<void> | void;
  onCancel: () => void;
  agentName?: string;
  agentId?: string;
}

export function DeleteAgentDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  agentName = "此代理",
  agentId,
}: DeleteAgentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations(); // 使用 i18n hook

  const handleDelete = async () => {
    if (!agentId) {
      setError(
        t("agents.delete.error.missingId", {
          defaultValue: "代理 ID 缺失，无法删除",
        })
      );
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // 直接使用 agentsApi 服务删除代理
      await agentsApi.deleteAgent(agentId);

      // 如果有回调，执行回调
      if (onConfirm) await onConfirm();

      // 关闭对话框
      onOpenChange(false);

      toast.success(
        t("agents.delete.success.title", { defaultValue: "代理已删除" }),
        {
          description: t("agents.delete.success.description", {
            defaultValue: "代理已成功删除",
          }),
        }
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("agents.delete.error.generic", {
              defaultValue: "删除代理时发生错误",
            });
      setError(errorMsg);
      toast.error(
        t("agents.delete.error.title", { defaultValue: "删除失败" }),
        {
          description: errorMsg,
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 text-destructive rounded-full">
              <Trash2 className="h-4 w-4" />
            </div>
            {t("agents.delete.title", { defaultValue: "删除代理" })}
          </DialogTitle>
          <DialogDescription>
            {t("agents.delete.confirmation", {
              params: { agentName },
              defaultValue: `您确定要删除${
                agentName ? ` "${agentName}" ` : ""
              }吗？此操作无法撤销。`,
            })}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2 mt-4"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            {t("common.cancel", { defaultValue: "取消" })}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("agents.delete.inProgress", { defaultValue: "删除中..." })}
              </>
            ) : (
              t("agents.delete.confirm", { defaultValue: "删除" })
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
