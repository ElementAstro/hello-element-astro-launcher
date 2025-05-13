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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("settings.header.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.header.description")}
        </p>
      </div>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("settings.header.reset")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("settings.header.resetDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("settings.header.resetDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
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

        <Button onClick={onSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving
            ? t("settings.header.savingButton")
            : t("settings.header.saveButton")}
        </Button>
      </div>
    </div>
  );
}
