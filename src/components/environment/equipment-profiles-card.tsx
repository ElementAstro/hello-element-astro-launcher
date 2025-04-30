import { Database, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EquipmentProfile } from "./types";

interface EquipmentProfilesCardProps {
  profiles: EquipmentProfile[];
}

export function EquipmentProfilesCard({ profiles }: EquipmentProfilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Equipment Profiles
        </CardTitle>
        <CardDescription>
          Save and load equipment configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">{profile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {profile.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Load
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Current Setup</Button>
      </CardFooter>
    </Card>
  );
}