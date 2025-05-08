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

  const handleDelete = async () => {
    if (!agentId) {
      setError("代理 ID 缺失，无法删除");
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
      
      toast.success("代理已删除", {
        description: "代理已成功删除",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "删除代理时发生错误";
      setError(errorMsg);
      toast.error("删除失败", {
        description: errorMsg,
      });
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
            删除代理
          </DialogTitle>
          <DialogDescription>
            您确定要删除{agentName && ` "${agentName}" `}吗？此操作无法撤销。
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
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                删除中...
              </>
            ) : (
              "删除"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
