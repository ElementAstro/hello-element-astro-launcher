import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  fadeInUp,
  fadeInScale,
  buttonVariants,
  staggerContainer,
  DURATION,
} from "./animation-constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("home.hero");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 模拟加载状态 - 在实际项目中可以连接到真实数据加载
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 随机生成错误状态来展示错误UI (5%概率)
      if (Math.random() < 0.05) {
        setError(t("loadingError"));
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [t]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setImageError(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  return (
    <section className="w-full py-1 md:py-2 bg-muted/30 transition-all relative overflow-hidden">
      {/* 背景动画效果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow }}
      />

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            className="container px-3 md:px-4 flex items-center justify-center min-h-[250px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: DURATION.normal }}
          >
            <Alert variant="destructive" className="max-w-md p-3">
              <AlertCircle className="h-3.5 w-3.5" />
              <AlertTitle className="text-sm">{t("loadError")}</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-1.5 w-full h-7 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                {t("retryButton")}
              </Button>
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            className="container px-0.5 md:px-1 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="grid gap-1 lg:grid-cols-2 lg:gap-2 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-1.5"
                variants={fadeInUp}
              >
                {" "}
                <div className="space-y-0.5">
                  <motion.h1
                    className="text-lg font-bold tracking-tighter sm:text-xl xl:text-2xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.normal, delay: 0.1 }}
                  >
                    {t("title")}
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-xs md:text-sm text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.normal, delay: 0.2 }}
                  >
                    {t("description")}
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-1.5 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.normal, delay: 0.3 }}
                >
                  <Link href="/launcher">
                    <motion.div
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        size="default"
                        aria-label="Launch software applications"
                        disabled={isLoading}
                        className={cn("relative overflow-hidden text-sm")}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              className="absolute bottom-0 left-0 h-1 bg-primary/20"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                            />{" "}
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            {t("loading")}
                          </>
                        ) : (
                          <>
                            {t("launchButton")}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/download">
                    <motion.div
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outline"
                        size="default"
                        aria-label="Access download center"
                        disabled={isLoading}
                        className="text-sm"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        {t("downloadButton")}
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                variants={fadeInScale}
              >
                <div className="relative rounded-lg overflow-hidden">
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="bg-background/80 rounded-full p-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}

                  {!imageError ? (
                    <Image
                      src="/placeholder.svg"
                      alt="Hero Image"
                      width={500}
                      height={300}
                      className="object-cover rounded-lg"
                      priority
                      onLoad={() => setImageLoaded(true)}
                      onError={handleImageError}
                      style={{ opacity: imageLoaded ? 1 : 0 }}
                    />
                  ) : (
                    <div className="w-full h-[250px] bg-muted flex items-center justify-center rounded-lg">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature hints */}
      <motion.div
        className="container px-0.5 md:px-1 mt-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, delay: 0.5 }}
      >
        <div className="flex flex-wrap justify-center md:justify-between gap-1 text-xs text-muted-foreground">
          <div className="flex items-center">
            <motion.div
              className="h-1 w-1 rounded-full bg-green-500 mr-1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            <span>{t("feature1")}</span>
          </div>
          <div className="flex items-center">
            <motion.div
              className="h-1 w-1 rounded-full bg-blue-500 mr-1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5,
              }}
            />
            <span>{t("feature2")}</span>
          </div>
          <div className="flex items-center">
            <motion.div
              className="h-1 w-1 rounded-full bg-amber-500 mr-1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1,
              }}
            />
            <span>{t("feature3")}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
