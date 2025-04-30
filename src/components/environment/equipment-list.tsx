import { HardDrive, Layers, Monitor, Telescope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Equipment } from "./types";
import { EquipmentItem } from "./equipment-item";

interface EquipmentListProps {
  equipment: Equipment[];
}

type EquipmentByType = Record<string, Equipment[]>;

export function EquipmentList({ equipment }: EquipmentListProps) {
  // Group equipment by type
  const equipmentByType = equipment.reduce((acc, item) => {
    const type = item.type.toLowerCase().includes("camera")
      ? "cameras"
      : item.type.toLowerCase().includes("mount") ||
        item.type.toLowerCase().includes("telescope")
      ? "telescopes"
      : item.type.toLowerCase().includes("focuser") ||
        item.type.toLowerCase().includes("filter")
      ? "focusers"
      : "other";

    if (!acc[type]) {
      acc[type] = [];
    }

    acc[type].push(item);
    return acc;
  }, {} as EquipmentByType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Telescope className="h-5 w-5 mr-2" />
          Connected Equipment
        </CardTitle>
        <CardDescription>
          Manage your astronomy equipment and connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="telescopes">
            <AccordionTrigger>
              <div className="flex items-center">
                <Telescope className="h-4 w-4 mr-2" />
                Telescopes & Mounts
                <Badge variant="outline" className="ml-2">
                  {equipmentByType.telescopes?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {equipmentByType.telescopes?.map((item) => (
                  <EquipmentItem
                    key={item.id}
                    name={item.name}
                    type={item.type}
                    status={item.status}
                    driver={item.driver}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cameras">
            <AccordionTrigger>
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-2" />
                Cameras
                <Badge variant="outline" className="ml-2">
                  {equipmentByType.cameras?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {equipmentByType.cameras?.map((item) => (
                  <EquipmentItem
                    key={item.id}
                    name={item.name}
                    type={item.type}
                    status={item.status}
                    driver={item.driver}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="focusers">
            <AccordionTrigger>
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Focusers & Filter Wheels
                <Badge variant="outline" className="ml-2">
                  {equipmentByType.focusers?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {equipmentByType.focusers?.map((item) => (
                  <EquipmentItem
                    key={item.id}
                    name={item.name}
                    type={item.type}
                    status={item.status}
                    driver={item.driver}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="other">
            <AccordionTrigger>
              <div className="flex items-center">
                <HardDrive className="h-4 w-4 mr-2" />
                Other Devices
                <Badge variant="outline" className="ml-2">
                  {equipmentByType.other?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {equipmentByType.other?.map((item) => (
                  <EquipmentItem
                    key={item.id}
                    name={item.name}
                    type={item.type}
                    status={item.status}
                    driver={item.driver}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add Equipment</Button>
        <Button>Connect All</Button>
      </CardFooter>
    </Card>
  );
}