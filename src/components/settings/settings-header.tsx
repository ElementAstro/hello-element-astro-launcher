"use client";

import { RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useTranslations } from "@/components/i18n";

interface SettingsHeaderProps {
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SettingsHeader({
  isSaving,
  onSave,
  onReset,
}: SettingsHeaderProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
      {" "}
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          {t("settings.header.title")}
        </h1>
        <p className="text-xs text-muted-foreground">
          {t("settings.header.description")}
        </p>
      </div>
      <div className="flex gap-1.5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-7 text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              {t("settings.header.reset")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="space-y-1">
              <AlertDialogTitle className="text-base">
                {t("settings.header.resetDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {t("settings.header.resetDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-1.5">
              <AlertDialogCancel className="h-7 text-xs">
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="h-7 text-xs"
                onClick={() => {
                  onReset();
                  toast.info(t("settings.header.resetNotification.title"), {
                    description: t(
                      "settings.header.resetNotification.description"
                    ),
                  });
                }}
              >
                {t("settings.header.resetDialog.confirmButton")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={onSave} disabled={isSaving} className="h-7 text-xs">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {isSaving
            ? t("settings.header.savingButton")
            : t("settings.header.saveButton")}
        </Button>
      </div>
    </div>
  );
}
