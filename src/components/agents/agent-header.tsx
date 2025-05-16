import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/client";

interface AgentHeaderProps {
  onCreateAgent: () => void;
}

export function AgentHeader({ onCreateAgent }: AgentHeaderProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-row justify-between items-center gap-2 mb-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          {t("agent.title", { defaultValue: "Agents" })}
        </h1>
        <p className="text-xs text-muted-foreground">
          {t("agent.description", {
            defaultValue:
              "Create and manage automated agents for your astronomy workflow",
          })}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateAgent} size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {t("agent.create", { defaultValue: "Create Agent" })}
        </Button>
      </div>
    </div>
  );
}
