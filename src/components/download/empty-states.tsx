import { Download, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-muted-foreground mb-4">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
      {action && (
        <Button variant="outline" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoActiveDownloads({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={<Download className="h-12 w-12" />}
      title="No Active Downloads"
      description="You don't have any active downloads. Browse available software to start downloading."
      action={{
        label: "Browse Available Software",
        onClick: onBrowse,
      }}
    />
  );
}

export function NoDownloadHistory() {
  return (
    <EmptyState
      icon={<Clock className="h-12 w-12" />}
      title="No Download History"
      description="Your download history will appear here once you've completed some downloads."
    />
  );
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No Results Found"
      description="No software matches your search criteria. Try a different search term."
    />
  );
}