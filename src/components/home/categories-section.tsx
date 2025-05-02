import { useState, useEffect } from "react";
import {
  Star,
  Telescope,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CategoryCard } from "./category-card";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp, staggerContainer, DURATION } from "./animation-constants";

export function CategoriesSection() {
  const [activeTab, setActiveTab] = useState("imaging");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({
    imaging: false,
    processing: false,
    planning: false,
    equipment: false,
  });

  // 模拟加载状态和处理过程
  useEffect(() => {
    if (loadedTabs[activeTab]) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      // 随机概率生成错误状态 (5%概率)
      if (Math.random() < 0.05) {
        setError(`加载${getTabName(activeTab)}类别数据失败`);
        setIsLoading(false);
      } else {
        setError(null);
        setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
        setIsLoading(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeTab, loadedTabs]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
      setIsLoading(false);
    }, 1000);
  };

  // 获取标签页名称（用于错误信息）
  const getTabName = (tab: string) => {
    switch (tab) {
      case "imaging":
        return "成像";
      case "processing":
        return "处理";
      case "planning":
        return "计划";
      case "equipment":
        return "设备";
      default:
        return tab;
    }
  };

  // 骨架屏组件
  const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          <div className="p-4 flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%] mt-2" />
          </div>
          <div className="p-4 border-t flex justify-end">
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-muted/30 transition-all relative">
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: DURATION.slow }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Software Categories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Browse software by category to find exactly what you need
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Tabs
            defaultValue="imaging"
            className="mt-8"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList
              className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 transition-all"
              aria-label="Software categories"
            >
              {["imaging", "processing", "planning", "equipment"].map((tab) => (
                <motion.div
                  key={tab}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value={tab} disabled={isLoading}>
                    {isLoading && activeTab === tab && (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    )}
                    {tab === "imaging"
                      ? "Imaging"
                      : tab === "processing"
                      ? "Processing"
                      : tab === "planning"
                      ? "Planning"
                      : "Equipment"}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>加载错误</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="w-full"
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        重试加载
                      </Button>
                    </div>
                  </Alert>
                </motion.div>
              ) : (
                <>
                  <TabsContent value="imaging" className="mt-6">
                    {isLoading && activeTab === "imaging" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      >
                        <CategoryCard
                          title="Deep Space"
                          description="Software for capturing deep space objects like galaxies and nebulae"
                          icon={<Telescope className="h-8 w-8" />}
                          count={7}
                          isLoading={isLoading && activeTab === "imaging"}
                        />
                        <CategoryCard
                          title="Planetary"
                          description="Applications specialized for planetary, lunar, and solar imaging"
                          icon={<Telescope className="h-8 w-8" />}
                          count={5}
                          isLoading={isLoading && activeTab === "imaging"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="processing" className="mt-6">
                    {isLoading && activeTab === "processing" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <CategoryCard
                          title="Image Processing"
                          description="Advanced tools for processing and enhancing astronomical images"
                          icon={<Zap className="h-8 w-8" />}
                          count={4}
                          isLoading={isLoading && activeTab === "processing"}
                        />
                        <CategoryCard
                          title="Analysis"
                          description="Software for scientific analysis of astronomical data"
                          icon={<Zap className="h-8 w-8" />}
                          count={3}
                          isLoading={isLoading && activeTab === "processing"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="planning" className="mt-6">
                    {isLoading && activeTab === "planning" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <CategoryCard
                          title="Planetarium"
                          description="Interactive star charts and celestial object databases"
                          icon={<Star className="h-8 w-8" />}
                          count={6}
                          isLoading={isLoading && activeTab === "planning"}
                        />
                        <CategoryCard
                          title="Session Planning"
                          description="Tools for planning observation and imaging sessions"
                          icon={<Star className="h-8 w-8" />}
                          count={4}
                          isLoading={isLoading && activeTab === "planning"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="equipment" className="mt-6">
                    {isLoading && activeTab === "equipment" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <CategoryCard
                          title="Telescope Control"
                          description="Software for controlling and automating telescopes"
                          icon={<Telescope className="h-8 w-8" />}
                          count={8}
                          isLoading={isLoading && activeTab === "equipment"}
                        />
                        <CategoryCard
                          title="Camera Control"
                          description="Applications for controlling astronomical cameras"
                          icon={<Telescope className="h-8 w-8" />}
                          count={6}
                          isLoading={isLoading && activeTab === "equipment"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>
                </>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
