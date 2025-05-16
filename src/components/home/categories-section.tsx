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
import { useTranslations } from "next-intl";

export function CategoriesSection() {
  const t = useTranslations("home.categories");
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
        setError(t("loadingError", { category: t(`tabs.${activeTab}`) }));
        setIsLoading(false);
      } else {
        setError(null);
        setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
        setIsLoading(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeTab, loadedTabs, t]);

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

  // 骨架屏组件
  const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          <div className="p-2.5 flex flex-row items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="p-2.5 pt-0">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[80%] mt-1.5" />
          </div>
          <div className="p-2.5 border-t flex justify-end">
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section className="w-full py-1 md:py-2 bg-muted/30 transition-all relative">
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: DURATION.slow }}
      />

      <div className="container px-0.5 md:px-1 relative z-10">
        {" "}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center space-y-1 text-center"
        >
          {" "}
          <motion.div variants={fadeInUp} className="space-y-0.5">
            <h2 className="text-base font-bold tracking-tighter md:text-lg">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-[10px] md:text-xs">
              {t("description")}
            </p>
          </motion.div>
        </motion.div>{" "}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Tabs
            defaultValue="imaging"
            className="mt-2"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            {" "}
            <TabsList
              className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 transition-all h-7"
              aria-label="Software categories"
            >
              {["imaging", "processing", "planning", "equipment"].map((tab) => (
                <motion.div
                  key={tab}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger
                    value={tab}
                    disabled={isLoading}
                    className="text-xs h-full py-0"
                  >
                    {isLoading && activeTab === tab && (
                      <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                    )}
                    {t(`tabs.${tab}`)}
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
                  className="mt-4"
                >
                  <Alert variant="destructive" className="p-3">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertTitle className="text-sm">
                      {t("loadError")}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {error}
                    </AlertDescription>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="w-full h-7 text-xs"
                      >
                        <RefreshCw className="mr-1.5 h-3 w-3" />
                        {t("retryButton")}
                      </Button>
                    </div>
                  </Alert>
                </motion.div>
              ) : (
                <>
                  <TabsContent value="imaging" className="mt-2">
                    {isLoading && activeTab === "imaging" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      >
                        {" "}
                        <CategoryCard
                          title={t("imaging.deepSpace.title")}
                          description={t("imaging.deepSpace.description")}
                          icon={<Telescope className="h-5 w-5" />}
                          count={7}
                          isLoading={isLoading && activeTab === "imaging"}
                        />{" "}
                        <CategoryCard
                          title={t("imaging.planetary.title")}
                          description={t("imaging.planetary.description")}
                          icon={<Telescope className="h-5 w-5" />}
                          count={5}
                          isLoading={isLoading && activeTab === "imaging"}
                        />{" "}
                      </motion.div>
                    )}
                  </TabsContent>
                  <TabsContent value="processing" className="mt-2">
                    {isLoading && activeTab === "processing" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      >
                        <CategoryCard
                          title={t("processing.imageStacking.title")}
                          description={t(
                            "processing.imageStacking.description"
                          )}
                          icon={<Star className="h-5 w-5" />}
                          count={3}
                          isLoading={isLoading && activeTab === "processing"}
                        />
                        <CategoryCard
                          title={t("processing.postProcessing.title")}
                          description={t(
                            "processing.postProcessing.description"
                          )}
                          icon={<Star className="h-5 w-5" />}
                          count={4}
                          isLoading={isLoading && activeTab === "processing"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>
                  <TabsContent value="planning" className="mt-2">
                    {isLoading && activeTab === "planning" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      >
                        <CategoryCard
                          title={t("planning.planetarium.title")}
                          description={t("planning.planetarium.description")}
                          icon={<Zap className="h-5 w-5" />}
                          count={3}
                          isLoading={isLoading && activeTab === "planning"}
                        />
                        <CategoryCard
                          title={t("planning.weather.title")}
                          description={t("planning.weather.description")}
                          icon={<Zap className="h-5 w-5" />}
                          count={2}
                          isLoading={isLoading && activeTab === "planning"}
                        />
                      </motion.div>
                    )}
                  </TabsContent>
                  <TabsContent value="equipment" className="mt-2">
                    {isLoading && activeTab === "equipment" ? (
                      <SkeletonCards />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      >
                        <CategoryCard
                          title={t("equipment.control.title")}
                          description={t("equipment.control.description")}
                          icon={<Telescope className="h-5 w-5" />}
                          count={6}
                          isLoading={isLoading && activeTab === "equipment"}
                        />
                        <CategoryCard
                          title={t("equipment.management.title")}
                          description={t("equipment.management.description")}
                          icon={<Telescope className="h-5 w-5" />}
                          count={3}
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
