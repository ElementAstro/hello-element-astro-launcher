import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeaturedSoftwareCardProps {
  title: string
  description: string
  icon: string
  downloads: string
  category: string
}

export function FeaturedSoftwareCard({ title, description, icon, downloads, category }: FeaturedSoftwareCardProps) {
  return (
    <Card className="overflow-hidden group transition-all hover:scale-[1.01] duration-200">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <Image src={icon || "/placeholder.svg"} alt={title} width={60} height={60} className="rounded-md" />
        <div>
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary" className="mt-1">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="text-sm text-muted-foreground">{downloads} downloads</div>
        <Link href={`/launcher?software=${title.toLowerCase()}`}>
          <Button
            variant="outline"
            size="sm"
            className="transition-all group-hover:bg-primary group-hover:text-primary-foreground"
            aria-label={`Launch ${title}`}>
            Launch
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}