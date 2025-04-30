import { Star, Telescope, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CategoryCard } from "./category-card";

export function CategoriesSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-muted/30 transition-all">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Software Categories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Browse software by category to find exactly what you need
            </p>
          </div>
        </div>

        <Tabs defaultValue="imaging" className="mt-8">
          <TabsList
            className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 transition-all"
            aria-label="Software categories"
          >
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>
          <TabsContent value="imaging" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in slide-in-from-left duration-300">
              <CategoryCard
                title="Deep Space"
                description="Software for capturing deep space objects like galaxies and nebulae"
                icon={<Telescope className="h-8 w-8" />}
                count={7}
              />
              <CategoryCard
                title="Planetary"
                description="Applications specialized for planetary, lunar, and solar imaging"
                icon={<Telescope className="h-8 w-8" />}
                count={5}
              />
            </div>
          </TabsContent>
          <TabsContent value="processing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Image Processing"
                description="Advanced tools for processing and enhancing astronomical images"
                icon={<Zap className="h-8 w-8" />}
                count={4}
              />
              <CategoryCard
                title="Analysis"
                description="Software for scientific analysis of astronomical data"
                icon={<Zap className="h-8 w-8" />}
                count={3}
              />
            </div>
          </TabsContent>
          <TabsContent value="planning" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Planetarium"
                description="Interactive star charts and celestial object databases"
                icon={<Star className="h-8 w-8" />}
                count={6}
              />
              <CategoryCard
                title="Session Planning"
                description="Tools for planning observation and imaging sessions"
                icon={<Star className="h-8 w-8" />}
                count={4}
              />
            </div>
          </TabsContent>
          <TabsContent value="equipment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Telescope Control"
                description="Software for controlling and automating telescopes"
                icon={<Telescope className="h-8 w-8" />}
                count={8}
              />
              <CategoryCard
                title="Camera Control"
                description="Applications for controlling astronomical cameras"
                icon={<Telescope className="h-8 w-8" />}
                count={6}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
