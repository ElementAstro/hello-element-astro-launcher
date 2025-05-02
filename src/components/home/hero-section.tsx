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

export function HeroSection() {
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
        setError("加载首页数据时出错，请稍后重试");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
    <section className="w-full py-8 md:py-16 lg:py-24 bg-muted/30 transition-all relative overflow-hidden">
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
            className="container px-4 md:px-6 flex items-center justify-center min-h-[300px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: DURATION.normal }}
          >
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>加载错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2 w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                重试加载
              </Button>
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            className="container px-4 md:px-6 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                variants={fadeInUp}
              >
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.normal, delay: 0.1 }}
                  >
                    Astronomy Software Hub
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.normal, delay: 0.2 }}
                  >
                    Your one-stop platform for discovering, managing, and
                    launching astronomy and astrophotography software.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
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
                        size="lg"
                        aria-label="Launch software applications"
                        disabled={isLoading}
                        className={cn(
                          "relative overflow-hidden",
                          isLoading && "text-muted-foreground"
                        )}
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
                            />
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Launch Software
                            <ArrowRight className="ml-2 h-4 w-4" />
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
                        size="lg"
                        aria-label="Access download center"
                        disabled={isLoading}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Center
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
                      <div className="bg-background/80 rounded-full p-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: imageLoaded ? 1 : 0.9,
                      opacity: imageLoaded ? 1 : 0,
                    }}
                    transition={{ duration: DURATION.normal }}
                    className="rounded-lg overflow-hidden"
                  >
                    <Image
                      src={
                        imageError
                          ? "/placeholder.svg"
                          : "/placeholder.svg?height=400&width=400"
                      }
                      alt="Astronomy Software Hub"
                      width={400}
                      height={400}
                      className="rounded-lg object-cover"
                      onLoad={() => setImageLoaded(true)}
                      onError={handleImageError}
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
