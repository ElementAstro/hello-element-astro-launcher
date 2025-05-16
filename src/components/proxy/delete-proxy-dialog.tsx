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
import { useTranslations } from "@/components/i18n";

interface DeleteProxyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProxyDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteProxyDialogProps) {
  const { t } = useTranslations();

  const handleCancel = () => {
    onOpenChange(false);
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader className="pb-2">
          <AlertDialogTitle className="text-base">{t("proxy.deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t("proxy.deleteDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={handleCancel} className="h-8 text-xs">
            {t("proxy.deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("proxy.deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
