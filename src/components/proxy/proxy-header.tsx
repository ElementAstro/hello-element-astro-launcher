import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n";

interface ProxyHeaderProps {
  onCreateProxy: () => void;
}

export function ProxyHeader({ onCreateProxy }: ProxyHeaderProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {t("proxy.header.title")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
          {t("proxy.header.description")}
        </p>
      </div>
      <Button
        onClick={onCreateProxy}
        size="sm"
        className="self-start sm:self-center"
        aria-label={t("proxy.header.addNew")}
      >
        <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
        <span>{t("proxy.header.addNew")}</span>
      </Button>
    </div>
  );
}
