import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedSoftwareCard } from "./featured-software-card";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  staggerContainer,
  fadeInUp,
  buttonVariants,
  DURATION,
} from "./animation-constants";
import { useTranslations } from "next-intl";

export function FeaturedSection() {
  const t = useTranslations("home.featured");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [softwareDisplayed, setSoftwareDisplayed] = useState<{
    popular: boolean;
    new: boolean;
    recommended: boolean;
  }>({ popular: false, new: false, recommended: false });

  // 模拟加载状态 - 在实际项目中可以连接到真实数据加载
  useEffect(() => {
    setIsLoading(true);

    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 随机生成错误状态来展示错误UI (5%概率)
      if (Math.random() < 0.05) {
        setError(t("loadingError"));
      } else {
        setSoftwareDisplayed((prev) => ({ ...prev, [activeTab]: true }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab, t]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSoftwareDisplayed((prev) => ({ ...prev, [activeTab]: true }));
    }, 1000);
  };

  const handleTabChange = (value: string) => {
    if (value !== activeTab) {
      setActiveTab(value);

      // 如果该标签页还没有加载过数据
      if (!softwareDisplayed[value as keyof typeof softwareDisplayed]) {
        setIsLoading(true);
      }
    }
  };
  return (
    <section className="w-full py-2 md:py-3 transition-all relative">
      <motion.div
        className="absolute inset-0 bg-background z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow }}
      />

      <div className="container px-1 md:px-2 relative z-10">
        {" "}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center space-y-2 text-center"
        >
          <motion.div variants={fadeInUp} className="space-y-1">
            <h2 className="text-xl font-bold tracking-tighter md:text-2xl">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </motion.div>{" "}
          <motion.div variants={fadeInUp} className="w-full max-w-md mt-2">
            <Tabs
              defaultValue={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value="popular">{t("tabs.popular")}</TabsTrigger>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value="new">{t("tabs.new")}</TabsTrigger>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value="recommended">
                    {t("tabs.recommended")}
                  </TabsTrigger>
                </motion.div>
              </TabsList>
            </Tabs>
          </motion.div>
        </motion.div>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: DURATION.normal }}
              className="flex justify-center mt-8"
            >
              <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("loadError")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="w-full"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    {t("retryButton")}
                  </Button>
                </div>
              </Alert>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {" "}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: DURATION.normal }}
                className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4"
              >
                {activeTab === "popular" && (
                  <>
                    {" "}
                    <FeaturedSoftwareCard
                      title={t("software.nina.title")}
                      description={t("software.nina.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="15,420"
                      category={t("software.categories.imaging")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.pixInsight.title")}
                      description={t("software.pixInsight.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="8,760"
                      category={t("software.categories.processing")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.stellarium.title")}
                      description={t("software.stellarium.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="25,670"
                      category={t("software.categories.planning")}
                      isLoading={isLoading}
                    />
                  </>
                )}

                {activeTab === "new" && (
                  <>
                    {" "}
                    <FeaturedSoftwareCard
                      title={t("software.asiStudio.title")}
                      description={t("software.asiStudio.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="5,230"
                      category={t("software.categories.imaging")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.astroPanel.title")}
                      description={t("software.astroPanel.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="3,184"
                      category={t("software.categories.control")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.deepSkyLab.title")}
                      description={t("software.deepSkyLab.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="7,390"
                      category={t("software.categories.processing")}
                      isLoading={isLoading}
                    />
                  </>
                )}

                {activeTab === "recommended" && (
                  <>
                    {" "}
                    <FeaturedSoftwareCard
                      title={t("software.phd2.title")}
                      description={t("software.phd2.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="32,574"
                      category={t("software.categories.guiding")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.sharpCap.title")}
                      description={t("software.sharpCap.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="19,482"
                      category={t("software.categories.capture")}
                      isLoading={isLoading}
                    />{" "}
                    <FeaturedSoftwareCard
                      title={t("software.astap.title")}
                      description={t("software.astap.description")}
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="12,157"
                      category={t("software.categories.analysis")}
                      isLoading={isLoading}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </AnimatePresence>{" "}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mt-3"
        >
          <Link href="/launcher">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                aria-label="View all available software"
                className="relative overflow-hidden"
              >
                <motion.div
                  className="absolute -z-10 inset-0 bg-primary/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
                {t("viewAllButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
