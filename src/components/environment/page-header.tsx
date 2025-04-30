import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn } from "./animation-constants";

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Environment</h1>
        <p className="text-muted-foreground">
          Manage your astronomy equipment and system settings
        </p>
      </div>
      <Button onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Devices
      </Button>
    </motion.div>
  );
}