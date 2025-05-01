import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DeleteAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  agentName?: string;
}

export function DeleteAgentDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  agentName = "this agent",
}: DeleteAgentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Determine confirmation text based on agent name
  const requiredConfirmText = agentName.includes(" ")
    ? "delete agent"
    : agentName.toLowerCase();

  const isConfirmDisabled = confirmText !== requiredConfirmText;

  const handleConfirmDelete = async () => {
    if (isConfirmDisabled) return;

    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      toast.success(`Agent "${agentName}" deleted successfully`);
      onOpenChange(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete agent";
      setError(errorMsg);
      toast.error("Failed to delete agent", {
        description: errorMsg,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isDeleting) {
          onOpenChange(isOpen);
          if (!isOpen) {
            // Reset state when closing
            setConfirmText("");
            setError(null);
          }
        }
      }}
    >
      <AlertDialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete {agentName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              agent and all of its data, including logs, configurations, and run
              history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-delete"
                className="text-sm font-medium text-destructive"
              >
                Type{" "}
                <span className="font-mono bg-muted px-1 rounded">
                  {requiredConfirmText}
                </span>{" "}
                to confirm deletion:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={requiredConfirmText}
                className="border-destructive focus-visible:ring-destructive"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-invalid={confirmText.length > 0 && isConfirmDisabled}
                aria-describedby="confirm-delete-error"
              />
              <AnimatePresence>
                {confirmText.length > 0 && isConfirmDisabled && (
                  <motion.p
                    id="confirm-delete-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-destructive mt-1"
                  >
                    Text doesn&apos;t match the required confirmation phrase
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={onCancel}
              disabled={isDeleting}
              className="transition-all"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isConfirmDisabled || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Agent"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
