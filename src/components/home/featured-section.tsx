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

export function FeaturedSection() {
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
        setError("加载推荐软件数据时出错");
      } else {
        setSoftwareDisplayed((prev) => ({ ...prev, [activeTab]: true }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

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
    <section className="w-full py-8 md:py-16 lg:py-24 transition-all relative">
      <motion.div
        className="absolute inset-0 bg-background z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
              Featured Software
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Discover the most popular astronomy and astrophotography
              applications
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full max-w-md mt-4">
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
                  <TabsTrigger value="popular">热门</TabsTrigger>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value="new">最新</TabsTrigger>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TabsTrigger value="recommended">推荐</TabsTrigger>
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
                <AlertTitle>加载错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="w-full"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    重试加载
                  </Button>
                </div>
              </Alert>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: DURATION.normal }}
                className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8"
              >
                {activeTab === "popular" && (
                  <>
                    <FeaturedSoftwareCard
                      title="N.I.N.A"
                      description="NIGHTTIME IMAGING 'N' ASTRONOMY - An astrophotography imaging suite"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="15,420"
                      category="Imaging"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="PixInsight"
                      description="Advanced image processing software for astrophotography"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="8,760"
                      category="Processing"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="Stellarium"
                      description="Free open source planetarium for your computer"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="25,670"
                      category="Planning"
                      isLoading={isLoading}
                    />
                  </>
                )}

                {activeTab === "new" && (
                  <>
                    <FeaturedSoftwareCard
                      title="ASIStudio"
                      description="ZWO's newest imaging and camera control platform"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="5,230"
                      category="Imaging"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="AstroPanel"
                      description="The newest all-in-one astrophotography control panel"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="3,184"
                      category="Control"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="DeepSkyLab"
                      description="Next generation deep sky image processing tool"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="7,390"
                      category="Processing"
                      isLoading={isLoading}
                    />
                  </>
                )}

                {activeTab === "recommended" && (
                  <>
                    <FeaturedSoftwareCard
                      title="PHD2"
                      description="Push Here Dummy autoguiding software - the gold standard for guiding"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="32,574"
                      category="Guiding"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="SharpCap"
                      description="Easy to use but powerful capture software for astronomy cameras"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="19,482"
                      category="Capture"
                      isLoading={isLoading}
                    />
                    <FeaturedSoftwareCard
                      title="ASTAP"
                      description="Astrometric STAcking Program with plate solving capabilities"
                      icon="/placeholder.svg?height=60&width=60"
                      downloads="12,157"
                      category="Analysis"
                      isLoading={isLoading}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </AnimatePresence>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mt-8"
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
                View All Software
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
