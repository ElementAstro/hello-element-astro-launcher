import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeIn } from "./animation-constants";
import { Equipment } from "./types";

type EquipmentItemProps = Omit<Equipment, "id">;

export function EquipmentItem({ name, type, status, driver }: EquipmentItemProps) {
  return (
    <motion.div
      className="flex items-center justify-between p-3 border rounded-lg"
      variants={fadeIn}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <div className="text-sm text-muted-foreground">
            {type} • {driver}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Badge variant={status === "Connected" ? "default" : "secondary"}>
          {status}
        </Badge>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}