import Link from "next/link";
import type React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

export function CategoryCard({
  title,
  description,
  icon,
  count,
}: CategoryCardProps) {
  return (
    <Card className="overflow-hidden group transition-all hover:scale-[1.01] duration-200">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
        <div>
          <CardTitle>{title}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {count} software items
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-end items-center border-t">
        <Link href={`/launcher?category=${title.toLowerCase()}`}>
          <Button
            variant="outline"
            size="sm"
            className="transition-all group-hover:bg-primary group-hover:text-primary-foreground"
            aria-label={`Browse ${title.toLowerCase()} category`}
          >
            Browse Category
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
