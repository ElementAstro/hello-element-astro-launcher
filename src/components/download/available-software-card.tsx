import Image from "next/image";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cardVariants } from "./animation-variants";

interface AvailableSoftwareCardProps {
  software: {
    id: number;
    name: string;
    version: string;
    description: string;
    size: string;
    icon: string;
    category: string;
    installed: boolean;
  };
  onDownload: () => void;
}

export function AvailableSoftwareCard({
  software,
  onDownload,
}: AvailableSoftwareCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <Image
            src={software.icon || "/placeholder.svg"}
            alt={software.name}
            width={40}
            height={40}
            className="rounded"
          />
          <div>
            <CardTitle className="text-lg">{software.name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Version {software.version}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="line-clamp-2">
            {software.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center border-t">
          <div className="text-sm text-muted-foreground">{software.size}</div>
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}