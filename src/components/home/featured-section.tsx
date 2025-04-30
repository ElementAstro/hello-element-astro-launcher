import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedSoftwareCard } from "./featured-software-card";

export function FeaturedSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 transition-all">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Featured Software
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Discover the most popular astronomy and astrophotography
              applications
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8 animate-in fade-in duration-500">
          <FeaturedSoftwareCard
            title="N.I.N.A"
            description="NIGHTTIME IMAGING 'N' ASTRONOMY - An astrophotography imaging suite"
            icon="/placeholder.svg?height=60&width=60"
            downloads="15,420"
            category="Imaging"
          />
          <FeaturedSoftwareCard
            title="PixInsight"
            description="Advanced image processing software for astrophotography"
            icon="/placeholder.svg?height=60&width=60"
            downloads="8,760"
            category="Processing"
          />
          <FeaturedSoftwareCard
            title="Stellarium"
            description="Free open source planetarium for your computer"
            icon="/placeholder.svg?height=60&width=60"
            downloads="25,670"
            category="Planning"
          />
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/launcher">
            <Button variant="outline" aria-label="View all available software">
              View All Software
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
