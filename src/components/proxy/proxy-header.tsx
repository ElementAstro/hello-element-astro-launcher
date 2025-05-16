import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n";

interface ProxyHeaderProps {
  onCreateProxy: () => void;
}

export function ProxyHeader({ onCreateProxy }: ProxyHeaderProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-medium">
          {t("proxy.header.title")}
        </h1>
        <span className="text-[10px] text-muted-foreground hidden md:inline-block bg-muted/50 px-1.5 py-0.5 rounded-sm">
          {t("proxy.header.description")}
        </span>
      </div>
      <Button
        onClick={onCreateProxy}
        variant="outline"
        size="sm"
        className="h-7"
        aria-label={t("proxy.header.addNew")}
      >
        <PlusCircle className="h-3 w-3 mr-1" />
        <span className="text-[10px]">{t("proxy.header.addNew")}</span>
      </Button>
    </div>
  );
}
